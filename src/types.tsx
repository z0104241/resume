// 기존에 정의된 타입들
export type MenuType = "home" | "career" | "skills" | "edu" | "etc";

export type ResumeDetail = { label: string; content: string | JSX.Element };

export interface ResumeSection {
  key: MenuType;
  title: string;
  content: string | JSX.Element;
  details?: ResumeDetail[];
}

// --- 추가된 타입 정의 ---

// MainArea.tsx에서 사용하는 타입으로, ResumeSection과 동일한 구조를 가집니다.
export type MenuItem = ResumeSection;

// MainArea.tsx에서 사용하는 타입으로, 선택된 메뉴의 인덱스와 상세 정보 인덱스를 가집니다.
export type SelectedMenu = {
  idx: number;
  detail: number | null;
};
