export type MenuType = "home" | "career" | "skills" | "edu" | "etc";

export interface ResumeSection {
  key: MenuType;
  title: string;
  content: string | JSX.Element;
  details?: { label: string; content: string | JSX.Element }[];
}
