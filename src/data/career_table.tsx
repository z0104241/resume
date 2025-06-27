// src/data/career_table.tsx

const CareerTable = () => (
  <div className="overflow-x-auto">
    <table className="min-w-[400px] w-full border border-gray-300 text-sm">
      <thead>
        <tr className="bg-gray-200 text-gray-800">
          <th className="border px-2 py-2">사업명</th>
          <th className="border px-2 py-2">참여기간<br/>(년월 ~ 년월)</th>
          <th className="border px-2 py-2">담당업무</th>
          <th className="border px-2 py-2">발주처</th>
          <th className="border px-2 py-2 w-[50px] min-w-[20px]">비고</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border px-2 py-2">한국산업기술진흥원 DX전략 및 AI재차화 지원사업 컨설팅 용역</td>
          <td className="border px-2 py-2">2024.08 ~<br/>2024.12</td>
          <td className="border px-2 py-2">참여연구원</td>
          <td className="border px-2 py-2">한국생산성본부</td>
          <td className="border px-2 py-2">-</td>
        </tr>
        <tr>
          <td className="border px-2 py-2">빅데이터 분석체계 및 차세대 IQIS ISMP 사업 용역</td>
          <td className="border px-2 py-2">2023.09 ~<br/>2024.02</td>
          <td className="border px-2 py-2">참여연구원</td>
          <td className="border px-2 py-2">국가기술표준원</td>
          <td className="border px-2 py-2">-</td>
        </tr>
        <tr>
          <td className="border px-2 py-2">국가기술표준원 빅데이터 분석과제 개념검증(PoC) 용역</td>
          <td className="border px-2 py-2">2023.02 ~<br/>2023.05</td>
          <td className="border px-2 py-2">참여연구원</td>
          <td className="border px-2 py-2">국가기술표준원</td>
          <td className="border px-2 py-2">-</td>
        </tr>
        <tr>
          <td className="border px-2 py-2">재정데이터분석전문가(FDS) 양성과정 교육 콘텐츠 개편</td>
          <td className="border px-2 py-2">2022.11 ~<br/>2022.12</td>
          <td className="border px-2 py-2">참여연구원</td>
          <td className="border px-2 py-2">한국재정정보원</td>
          <td className="border px-2 py-2">-</td>
        </tr>
        <tr>
          <td className="border px-2 py-2">빅데이터 분석기능 컨설팅</td>
          <td className="border px-2 py-2">2022.09 ~<br/>2022.10</td>
          <td className="border px-2 py-2">참여연구원</td>
          <td className="border px-2 py-2">엔티데이터 주식회사</td>
          <td className="border px-2 py-2">-</td>
        </tr>
        <tr>
          <td className="border px-2 py-2">공공 빅데이터 분석 일 경험 수련생</td>
          <td className="border px-2 py-2">2021.09 ~<br/>2022.02</td>
          <td className="border px-2 py-2">인턴</td>
          <td className="border px-2 py-2">한국정보화진흥원</td>
          <td className="border px-2 py-2">-</td>
        </tr>
        <tr>
          <td className="border px-2 py-2">서울시 복지 불균형 완화를 위한 노인복지시설 중복분석 최적 입지 분석</td>
          <td className="border px-2 py-2">2020</td>
          <td className="border px-2 py-2">팀원</td>
          <td className="border px-2 py-2">한국정보화진흥원</td>
          <td className="border px-2 py-2">-</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default CareerTable;
