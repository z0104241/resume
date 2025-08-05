const CareerTable = () => (
  <div className="overflow-x-auto bg-white rounded-lg">
    <table className="min-w-full w-full text-sm text-left text-gray-600">
      <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
        <tr>
          <th scope="col" className="px-6 py-3 font-semibold">사업명</th>
          <th scope="col" className="px-6 py-3 font-semibold">참여기간</th>
          <th scope="col" className="px-6 py-3 font-semibold">담당업무</th>
          <th scope="col" className="px-6 py-3 font-semibold">발주처</th>
          <th scope="col" className="px-6 py-3 font-semibold">비고</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap">Serverless RAG 기반의 AI 이력서 챗봇 시스템 개발</td>
          <td className="px-6 py-4">2025.07 ~<br/>2025.08</td>
          <td className="px-6 py-4">풀스택 개발</td>
          <td className="px-6 py-4">개인 프로젝트</td>
          <td className="px-6 py-4">React, AWS, LangChain 등</td>
        </tr>
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap">자사 인적성 검사 서비스 개발</td>
          <td className="px-6 py-4">2025.02 ~<br/>2025.06</td>
          <td className="px-6 py-4">백엔드 및 DB 설계</td>
          <td className="px-6 py-4">사내 프로젝트</td>
          <td className="px-6 py-4">SQL, EC2, 알고리즘 등</td>
        </tr>
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap">문장 순서 배열 AI 경진대회</td>
          <td className="px-6 py-4">2025.05 ~<br/>2025.06</td>
          <td className="px-6 py-4">LLM 파인튜닝 및 제출 자동화</td>
          <td className="px-6 py-4">개인 참여</td>
          <td className="px-6 py-4">QLoRA, Gemma, PEFT</td>
        </tr>
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap">AI 기반 유사 제안요청서 분석 시스템</td>
          <td className="px-6 py-4">2024.04 ~<br/>2024.07</td>
          <td className="px-6 py-4">RAG 파이프라인 구축</td>
          <td className="px-6 py-4">사내 프로젝트</td>
          <td className="px-6 py-4">LangChain, docling</td>
        </tr>
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap">동일/유사무기 체계 분석</td>
          <td className="px-6 py-4">2023.09 ~<br/>2024.02</td>
          <td className="px-6 py-4">유사도 분석 및 MLOps 구축</td>
          <td className="px-6 py-4">SI</td>
          <td className="px-6 py-4">Node2Vec, SBERT</td>
        </tr>
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap">국방기술품질원 상주 사업</td>
          <td className="px-6 py-4">2023.02 ~<br/>2024.02</td>
          <td className="px-6 py-4">서버 셋업 및 보안 관리</td>
          <td className="px-6 py-4">SI</td>
          <td className="px-6 py-4">Ubuntu, SSH</td>
        </tr>
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap">품보형태 자동 추천</td>
          <td className="px-6 py-4">2023.02 ~<br/>2023.06</td>
          <td className="px-6 py-4">시계열 분석 및 군집화</td>
          <td className="px-6 py-4">SI</td>
          <td className="px-6 py-4">PoC, Forecasting</td>
        </tr>
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap">수산자원 증대사업 효과분석</td>
          <td className="px-6 py-4">2022.06 ~<br/>2022.12</td>
          <td className="px-6 py-4">모델링 및 예측</td>
          <td className="px-6 py-4">SI</td>
          <td className="px-6 py-4">SARIMA, LSTM</td>
        </tr>
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap">Cartoon Face Generation 연구</td>
          <td className="px-6 py-4">2022.09 ~<br/>2022.11</td>
          <td className="px-6 py-4">GAN 기반 이미지 생성</td>
          <td className="px-6 py-4">개인 연구</td>
          <td className="px-6 py-4">StyleGAN2-ADA</td>
        </tr>
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap">배달 플랫폼 리뷰 데이터 분석</td>
          <td className="px-6 py-4">2021.03 ~<br/>2021.07</td>
          <td className="px-6 py-4">텍스트 마이닝 및 모델링</td>
          <td className="px-6 py-4">학부 프로젝트</td>
          <td className="px-6 py-4">TF-IDF, DNN</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default CareerTable;
