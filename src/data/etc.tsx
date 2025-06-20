import type { ResumeSection } from "../types";


const etcSection: ResumeSection = {
  key: "etc",
  title: "기타(수상/활동)",
  content: (
    <ul className="list-disc ml-6 space-y-1">
      <li>AI 경진대회 입상</li>
      <li>기술 블로그 운영</li>
    </ul>
  ),
};
export default etcSection;
