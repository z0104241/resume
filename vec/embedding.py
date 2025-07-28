import json
import openai
from tenacity import retry, wait_random_exponential, stop_after_attempt
import sys
import os

# --- 설정 (Configuration) ---
# 사용할 임베딩 모델
EMBEDDING_MODEL = "text-embedding-ada-002"

# --- JSON 파일에서 데이터 불러오기 (Load Data from JSON file) ---
def load_data_from_json(filename: str) -> list:
    """지정된 JSON 파일에서 벡터 DB 데이터를 불러옵니다."""
    # 1. 파일 경로 확인
    if not os.path.exists(filename):
        print(f"오류: '{filename}' 파일을 찾을 수 없습니다. 스크립트와 동일한 디렉토리에 파일이 있는지 확인해주세요.")
        sys.exit(1) # 파일이 없으면 스크립트 종료
        
    # 2. 파일 읽기 및 파싱
    try:
        with open(filename, "r", encoding="utf-8") as f:
            data = json.load(f)
            print(f"'{filename}' 파일에서 데이터를 성공적으로 불러왔습니다.")
            return data
    except json.JSONDecodeError:
        print(f"오류: '{filename}' 파일이 올바른 JSON 형식이 아닙니다.")
        sys.exit(1) # JSON 형식이 아니면 스크립트 종료
    except Exception as e:
        print(f"파일을 읽는 중 오류가 발생했습니다: {e}")
        sys.exit(1) # 기타 오류 발생 시 스크립트 종료


# --- 임베딩 생성 함수 (Embedding Generation Function) ---
# API 요청 중 일시적인 오류가 발생할 경우, 재시도 로직을 추가하여 안정성을 높입니다.
@retry(wait=wait_random_exponential(min=1, max=20), stop=stop_after_attempt(6))
def get_embedding(text: str, model: str) -> list[float]:
    """주어진 텍스트에 대한 임베딩 벡터를 반환합니다."""
    text = text.replace("\n", " ")
    # openai v1.0.0 이상에서는 client를 생성하여 사용해야 합니다.
    client = openai.OpenAI(api_key=openai.api_key)
    response = client.embeddings.create(input=[text], model=model)
    return response.data[0].embedding


# --- 메인 실행 로직 (Main Execution Logic) ---
def main():
    """벡터 DB 데이터의 각 항목에 대해 임베딩을 생성하고 결과를 출력합니다."""
    
    # 1. API 키를 터미널에서 입력받기
    try:
        # getpass 대신 input() 함수를 사용합니다.
        api_key = input("OpenAI API 키를 입력하세요: ")
        if not api_key:
            print("API 키가 입력되지 않았습니다. 스크립트를 종료합니다.")
            sys.exit(1)
        openai.api_key = api_key
    except Exception as e:
        print(f"API 키를 입력받는 중 오류가 발생했습니다: {e}")
        sys.exit(1)

    # 2. JSON 파일에서 데이터 불러오기
    input_filename = "resume_vec_0729.json"
    vector_db_data = load_data_from_json(input_filename)
    
    # 3. 임베딩 생성
    print("\n임베딩 생성을 시작합니다...")
    
    total_items = len(vector_db_data)
    for i, item in enumerate(vector_db_data):
        # 'embedding' 필드가 이미 채워져 있는지 확인하고, 비어있을 경우에만 임베딩을 생성합니다.
        if item.get("embedding") and len(item.get("embedding")) > 0:
            print(f"({i+1}/{total_items}) ID: {item.get('id', 'N/A')} - 이미 임베딩이 존재하여 건너뜁니다.")
            continue
            
        try:
            print(f"({i+1}/{total_items}) ID: {item.get('id', 'N/A')} - 임베딩 중...")
            # 'text' 필드의 내용을 가져와 임베딩을 생성합니다.
            embedding_vector = get_embedding(item['text'], EMBEDDING_MODEL)
            # 생성된 임베딩 벡터를 'embedding' 필드에 저장합니다.
            item['embedding'] = embedding_vector
            print(f"({i+1}/{total_items}) ID: {item.get('id', 'N/A')} - 임베딩 성공!")
        except Exception as e:
            print(f"({i+1}/{total_items}) ID: {item.get('id', 'N/A')} - 임베딩 중 오류 발생: {e}")
            item['embedding'] = []

    print("\n모든 임베딩 생성이 완료되었습니다.")
    
    # 4. 결과 저장
    # 원본 파일 이름에 '_with_embeddings'를 추가하여 출력 파일명을 만듭니다.
    output_filename = input_filename.replace(".json", "") + "_emb.json"
    with open(output_filename, "w", encoding="utf-8") as f:
        # ensure_ascii=False 옵션으로 한글이 깨지지 않도록 합니다.
        # indent=2 옵션으로 가독성 좋게 출력합니다.
        json.dump(vector_db_data, f, ensure_ascii=False, indent=2)
        
    print(f"\n결과가 '{output_filename}' 파일로 저장되었습니다.")


if __name__ == "__main__":
    main()
