import type { ResumeDetail } from "../types";

const careerDetail2: ResumeDetail = {
  label: "상세 2: 대회 경험",
  content: (
    <div>
      <table>
        <thead>
          <tr><th>대회명</th><th>수상내역</th></tr>
        </thead>
        <tbody>
          <tr><td>OO 공모전</td><td>최우수상</td></tr>
        </tbody>
      </table>
      <p>대회 경험 상세 설명입니다.</p>
    </div>
  )
};
export default careerDetail2;
