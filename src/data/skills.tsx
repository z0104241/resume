import type { ResumeSection } from "../types";

const skillsSection: ResumeSection = {
  key: "skills",
  title: "주요 기술/스택",
  content: (
    <ul className="list-disc ml-6 space-y-1">
      <li>Python (데이터/AI 전공), FastAPI, vLLM</li>
      <li>React, TypeScript, Vite</li>
      <li>Chroma/FAISS, Hugging Face</li>
    </ul>
  ),
};
export default skillsSection;
