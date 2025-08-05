export interface Message {
  sender: string;
  text: string;
}

export type MenuType = "home" | "career" | "personal" | "skills" | "edu" | "etc";

export interface ResumeSection {
  key: MenuType;
  title: string;
  content: string | React.JSX.Element;
}

// 기존 타입들 (하위 호환성을 위해 유지)
export interface MenuItem {
  key: string;
  title: string;
  content: string | React.JSX.Element;
  details?: { key: string; label: string; content: string | React.JSX.Element }[];
}

export interface SelectedMenu {
  idx: number;
  detail: number | null;
}