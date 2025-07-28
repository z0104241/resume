import json
import os
import boto3
from openai import OpenAI

# LangChain 관련 라이브러리 임포트
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.docstore.document import Document

# --- 초기 설정 ---
def get_api_key_from_s3(bucket_name, key):
    """S3에서 API 키 파일을 읽어옵니다."""
    try:
        s3 = boto3.client('s3')
        response = s3.get_object(Bucket=bucket_name, Key=key)
        return response['Body'].read().decode('utf-8').strip()
    except Exception as e:
        print(f"S3에서 API 키를 가져오는 중 오류 발생: {e}")
        raise e

# S3 버킷 정보를 코드에 직접 지정
S3_BUCKET_NAME = "openai-api-key-0728"
S3_KEY_FILE = "openai_api_key.txt"

OPENAI_API_KEY = get_api_key_from_s3(S3_BUCKET_NAME, S3_KEY_FILE)

# --- LangChain 및 AWS 서비스 클라이언트 초기화 ---
# (Lambda 콜드 스타트 최적화를 위해 핸들러 함수 밖에 위치)
try:
    # 1. LLM 및 임베딩 모델 초기화
    llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0.7, openai_api_key=OPENAI_API_KEY)
    embeddings = OpenAIEmbeddings(model="text-embedding-ada-002", openai_api_key=OPENAI_API_KEY)

    # 2. DynamoDB 캐시 테이블 초기화
    dynamodb = boto3.resource('dynamodb')
    cache_table = dynamodb.Table('ResumeCache')

    # 3. 로컬 벡터 DB(JSON) 로드 및 LangChain FAISS 인덱스 생성
    # 파일명을 resume_vec_0729_emb.json으로 수정
    with open('resume_vec_0729_emb.json', 'r', encoding='utf-8') as f:
        resume_data = json.load(f)
    
    # LangChain Document 객체 형식으로 변환
    documents = [
        Document(page_content=item['text'], metadata=item['metadata']) 
        for item in resume_data
    ]
    # 미리 계산된 임베딩을 사용하여 FAISS 인덱스 생성
    text_embeddings = [item['embedding'] for item in resume_data]
    
    # 텍스트와 임베딩을 튜플로 묶어 전달
    text_embedding_pairs = list(zip([doc.page_content for doc in documents], text_embeddings))
    
    vector_store = FAISS.from_embeddings(text_embedding_pairs, embeddings, metadatas=[doc.metadata for doc in documents])
    retriever = vector_store.as_retriever(search_kwargs={'k': 3}) # 상위 3개 문서 검색
    print("FAISS 벡터 저장소를 성공적으로 생성했습니다.")

except Exception as e:
    print(f"초기화 중 심각한 오류 발생: {e}")
    # 초기화 실패 시, 이후 모든 요청이 실패하도록 retriever를 None으로 설정
    retriever = None

# --- RAG 프롬프트 및 체인 구성 ---
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

def is_query_relevant(query: str) -> bool:
    """LLM을 사용하여 질문이 이력서와 관련이 있는지 판단합니다."""
    try:
        relevance_check_prompt = f"""
        사용자의 질문이 전재현의 경력, 기술, 프로젝트, 학력, 개인 역량 등 이력서와 관련된 내용인지 판단해주세요.
        일상적인 대화, 날씨, 스포츠 등 관련 없는 질문은 "아니오"로 답해주세요.
        오직 "예" 또는 "아니오"로만 대답해주세요.

        질문: "{query}"
        """
        
        response = llm.invoke(relevance_check_prompt)
        answer = response.content.strip()
        
        print(f"질문 관련성 판단 결과: {answer}")
        return "예" in answer

    except Exception as e:
        print(f"질문 관련성 판단 중 오류 발생: {e}")
        # 오류 발생 시 안전하게 관련 있는 것으로 판단하여 RAG를 계속 진행
        return True

def lambda_handler(event, context):
    """API Gateway 요청을 처리하는 메인 핸들러 함수"""
    if retriever is None:
        return {'statusCode': 500, 'body': json.dumps({'error': '서버 초기화에 실패했습니다. 로그를 확인해주세요.'})}

    try:
        body = json.loads(event.get('body', '{}'))
        query = body.get('prompt')

        if not query:
            return {'statusCode': 400, 'headers': { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, 'body': json.dumps({'error': '질문(prompt)이 없습니다.'})}

        # 질문 관련성 확인
        if not is_query_relevant(query):
            off_topic_answer = "이력서와 관련된 질문을 해주시면 감사하겠습니다."
            return {
                'statusCode': 200,
                'headers': { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                'body': json.dumps({'answer': off_topic_answer})
            }

        # 1. 캐시 확인 (DynamoDB)
        try:
            response = cache_table.get_item(Key={'question': query})
            if 'Item' in response:
                print("Cache HIT")
                return {'statusCode': 200, 'headers': { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, 'body': json.dumps({'answer': response['Item']['answer']})}
        except Exception as e:
            print(f"캐시 조회 중 오류: {e}")

        print("Cache MISS")
        # 2. RAG 체인 실행
        result = qa_chain.invoke({"query": query})
        answer = result.get("result", "답변을 생성하지 못했습니다.")

        # 3. 캐시 저장 (DynamoDB)
        try:
            cache_table.put_item(Item={'question': query, 'answer': answer})
        except Exception as e:
            print(f"캐시 저장 중 오류: {e}")

        return {
            'statusCode': 200,
            'headers': { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            'body': json.dumps({'answer': answer})
        }

    except Exception as e:
        print(f"전체 프로세스 오류: {e}")
        return {
            'statusCode': 500,
            'headers': { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            'body': json.dumps({'error': f'서버 내부 오류 발생: {str(e)}'})
        }
