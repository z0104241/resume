# 📝 Interactive Resume with RAG Chatbot

이 저장소는 저의 이력서 내용을 기반으로 사용자와 대화하는 **인터랙티브 AI 포트폴리오 웹사이트**의 전체 소스 코드를 담고 있습니다. 사용자가 채팅을 통해 질문하면, RAG(검색 증강 생성) 기술을 활용한 AI 챗봇이 제 이력서에서 관련 정보를 찾아 답변합니다.

[**https://jjh-resume.click**]

<br>

## 🚀 아키텍처 다이어그램 (Architecture Diagram)

프로젝트는 프론트엔드와 백엔드가 명확히 분리된 Full-Stack 서버리스 아키텍처로 구성됩니다.

```
                  ┌────────────────────────┐
                  │          User          │
                  └───────────┬──────────┘
                              │
          ┌───────────────────▼───────────────────┐
          │            AWS CloudFront             │ (Global CDN)
          └───────────────────┬───────────────────┘
                              │
          ┌───────────────────▼───────────────────┐
          │   AWS S3 (Static Website Hosting)   │ (React Frontend)
          └─────────────────────────────────────┘
                              │ (API Request)
                              ▼
          ┌───────────────────┬───────────────────┐
          │          AWS API Gateway          │
          └───────────────────┬───────────────────┘
                              │
          ┌───────────────────▼───────────────────┐
          │            AWS Lambda               │ (RAG Backend)
          └───────────────────┬───────────────────┘
                              │ (Runs Container)
                              ▼
          ┌───────────────────┬───────────────────┐
          │  AWS ECR (Docker Image Repository)  │
          └─────────────────────────────────────┘

```

<br>

## 🛠️ 주요 기능 및 구현 상세

### 1. Frontend: 인터랙티브 웹 페이지

* **역할**: 사용자에게 이력서 콘텐츠를 보여주고, AI 챗봇과 상호작용할 수 있는 인터페이스를 제공합니다.

* **UI/UX 개발**: `React`와 `TypeScript`를 기반으로 반응형 웹 디자인을 적용했으며, `Tailwind CSS`를 활용하여 모던하고 직관적인 UI를 구현했습니다.

* **정적 호스팅 및 CDN 배포**:

  * `Vite`를 사용하여 React 애플리케이션을 정적 파일(HTML, CSS, JS)로 빌드합니다.

  * 빌드된 파일은 **AWS S3** 버킷에 업로드되어 정적 웹사이트로 호스팅됩니다.

  * **AWS CloudFront**를 CDN으로 구성하여 전 세계 사용자에게 빠르고 안정적인 콘텐츠를 전송하며, HTTPS 보안을 적용했습니다.

### 2. Backend: 서버리스 RAG 챗봇

* **역할**: 사용자의 질문을 이해하고, 이력서 데이터를 기반으로 가장 정확한 답변을 생성하는 AI 백엔드 로직을 수행합니다.

* **서버리스 API**: **AWS Lambda**와 **API Gateway**를 통해 요청이 있을 때만 코드가 실행되는 서버리스 API를 구축하여, 유휴 상태의 비용을 최소화했습니다.

* **지능형 검색 (RAG) 파이프라인**:

  * `LangChain` 프레임워크를 기반으로, 제 이력서 데이터를 검색하는 RAG 파이프라인을 설계했습니다.

  * 특히, LangChain의 **`SelfQueryRetriever`**를 도입하여 사용자의 자연어 질문을 분석하고, 이력서의 `project_name`, `skills`와 같은 **메타데이터를 기반으로 필터링**한 후 의미 검색을 수행하여 검색 정확도를 극대화했습니다.

* **컨테이너 기반 배포**:

  * RAG 로직을 수행하는 Python 코드와 모든 의존성 패키지를 **Docker** 이미지로 빌드했습니다.

  * 생성된 Docker 이미지는 **AWS ECR(Elastic Container Registry)**에 저장 및 버전 관리됩니다.

  * **AWS Lambda**가 ECR의 컨테이너 이미지를 직접 실행하도록 구성하여, 로컬 개발 환경과 실제 운영 환경의 일관성을 확보하고 배포 과정을 자동화했습니다.

<br>

## ⚙️ 기술 스택 (Tech Stack)

* **Frontend**: `React`, `TypeScript`, `Vite`, `Tailwind CSS`

* **Backend**: `Python`, `FastAPI`

* **AI & RAG**: `LangChain`, `OpenAI`, `Qdrant`, `transformers`, `PEFT`

* **Cloud & Infra (AWS)**: `Lambda`, `ECR`, `S3`, `CloudFront`, `API Gateway`, `Secrets Manager`

* **DevOps**: `Docker`
