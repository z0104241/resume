import type { ResumeSection } from "../types";


const etcSection: ResumeSection = {
  key: "etc",
  title: "기타(수상/활동)",
  content: (
    <ul className="list-disc ml-6 space-y-1">
      <li>2021. 07 인천대학교 PBL 우수 졸업작품 2위</li>
      <li>2023. 02 한국SW종합학술대회 장려상</li>
      <li>2024. 10 Dacon 리뷰데이터 감정분석 경진대회 1위</li>
      <li>2025. 07 Dacon 문장 순서 배열 AI 경진대회 7위</li>
    </ul>
  ),
};
export default etcSection;
