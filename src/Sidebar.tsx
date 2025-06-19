// App.tsx 전체 코드 예시 (경력/프로젝트 클릭 시 상세 목록 확장/상세 표시)

import React, { useState } from "react";

type MenuType = "home" | "career" | "skills" | "edu" | "etc";

interface ResumeSection {
  key: MenuType;
  title: string;
  content: string | JSX.Element;
  details?: { label: string; content: string | JSX.Element }[];
}

const resumeSections: ResumeSection[] = [
  {
    key: "career",
    title: "경력/프로젝트",
    content: (
      <ul className="list-disc ml-6 space-y-1">
        <li>
          <b>데이터분석, LLM 엔지니어</b> - 실무 및 대회 경험 다수
        </li>
        <li>
          <b>프론트엔드 개발</b> - React 기반 웹 서비스 구현
        </li>
        <li>
          <b>프로젝트:</b> 문장순서 예측, RAG 시스템, AI 서비스 개발 등
        </li>
      </ul>
    ),
    details: [
      {
        label: "상세 1: AI 서비스",
        content: <div className="mt-2">AI 서비스 상세 설명입니다.</div>,
      },
      {
        label: "상세 2: 대회 경험",
        content: <div className="mt-2">대회 경험 상세 설명입니다.</div>,
      },
      {
        label: "상세 3: 기타 프로젝트",
        content: <div className="mt-2">기타 프로젝트 상세 설명입니다.</div>,
      },
    ],
  },
  {
    key: "skills",
    title: "주요 기술/스택",
    content: (
      <ul className="list-disc ml-6 space-y-1">
        <li>Python (데이터/AI 전공), FastAPI, vLLM</li>
        <li>React, TypeScript, Vite</li>
        <li>Chroma/FAISS, Hugging Face</li>
      </ul>
    ),
  },
  {
    key: "edu",
    title: "학력/자격",
    content: (
      <ul className="list-disc ml-6 space-y-1">
        <li>OO대학교 AI학과 졸업</li>
        <li>정보처리기사, 빅데이터분석기사 등</li>
      </ul>
    ),
  },
  {
    key: "etc",
    title: "기타(수상/활동)",
    content: (
      <ul className="list-disc ml-6 space-y-1">
        <li>AI 경진대회 입상</li>
        <li>기술 블로그 운영</li>
      </ul>
    ),
  },
];

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
            {/* 경력/프로젝트 상세 하위 메뉴 */}
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
  const [menu, setMenu] = useState<MenuType>("home");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [prompt, setPrompt] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [selectedDetail, setSelectedDetail] = useState<number | null>(null);

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
      {/* 사이드바 */}
      <Sidebar
        menu={menu}
        setMenu={setMenu}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        sections={resumeSections}
        selectedDetail={selectedDetail}
        setSelectedDetail={setSelectedDetail}
      />
      {/* 사이드바 닫힌 상태에서만 열기 버튼 노출 */}
      {!sidebarOpen && (
        <button
          className="fixed left-2 top-5 z-20 bg-gray-100 text-gray-700 rounded shadow px-3 py-2 hover:bg-blue-100 transition"
          onClick={() => setSidebarOpen(true)}
          title="사이드바 열기"
        >
          <span className="text-xl">⏵</span>
        </button>
      )}
      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-xl">
          {menu === "home" && (
            <section>
              <div className="bg-white rounded-2xl shadow-lg px-8 py-12 w-full">
                <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
                  RAG 기반 이력서 Q&A
                </h1>
                <div className="flex gap-2 items-center justify-center mb-6">
                  <input
                    className="border p-3 rounded w-3/4"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="예) 주요 경력을 요약해줘"
                  />
                  <button
                    className="px-5 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                    onClick={handleQuery}
                  >
                    질문
                  </button>
                </div>
                <div className="border rounded min-h-[3rem] p-4 bg-gray-50 text-gray-700">
                  {answer}
                </div>
              </div>
            </section>
          )}
          {menu !== "home" && (
            <section>
              <div className="bg-white rounded-2xl shadow-lg px-8 py-12 w-full">
                <h2 className="text-2xl font-extrabold mb-4 text-center text-gray-700">
                  {resumeSections.find((sec) => sec.key === menu)?.title}
                </h2>
                {/* 경력/프로젝트의 상세 내용 */}
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
