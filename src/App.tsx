import React, { useState, useRef } from "react";
import careerSection from "./data/career";
import skillsSection from "./data/skills";
import eduSection from "./data/edu";
import etcSection from "./data/etc";
// Message 타입을 가져옵니다.
import type { ResumeSection, MenuType, Message } from "./types.tsx";
import HomePage from './data/HomePage'; 
import WelcomeAnimation from './WelcomeAnimation';

// 통합된 개인정보 섹션 생성
const personalInfoSection: ResumeSection = {
  key: "personal" as MenuType,
  title: "기타 사항",
  content: (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b-2 border-blue-200 pb-2">주요 기술/스택</h2>
        <div className="prose prose-lg max-w-none prose-slate">
          {skillsSection.content}
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b-2 border-blue-200 pb-2">학력/자격</h2>
        <div className="prose prose-lg max-w-none prose-slate">
          {eduSection.content}
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b-2 border-blue-200 pb-2">기타(수상/활동)</h2>
        <div className="prose prose-lg max-w-none prose-slate">
          {etcSection.content}
        </div>
      </section>
    </div>
  )
};

// 경력 섹션에서 details 제거
const simplifiedCareerSection: ResumeSection = {
  key: "career",
  title: "경력/프로젝트",
  content: careerSection.content
};

const resumeSections: ResumeSection[] = [
  simplifiedCareerSection,
  personalInfoSection,
];

// --- Sidebar 컴포넌트 ---
const Sidebar: React.FC<{
  menu: MenuType;
  setMenu: (m: MenuType) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  sections: ResumeSection[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isPinned: boolean;
  onPinToggle: () => void;
}> = ({ menu, setMenu, open, setOpen, sections, onMouseEnter, onMouseLeave, isPinned, onPinToggle }) => {
  
  const getMenuItemClass = (itemKey: MenuType) => 
    `w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 text-base font-medium flex items-center space-x-3 ${
      menu === itemKey 
      ? 'bg-blue-600 text-white font-semibold shadow-md' 
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;
  
  const handleMenuClick = (menuType: MenuType) => {
    setMenu(menuType);
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
          <button key={sec.key} className={getMenuItemClass(sec.key)} onClick={() => handleMenuClick(sec.key)}>
            {sec.title}
          </button>
        ))}
      </nav>
    </aside>
  );
};

// --- 메인 App 컴포넌트 ---
const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [menu, setMenu] = useState<MenuType>("home");

  // 대화 기록과 채팅 확장 상태를 App 컴포넌트에서 관리합니다.
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isChatFullScreen, setIsChatFullScreen] = useState(false);

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

  const getCurrentTitle = () => {
    if (menu === 'home') return '프로필 및 Q&A';
    const section = resumeSections.find(sec => sec.key === menu);
    return section?.title || '';
  }

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
              // HomePage에 상태와 상태 설정 함수를 props로 전달합니다.
              <HomePage 
                messages={chatMessages}
                setMessages={setChatMessages}
                isChatFullScreen={isChatFullScreen}
                setIsChatFullScreen={setIsChatFullScreen}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 w-full max-w-4xl mx-auto">
                <div className="prose prose-lg max-w-none prose-slate">
                  {resumeSections.find((sec) => sec.key === menu)?.content}
                </div>
              </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default App;