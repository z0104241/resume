import type React from 'react';

// 대화 메시지 타입을 추가합니다.
export type Message = {
  sender: 'user' | 'ai';
  text: string;
};

// 기존에 정의된 타입들
export type MenuType = "home" | "career" | "skills" | "edu" | "etc";

export type ResumeDetail = { label: string; content: string | React.JSX.Element };

export interface ResumeSection {
  key: MenuType;
  title: string;
  content: string | React.JSX.Element;
  details?: { label: string; content: string | React.JSX.Element }[];
}

export type MenuItem = ResumeSection;

export type SelectedMenu = {
  idx: number;
  detail: number | null;
};
