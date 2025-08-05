import React, { useState, useRef, useEffect } from 'react';
// Message 타입을 가져옵니다.
import type { Message } from "../types.tsx";

// HomePage가 부모(App.tsx)로부터 받을 props들의 타입을 정의합니다.
interface HomePageProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isChatFullScreen: boolean;
  setIsChatFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
}

// 최종 API 연결 및 채팅 UI가 적용된 HomePage 컴포넌트
const HomePage: React.FC<HomePageProps> = ({
  messages,
  setMessages,
  isChatFullScreen,
  setIsChatFullScreen,
}) => {
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // RAG API를 호출하는 함수
  async function handleQuery() {
    if (!prompt.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: prompt };
    setMessages(prev => [...prev, userMessage]);
    setPrompt("");
    setIsLoading(true);

    // AI 응답 대기 메시지 추가
    setMessages(prev => [...prev, { sender: 'ai', text: "답변을 생성 중입니다..." }]);

    const apiEndpoint = "https://5hrfikrw67.execute-api.ap-northeast-2.amazonaws.com/0731/resume-rag-pkg";

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage.text }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `서버 오류: ${res.statusText}`);
      }

      const data = await res.json();
      
      // "생성 중" 메시지를 실제 답변으로 교체
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { sender: 'ai', text: data.answer };
        return newMessages;
      });

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
      // "생성 중" 메시지를 에러 메시지로 교체
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { sender: 'ai', text: `오류가 발생했습니다: ${errorMessage}` };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }

  const personalInfo = {
    name: '전재현',
    email: 'z0108174@gmail.com',
    phone: '010-4241-4445',
    profileImage: '/face.jpg', 
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* --- 프로필 섹션 --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col md:flex-row items-center text-center md:text-left space-y-6 md:space-y-0 md:space-x-10">
          <img
            src={personalInfo.profileImage}
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover ring-4 ring-slate-200 shadow-md"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/200x200/E2E8F0/4A5568?text=Jaehyun'; }}
          />
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">{personalInfo.name}</h1>
            <p className="text-xl text-slate-500 mt-2">실전 경험을 바탕으로 실질적인 가치를 만들겠습니다.</p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-6 text-slate-600">
              <a href={`mailto:${personalInfo.email}`} className="flex items-center space-x-2.5 group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                <span className="group-hover:text-blue-600 transition">{personalInfo.email}</span>
              </a>
              <div className="flex items-center space-x-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.518.76a11.024 11.024 0 006.29 6.29l.76-1.518a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                <span>{personalInfo.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- RAG Q&A 채팅 섹션 --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4 flex flex-col">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800">AI Resume Q&A</h2>
            <p className="text-slate-500 mt-1">이력서에 대해 궁금한 점을 AI에게 물어보세요.</p>
        </div>
        
        {/* 채팅 메시지 표시 영역 */}
        <div ref={chatContainerRef} className="flex-1 h-80 overflow-y-auto p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-lg px-4 py-2 rounded-2xl whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-800'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* 질문 입력 영역 */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            className="flex-grow w-full px-4 py-3 text-slate-800 bg-slate-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="AI에게 질문하기..."
            onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
            disabled={isLoading}
          />
          <button
            className="px-8 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed"
            onClick={handleQuery}
            disabled={isLoading}
          >
            {isLoading ? '생성중...' : '전송'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
