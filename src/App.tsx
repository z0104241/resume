import React, { useState } from "react";
import careerSection from "./data/career";
import skillsSection from "./data/skills";
import eduSection from "./data/edu";
import etcSection from "./data/etc";
import type { ResumeSection, MenuType } from "./types.tsx";
import HomePage from './data/HomePage'; 

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
}> = ({ menu, setMenu, open, setOpen, sections, selectedDetail, setSelectedDetail }) => {
  
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
  
  // 메뉴 아이템 클릭 시 항상 사이드바를 닫도록 수정
  const handleMenuClick = (menuType: MenuType, detailIndex: number | null = null) => {
    setMenu(menuType);
    setSelectedDetail(detailIndex);
    setOpen(false);
  }

  return (
    // 사이드바를 항상 fixed로 설정하고, open 상태에 따라 translate-x로 제어
    <aside
      className={`h-screen w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out fixed z-30 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      style={{ minWidth: "18rem" }}
    >
      <div className="flex items-center justify-between h-16 border-b border-slate-200 px-4">
        <span className="font-bold text-xl text-slate-800 tracking-tight">Résumé Menu</span>
        {/* 닫기 버튼은 모바일에서만 보이도록 유지 */}
        <button
          className="text-slate-500 hover:text-slate-900 p-2 rounded-full hover:bg-slate-100 lg:hidden"
          onClick={() => setOpen(false)}
          title="사이드바 닫기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
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
  // 사이드바의 초기 상태를 false(닫힘)로 설정
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [selectedDetail, setSelectedDetail] = useState<number | null>(null);
  const [menu, setMenu] = useState<MenuType>("home");
  
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

  return (
    <div className="bg-slate-50 min-h-screen">
      <Sidebar
        menu={menu}
        setMenu={setMenu}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        sections={resumeSections}
        selectedDetail={selectedDetail}
        setSelectedDetail={setSelectedDetail}
      />
      
      {/* 사이드바가 열렸을 때 화면 전체에 오버레이 표시 */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-20" onClick={() => setSidebarOpen(false)}></div>}
      
      {/* 메인 컨텐츠 영역: 더 이상 사이드바에 의해 밀려나지 않음 */}
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-10 h-16">
            <div className="flex items-center gap-2">
              <button
                className="text-slate-600 hover:text-slate-900 p-2 rounded-full hover:bg-slate-100"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                title="메뉴 토글"
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
