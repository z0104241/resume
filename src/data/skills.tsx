import type { ResumeSection } from "../types";

const skillsSection: ResumeSection = {
  key: "skills",
  title: "주요 기술/스택",
  content: (
    <ul className="list-disc ml-6 space-y-1">
      <li><strong>사용언어</strong> : Python, </li>
      <li><strong>AI & RAG</strong> : LangChain, OpenAI, Qdrant, transformers, PEFT, FastAPI, vLLM</li>
      <li><strong>Cloud & Infra (AWS)</strong> : EC2, Lambda, ECR, S3, CloudFront, API Gateway, Secrets Manager</li>
    </ul>
  ),
};

export default skillsSection;
