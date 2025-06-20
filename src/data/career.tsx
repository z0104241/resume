import type { ResumeSection } from "../types";
import careerDetail1 from "./career_detail_1";
import careerDetail2 from "./career_detail_2";
import careerDetail3 from "./career_detail_3";

const careerSection: ResumeSection = {
  key: "career",
  title: "경력/프로젝트",
  content: (
    <ul className="list-disc ml-6 space-y-1">
      <li><b>데이터분석, LLM 엔지니어</b> - 실무 및 대회 경험 다수</li>
      <li><b>프론트엔드 개발</b> - React 기반 웹 서비스 구현</li>
      <li><b>프로젝트:</b> 문장순서 예측, RAG 시스템, AI 서비스 개발 등</li>
    </ul>
  ),
  details: [
    careerDetail1,
    careerDetail2,
    careerDetail3
  ]
};
export default careerSection;
