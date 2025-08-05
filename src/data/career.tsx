import type { ResumeSection } from "../types";
import CareerTable from "./career_table"; // 표 컴포넌트


const careerSection: ResumeSection = {
  key: "career",
  title: "경력/프로젝트",
  // 메인 패널에 표만 보여줌 (간단 요약 or 전체 요약)
  content: <CareerTable />

};

export default careerSection;
