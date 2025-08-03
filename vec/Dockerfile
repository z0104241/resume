# AWS Lambda Python 3.9 기본 이미지 사용
FROM public.ecr.aws/lambda/python:3.9

# 작업 디렉토리 설정
WORKDIR /var/task

# 빌드 도구 설치 (g++, gcc, make 등)
RUN yum install -y gcc-c++ gcc make python3-devel

# Python 패키지 설치 (캐시 사용하지 않음)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 애플리케이션 파일들 복사
COPY rag_handler.py .
COPY resume_vec_0729_emb.json .

# Lambda 핸들러 설정
CMD ["rag_handler.lambda_handler"]