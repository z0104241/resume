import type { ResumeSection } from "../types";


const eduSection: ResumeSection = {
  key: "edu",
  title: "학력/자격",
  content: (
    <ul className="list-disc ml-6 space-y-1">
      <li>2022. 02 인천대학교 산업경영공학과 졸업</li>
      <li>2022. 12 빅데이터분석기사 취득</li>
    </ul>
  ),
};
export default eduSection;
