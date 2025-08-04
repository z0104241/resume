import json
import os
import boto3
import traceback

# LangChain 핵심 라이브러리 임포트
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.docstore.document import Document
from langchain_qdrant import QdrantVectorStore
# --- [추가됨] Self-Querying Retriever 관련 라이브러리 ---
from langchain.retrievers.self_query.base import SelfQueryRetriever
from langchain.chains.query_constructor.base import AttributeInfo
# --- [추가 끝] ---

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
S3_API_KEY_BUCKET = "openai-api-key-0728"
S3_API_KEY_FILE = "openai_api_key.txt"
WEB_ORIGIN = "https://jjh-resume.click"

# 벡터 DB JSON 파일이 저장된 S3 정보
S3_VECTOR_BUCKET = "resume-vec-db"
S3_VECTOR_KEY = "resume_vec_emb.json" # 최신화된 파일 이름으로 변경

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
    """
    global llm, embeddings, dynamodb, cache_table, vectorstore, retriever, qa_chain

    try:
        OPENAI_API_KEY = get_api_key_from_s3(S3_API_KEY_BUCKET, S3_API_KEY_FILE)

        llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0.7, openai_api_key=OPENAI_API_KEY)
        embeddings = OpenAIEmbeddings(model="text-embedding-ada-002", openai_api_key=OPENAI_API_KEY)

        dynamodb = boto3.resource('dynamodb')
        cache_table = dynamodb.Table('ResumeCache')

        s3_client = boto3.client('s3')
        local_filepath = f"/tmp/{S3_VECTOR_KEY}"
        try:
            s3_client.download_file(S3_VECTOR_BUCKET, S3_VECTOR_KEY, local_filepath)
        except Exception as e:
            print(f"S3에서 벡터 DB 파일 다운로드 중 오류 발생: {e}")
            raise e

        with open(local_filepath, 'r', encoding='utf-8') as f:
            resume_data = json.load(f)

        qdrant_client = QdrantClient(":memory:")
        collection_name = "resume_collection"
        embedding_dim = 1536 # text-embedding-ada-002의 임베딩 차원

        qdrant_client.recreate_collection(
            collection_name=collection_name,
            vectors_config=models.VectorParams(size=embedding_dim, distance=models.Distance.COSINE)
        )

        # 임베딩 값이 없는 경우를 대비하여 빈 리스트로 초기화
        for item in resume_data:
            if 'embedding' not in item or not item['embedding']:
                item['embedding'] = [0.0] * embedding_dim

        points = [
            models.PointStruct(
                id=idx,
                vector=item['embedding'],
                payload={"page_content": item['text'], "metadata": item['metadata']}
            )
            for idx, item in enumerate(resume_data)
        ]
        qdrant_client.upsert(collection_name=collection_name, points=points, wait=True)

        vectorstore = QdrantVectorStore(
            client=qdrant_client,
            collection_name=collection_name,
            embedding=embeddings,
            content_payload_key="page_content",
            metadata_payload_key="metadata"
        )

        # --- [수정됨] SelfQueryRetriever 설정 ---
        # 1. 메타데이터 필드 정보 정의
        metadata_field_info = [
            AttributeInfo(name="project_name", description="프로젝트의 공식 명칭", type="string"),
            AttributeInfo(name="category", description="경험의 대분류 (예: '회사 업무', '개인 역량 강화', '학술 활동')", type="string"),
            AttributeInfo(name="type", description="경험의 소분류 (예: '학부 프로젝트', '인턴십', '고객사 SI', '경진대회')", type="string"),
            AttributeInfo(name="technique_type", description="프로젝트 내에서 수행한 구체적인 기술 역할 (예: '모델 아키텍처 설계', '데이터 중심 문제 해결')", type="string"),
            AttributeInfo(name="start_date", description="프로젝트 시작일 (YYYY-MM-DD 형식)", type="string"),
            AttributeInfo(name="skills", description="프로젝트에 사용된 기술 스택 또는 역량 목록", type="string"),
            AttributeInfo(name="achievement", description="프로젝트를 통해 달성한 구체적인 성과", type="string"),
        ]

        # 2. 문서 내용에 대한 설명
        document_content_description = "한 지원자의 이력서에 담긴 특정 프로젝트 경험이나 역량에 대한 상세 설명"

        # 3. Self-Querying Retriever 생성
        retriever = SelfQueryRetriever.from_llm(
            llm,
            vectorstore,
            document_content_description,
            metadata_field_info,
            verbose=True # 개발 및 디버깅 시 True로 설정하면 내부 동작 확인 가능
        )
        # --- [수정 끝] ---

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
        PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "question"])

        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
            chain_type_kwargs={"prompt": PROMPT},
            return_source_documents=False
        )
        return True

    except Exception as e:
        print(f"초기화 중 심각한 오류 발생: {e}")
        print(f"상세 오류 정보: {traceback.format_exc()}")
        return False

def lambda_handler(event, context):
    """AWS Lambda의 메인 핸들러 함수"""
    global qa_chain
    
    request_context = event.get('requestContext', {})
    http_info = request_context.get('http', {})
    request_method = http_info.get('method')

    if request_method == 'OPTIONS':
        return {
            'statusCode': 204,
            'headers': {
                'Access-Control-Allow-Origin': WEB_ORIGIN,
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
            },
            'body': ''
        }

    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": WEB_ORIGIN
    }

    if qa_chain is None:
        if not initialize_services():
            return {
                'statusCode': 500, 
                'headers': headers,
                'body': json.dumps({'error': '서버 초기화에 실패했습니다. CloudWatch 로그를 확인해주세요.'})
            }

    try:
        body = json.loads(event.get('body', '{}'))
        query = body.get('prompt')

        if not query:
            return {
                'statusCode': 400, 
                'headers': headers, 
                'body': json.dumps({'error': '질문(prompt)이 없습니다.'})
            }
        
        result = qa_chain.invoke({"query": query})
        answer = result.get("result", "답변을 생성하지 못했습니다.")

        try:
            cache_table.put_item(Item={'question': query, 'answer': answer})
        except Exception as e:
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
