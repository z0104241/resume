import React, { useState } from "react";
import careerSection from "./data/career";
import skillsSection from "./data/skills";
import eduSection from "./data/edu";
import etcSection from "./data/etc";
import type { ResumeSection, MenuType } from "./types.tsx";
// 분리된 HomePage 컴포넌트를 data 폴더에서 가져옵니다.
import HomePage from './data/HomePage'; 

const resumeSections: ResumeSection[] = [
  careerSection,
  skillsSection,
  eduSection,
  etcSection,
];

// Sidebar 컴포넌트는 App.tsx 내부에 그대로 유지합니다.
const Sidebar: React.FC<{
  menu: MenuType;
  setMenu: (m: MenuType) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  sections: ResumeSection[];
  selectedDetail: number | null;
  setSelectedDetail: (idx: number | null) => void;
}> = ({ menu, setMenu, open, setOpen, sections, selectedDetail, setSelectedDetail }) =>
  open ? (
    <aside
      className="h-screen w-64 bg-white border-r shadow-xl flex flex-col pt-8 px-6 transition-all duration-300 z-10"
      style={{ minWidth: "16rem" }}
    >
      <div className="flex items-center mb-10">
        <span className="font-extrabold text-2xl flex-1 tracking-tight">이력서 메뉴</span>
        <button
          className="text-gray-500 hover:text-black p-1 ml-2"
          onClick={() => setOpen(false)}
          title="사이드바 닫기"
        >
          <span className="text-2xl">⏴</span>
        </button>
      </div>
      <ul className="space-y-2 text-lg">
        <li
          className={`cursor-pointer hover:font-bold ${menu === "home" ? "font-bold text-blue-600" : ""}`}
          onClick={() => {
            setMenu("home");
            setSelectedDetail(null);
          }}
        >
          프롬프트 Q&A
        </li>
        {sections.map((sec) => (
          <React.Fragment key={sec.key}>
            <li
              className={`cursor-pointer hover:font-bold ${menu === sec.key ? "font-bold text-blue-600" : ""}`}
              onClick={() => {
                setMenu(sec.key);
                setSelectedDetail(null);
              }}
            >
              {sec.title}
            </li>
            {sec.key === "career" && menu === "career" && sec.details && (
              <ul className="ml-4 space-y-1">
                {sec.details.map((detail, idx) => (
                  <li
                    key={detail.label}
                    className={`text-base cursor-pointer hover:underline pl-2 ${selectedDetail === idx ? "text-blue-600 font-semibold" : "text-gray-700"}`}
                    onClick={() => setSelectedDetail(idx)}
                  >
                    {detail.label}
                  </li>
                ))}
              </ul>
            )}
          </React.Fragment>
        ))}
      </ul>
    </aside>
  ) : null;

const App: React.FC = () => {
  // Q&A 관련 상태(state)는 여전히 최상위 컴포넌트인 App.tsx에서 관리합니다.
  const [menu, setMenu] = useState<MenuType>("home");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [prompt, setPrompt] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [selectedDetail, setSelectedDetail] = useState<number | null>(null);

  // 질문 처리 로직도 App.tsx에 유지합니다.
  async function handleQuery() {
    setAnswer("로딩 중...");
    try {
      const res = await fetch("http://localhost:3001/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch (e) {
      setAnswer("서버 응답 실패");
    }
  }

  return (
    <div className="flex min-h-screen w-screen bg-gray-50 relative">
      <Sidebar
        menu={menu}
        setMenu={setMenu}
        open={sidebarOpen}
        // [수정됨] setOpen prop에 올바른 함수인 setSidebarOpen을 전달합니다.
        setOpen={setSidebarOpen}
        sections={resumeSections}
        selectedDetail={selectedDetail}
        setSelectedDetail={setSelectedDetail}
      />
      
      {!sidebarOpen && (
        <button
          className="fixed left-2 top-5 z-20 bg-gray-100 text-gray-700 rounded shadow px-3 py-2 hover:bg-blue-100 transition"
          onClick={() => setSidebarOpen(true)}
          title="사이드바 열기"
        >
          <span className="text-xl">⏵</span>
        </button>
      )}
      
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-xl">
          {menu === "home" ? (
            // 기존에 App.tsx에 있던 JSX 코드를 HomePage 컴포넌트로 대체합니다.
            // Q&A 기능에 필요한 상태와 함수들을 props로 전달해줍니다.
            <HomePage 
              prompt={prompt}
              setPrompt={setPrompt}
              answer={answer}
              handleQuery={handleQuery}
            />
          ) : (
            // 다른 메뉴들은 기존 방식과 동일하게 렌더링합니다.
            <section>
              <div className="bg-white rounded-2xl shadow-lg px-8 py-12 w-full">
                <h2 className="text-2xl font-extrabold mb-4 text-center text-gray-700">
                  {resumeSections.find((sec) => sec.key === menu)?.title}
                </h2>
                {menu === "career" && selectedDetail !== null
                  ? resumeSections
                      .find((sec) => sec.key === "career")!
                      .details![selectedDetail].content
                  : resumeSections.find((sec) => sec.key === menu)?.content}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
