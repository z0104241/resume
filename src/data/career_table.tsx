// src/data/career_table.tsx

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
          <td className="px-6 py-4 whitespace-nowrap">한국산업기술진흥원 DX전략 및 AI재차화 지원사업 컨설팅 용역</td>
          <td className="px-6 py-4">2024.08 ~<br/>2024.12</td>
          <td className="px-6 py-4">참여연구원</td>
          <td className="px-6 py-4">한국생산성본부</td>
          <td className="px-6 py-4">-</td>
        </tr>
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap">빅데이터 분석체계 및 차세대 IQIS ISMP 사업 용역</td>
          <td className="px-6 py-4">2023.09 ~<br/>2024.02</td>
          <td className="px-6 py-4">참여연구원</td>
          <td className="px-6 py-4">국가기술표준원</td>
          <td className="px-6 py-4">-</td>
        </tr>
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap">국가기술표준원 빅데이터 분석과제 개념검증(PoC) 용역</td>
          <td className="px-6 py-4">2023.02 ~<br/>2023.05</td>
          <td className="px-6 py-4">참여연구원</td>
          <td className="px-6 py-4">국가기술표준원</td>
          <td className="px-6 py-4">-</td>
        </tr>
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap">재정데이터분석전문가(FDS) 양성과정 교육 콘텐츠 개편</td>
          <td className="px-6 py-4">2022.11 ~<br/>2022.12</td>
          <td className="px-6 py-4">참여연구원</td>
          <td className="px-6 py-4">한국재정정보원</td>
          <td className="px-6 py-4">-</td>
        </tr>
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap">빅데이터 분석기능 컨설팅</td>
          <td className="px-6 py-4">2022.09 ~<br/>2022.10</td>
          <td className="px-6 py-4">참여연구원</td>
          <td className="px-6 py-4">엔티데이터 주식회사</td>
          <td className="px-6 py-4">-</td>
        </tr>
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap">공공 빅데이터 분석 일 경험 수련생</td>
          <td className="px-6 py-4">2021.09 ~<br/>2022.02</td>
          <td className="px-6 py-4">인턴</td>
          <td className="px-6 py-4">한국정보화진흥원</td>
          <td className="px-6 py-4">-</td>
        </tr>
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap">서울시 복지 불균형 완화를 위한 노인복지시설 중복분석 최적 입지 분석</td>
          <td className="px-6 py-4">2020</td>
          <td className="px-6 py-4">팀원</td>
          <td className="px-6 py-4">한국정보화진흥원</td>
          <td className="px-6 py-4">-</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default CareerTable;
