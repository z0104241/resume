import json
import os
import boto3
from openai import OpenAI
import traceback

# LangChain 핵심 라이브러리 임포트
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.docstore.document import Document
from langchain_qdrant import QdrantVectorStore

# Qdrant 직접 사용
from qdrant_client import QdrantClient
from qdrant_client import models

# --- 초기 설정 ---
def get_api_key_from_s3(bucket_name, key):
    """S3에서 API 키를 안전하게 가져오는 함수"""
    try:
        s3 = boto3.client('s3')
        response = s3.get_object(Bucket=bucket_name, Key=key)
        return response['Body'].read().decode('utf-8').strip()
    except Exception as e:
        print(f"S3에서 API 키를 가져오는 중 오류 발생: {e}")
        raise e

# --- 전역 변수 ---
S3_BUCKET_NAME = "openai-api-key-0728"
S3_KEY_FILE = "openai_api_key.txt"
WEB_ORIGIN = "https://jjh-resume.click" # 허용할 웹페이지 주소

# Cold Start 최적화를 위해 전역 범위에 서비스 변수 선언
llm = None
embeddings = None
dynamodb = None
cache_table = None
vectorstore = None
retriever = None
qa_chain = None

def initialize_services():
    """
    Lambda 실행에 필요한 모든 서비스(LLM, Embeddings, DB 등)를 초기화합니다.
    이 함수는 람다의 Cold Start 시에만 실행됩니다.
    """
    global llm, embeddings, dynamodb, cache_table, vectorstore, retriever, qa_chain

    try:
        print("서비스 초기화 시작...")
        
        OPENAI_API_KEY = get_api_key_from_s3(S3_BUCKET_NAME, S3_KEY_FILE)
        print("API 키 로드 완료")

        print("ChatOpenAI 초기화 시작...")
        llm = ChatOpenAI(
            model_name="gpt-4o-mini",
            temperature=0.7,
            openai_api_key=OPENAI_API_KEY
        )
        print("ChatOpenAI 초기화 완료")

        embeddings = OpenAIEmbeddings(
            model="text-embedding-ada-002",
            openai_api_key=OPENAI_API_KEY
        )
        print("LLM 및 임베딩 모델 초기화 완료")

        dynamodb = boto3.resource('dynamodb')
        cache_table = dynamodb.Table('ResumeCache')
        print("DynamoDB 테이블 초기화 완료")

        print("벡터 데이터 로드 시작...")
        with open('resume_vec_0729_emb.json', 'r', encoding='utf-8') as f:
            resume_data = json.load(f)
        print(f"벡터 데이터 로드 완료: {len(resume_data)}개 문서")

        qdrant_client = QdrantClient(":memory:")
        print("Qdrant 클라이언트 초기화 완료")
        
        collection_name = "resume_collection"
        embedding_dim = 1536

        qdrant_client.recreate_collection(
            collection_name=collection_name,
            vectors_config=models.VectorParams(
                size=embedding_dim,
                distance=models.Distance.COSINE
            )
        )
        print("Qdrant 컬렉션 생성 완료")

        points = []
        for idx, item in enumerate(resume_data):
            point = models.PointStruct(
                id=idx,
                vector=item['embedding'],
                payload={
                    "page_content": item['text'],
                    "metadata": item['metadata']
                }
            )
            points.append(point)

        qdrant_client.upsert(collection_name=collection_name, points=points, wait=True)
        print("벡터 데이터 삽입 완료")

        print("Qdrant 벡터 저장소 생성 시작...")
        vectorstore = QdrantVectorStore(
            client=qdrant_client,
            collection_name=collection_name,
            embedding=embeddings,
            content_payload_key="page_content",
            metadata_payload_key="metadata"
        )
        print("Qdrant 벡터 저장소 생성 완료")

        retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
        print("Retriever 생성 완료")

        prompt_template = """
당신은 전재현 님의 이력서에 대해 답변하는 친절한 AI 어시스턴트입니다.
주어진 이력서 내용을 바탕으로, 면접관의 질문에 대한 답변을 생성해주세요.
반드시 주어진 내용 안에서만 사실에 기반하여 답변하고, 내용을 지어내지 마세요.
--- 이력서 내용 ---
{context}
--------------------
질문: {question}
답변 (한국어로 작성):
"""
        PROMPT = PromptTemplate(
            template=prompt_template, input_variables=["context", "question"]
        )

        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
            chain_type_kwargs={"prompt": PROMPT},
            return_source_documents=False
        )
        print("RAG 체인 생성 완료")
        return True

    except Exception as e:
        print(f"초기화 중 심각한 오류 발생: {e}")
        print(f"상세 오류 정보: {traceback.format_exc()}")
        return False

def lambda_handler(event, context):
    """AWS Lambda의 메인 핸들러 함수"""
    global qa_chain
    
    # --- [수정된 부분] ---
    # HTTP API v2.0 페이로드 형식에 맞게 OPTIONS 요청을 확인합니다.
    # 이전 방식인 event.get('httpMethod') 대신 requestContext에서 http.method를 확인합니다.
    request_context = event.get('requestContext', {})
    http_info = request_context.get('http', {})
    request_method = http_info.get('method')

    # CORS Preflight 요청(OPTIONS)을 직접 처리하는 코드
    if request_method == 'OPTIONS':
        return {
            'statusCode': 204, # 성공했지만 컨텐츠는 없다는 의미
            'headers': {
                'Access-Control-Allow-Origin': WEB_ORIGIN,
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
            },
            'body': '' # body는 비어있어야 함
        }
    # --- [수정 끝] ---

    # 공통 헤더 정의
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": WEB_ORIGIN
    }

    # Cold Start 시 또는 어떤 이유로든 서비스가 초기화되지 않았을 경우 초기화 실행
    if qa_chain is None:
        print("서비스가 초기화되지 않아 새로 시작합니다.")
        if not initialize_services():
            return {
                'statusCode': 500, 
                'headers': headers,
                'body': json.dumps({'error': '서버 초기화에 실패했습니다. CloudWatch 로그를 확인해주세요.'})
            }

    try:
        # POST 요청 처리
        body = json.loads(event.get('body', '{}'))
        query = body.get('prompt')

        if not query:
            return {
                'statusCode': 400, 
                'headers': headers, 
                'body': json.dumps({'error': '질문(prompt)이 없습니다.'})
            }
        
        print(f"수신된 질문: {query}")
        
        # 캐시를 사용하지 않고 항상 새로운 답변 생성
        print("Cache logic is disabled. Generating a new response.")
        result = qa_chain.invoke({"query": query})
        answer = result.get("result", "답변을 생성하지 못했습니다.")
        print(f"생성된 답변: {answer}")

        # 생성된 답변은 나중을 위해 캐시에 저장 (선택적)
        try:
            cache_table.put_item(Item={'question': query, 'answer': answer})
        except Exception as e:
            # 캐시 저장 실패는 전체 흐름에 영향을 주지 않도록 로그만 남김
            print(f"캐시 저장 중 오류 발생 (무시됨): {e}")

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'answer': answer})
        }

    except Exception as e:
        print(f"전체 프로세스 처리 중 오류 발생: {e}")
        print(f"상세 오류 정보: {traceback.format_exc()}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'서버 내부 오류가 발생했습니다: {str(e)}'})
        }
