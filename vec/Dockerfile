# 1. AWS에서 제공하는 파이썬 3.9 버전을 기반으로 이미지를 만듭니다.
FROM public.ecr.aws/lambda/python:3.9

# 2. 작업 디렉토리를 /var/task로 설정합니다.
WORKDIR /var/task

# 3. requirements.txt 파일을 이미지 안으로 복사합니다.
COPY requirements.txt .

# 4. pip를 사용해 라이브러리를 설치합니다.
# (cmake 설치 라인 삭제)
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 5. 필요한 코드와 json 파일을 이미지 안으로 복사합니다.
COPY rag_handler.py .
COPY resume_vec_0729_emb.json .

# 6. Lambda가 호출할 핸들러 함수를 지정합니다. (파일명.함수명)
CMD ["rag_handler.lambda_handler"]