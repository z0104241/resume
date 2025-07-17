import React, { useState, useRef } from "react";
import careerSection from "./data/career";
import skillsSection from "./data/skills";
import eduSection from "./data/edu";
import etcSection from "./data/etc";
import type { ResumeSection, MenuType } from "./types.tsx";
import HomePage from './data/HomePage'; 
import WelcomeAnimation from './WelcomeAnimation'; // 새로 만든 WelcomeAnimation 컴포넌트를 가져옵니다.

// 이력서 섹션 데이터
const resumeSections: ResumeSection[] = [
  careerSection,
  skillsSection,
  eduSection,
  etcSection,
];

// --- Sidebar 컴포넌트 ---
const Sidebar: React.FC<{
  menu: MenuType;
  setMenu: (m: MenuType) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  sections: ResumeSection[];
  selectedDetail: number | null;
  setSelectedDetail: (idx: number | null) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isPinned: boolean;
  onPinToggle: () => void;
}> = ({ menu, setMenu, open, setOpen, sections, selectedDetail, setSelectedDetail, onMouseEnter, onMouseLeave, isPinned, onPinToggle }) => {
  
  const getMenuItemClass = (itemKey: MenuType) => 
    `w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 text-base font-medium flex items-center space-x-3 ${
      menu === itemKey 
      ? 'bg-blue-600 text-white font-semibold shadow-md' 
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  const getDetailItemClass = (index: number) => 
    `w-full text-left pl-10 pr-4 py-2 rounded-md transition-colors duration-200 text-sm ${
      selectedDetail === index
      ? 'text-blue-600 font-bold'
      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
    }`;
  
  const handleMenuClick = (menuType: MenuType, detailIndex: number | null = null) => {
    setMenu(menuType);
    setSelectedDetail(detailIndex);
    if (!isPinned) {
      setOpen(false);
    }
  }

  return (
    <aside
      className={`h-screen w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out fixed z-30 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      style={{ minWidth: "18rem" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex items-center justify-between h-16 border-b border-slate-200 px-4">
        <span className="font-bold text-xl text-slate-800 tracking-tight">Résumé Menu</span>
        <button
          className={`p-2 rounded-full transition-colors ${isPinned ? 'text-blue-600 bg-blue-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
          onClick={onPinToggle}
          title={isPinned ? "사이드바 고정 해제" : "사이드바 고정"}
        >
          {isPinned ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          )}
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-1.5">
        <button className={getMenuItemClass("home")} onClick={() => handleMenuClick("home")}>
          프로필 및 Q&A
        </button>
        {sections.map((sec) => (
          <div key={sec.key}>
            <button className={getMenuItemClass(sec.key)} onClick={() => handleMenuClick(sec.key)}>
              {sec.title}
            </button>
            {sec.key === "career" && menu === "career" && sec.details && (
              <div className="mt-2 space-y-1">
                {sec.details.map((detail, idx) => (
                  <button key={detail.label} className={getDetailItemClass(idx)} onClick={() => handleMenuClick(sec.key, idx)}>
                    {detail.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

// --- 메인 App 컴포넌트 ---
const App: React.FC = () => {
  // 환영 애니메이션 표시 여부를 제어하는 상태를 추가합니다.
  const [showWelcome, setShowWelcome] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [selectedDetail, setSelectedDetail] = useState<number | null>(null);
  const [menu, setMenu] = useState<MenuType>("home");

  const leaveTimeout = useRef<number | null>(null);

  const handleMouseEnter = () => {
    if (isPinned) return;
    if (leaveTimeout.current) {
      clearTimeout(leaveTimeout.current);
    }
    setSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    if (isPinned) return;
    leaveTimeout.current = window.setTimeout(() => {
      setSidebarOpen(false);
    }, 200);
  };
  
  const handleToggleClick = () => {
    if (isPinned) return;
    if (leaveTimeout.current) {
      clearTimeout(leaveTimeout.current);
    }
    setSidebarOpen(!sidebarOpen);
  };
  
  const handlePinToggle = () => {
    setIsPinned(!isPinned);
    if (!isPinned) {
      setSidebarOpen(true);
    }
  };

  async function handleQuery() {
    if (!prompt.trim()) {
      setAnswer("질문을 입력해주세요.");
      return;
    }
    setAnswer("AI가 답변을 생성 중입니다...");
    try {
      const res = await fetch("http://localhost:3001/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error(`서버 오류: ${res.statusText}`);
      const data = await res.json();
      setAnswer(data.answer);
    } catch (e) {
      console.error(e);
      setAnswer("서버 연결에 실패했습니다. 로컬 개발 환경인지 확인해주세요.");
    }
  }

  const getCurrentTitle = () => {
    if (menu === 'home') return '프로필 및 Q&A';
    const section = resumeSections.find(sec => sec.key === menu);
    if (section && menu === 'career' && selectedDetail !== null) {
      return section.details?.[selectedDetail]?.label || section.title;
    }
    return section?.title || '';
  }

  // 환영 애니메이션이 활성화 상태이면 애니메이션 컴포넌트를 렌더링합니다.
  if (showWelcome) {
    return <WelcomeAnimation onAnimationEnd={() => setShowWelcome(false)} />;
  }

  return (
    <div className="bg-slate-50 min-h-screen relative">
      <div 
        className="fixed top-0 left-0 h-full w-12 z-20"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <Sidebar
        menu={menu}
        setMenu={setMenu}
        open={sidebarOpen || isPinned}
        setOpen={setSidebarOpen}
        sections={resumeSections}
        selectedDetail={selectedDetail}
        setSelectedDetail={setSelectedDetail}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        isPinned={isPinned}
        onPinToggle={handlePinToggle}
      />
      
      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${isPinned ? 'lg:ml-72' : ''}`}>
        <header className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-10 h-16">
            <div className="flex items-center gap-2">
              <button
                className="text-slate-600 hover:text-slate-900 p-2 rounded-full hover:bg-slate-100"
                onClick={handleToggleClick}
                title="메뉴 토글"
                disabled={isPinned}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg font-bold text-slate-800">{getCurrentTitle()}</h1>
            </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8">
            {menu === "home" ? (
              <HomePage 
                prompt={prompt}
                setPrompt={setPrompt}
                answer={answer}
                handleQuery={handleQuery}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 w-full max-w-4xl mx-auto">
                <div className="prose prose-lg max-w-none prose-slate">
                  {menu === "career" && selectedDetail !== null
                    ? resumeSections.find((sec) => sec.key === "career")!.details![selectedDetail].content
                    : resumeSections.find((sec) => sec.key === menu)?.content}
                </div>
              </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default App;
