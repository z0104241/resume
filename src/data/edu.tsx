import type { ResumeSection } from "../types";


const eduSection: ResumeSection = {
  key: "edu",
  title: "학력/자격",
  content: (
    <ul className="list-disc ml-6 space-y-1">
      <li>OO대학교 AI학과 졸업</li>
      <li>정보처리기사, 빅데이터분석기사 등</li>
    </ul>
  ),
};
export default eduSection;
