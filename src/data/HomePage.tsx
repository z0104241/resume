import type React from 'react';

// HomePage 컴포넌트가 부모(App.tsx)로부터 받아야 할 props들의 타입을 정의합니다.
interface HomePageProps {
  prompt: string;
  setPrompt: (value: string) => void;
  answer: string;
  handleQuery: () => Promise<void>;
}

// 실리콘밸리 스타일로 디자인된 HomePage 컴포넌트입니다.
const HomePage: React.FC<HomePageProps> = ({
  prompt,
  setPrompt,
  answer,
  handleQuery,
}) => {
  // 개인 정보 (이 부분을 실제 정보로 수정하세요)
  const personalInfo = {
    name: '홍길동',
    email: 'gildong.hong@example.com',
    phone: '010-1234-5678',
    profileImage: '/face.jpg', // public 폴더에 있는 이미지 경로
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 space-y-10 transform hover:-translate-y-1 transition-all duration-300">
        
        {/* --- 프로필 섹션 --- */}
        <div className="flex flex-col md:flex-row items-center text-center md:text-left space-y-6 md:space-y-0 md:space-x-8">
          <img
            src={personalInfo.profileImage}
            alt="Profile"
            className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover ring-4 ring-blue-500/30 shadow-lg"
          />
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">{personalInfo.name}</h1>
            <p className="text-lg text-gray-500 mt-2">AI Developer & Data Analyst</p>
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                {/* 이메일 아이콘 */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-600 hover:underline">{personalInfo.email}</a>
              </div>
              <div className="flex items-center space-x-2">
                {/* 전화 아이콘 */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.518.76a11.024 11.024 0 006.29 6.29l.76-1.518a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>{personalInfo.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- 구분선 --- */}
        <div className="border-t border-gray-200"></div>

        {/* --- RAG Q&A 섹션 --- */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">AI Resume Q&A</h2>
          <p className="text-center text-gray-500 -mt-4">
            이력서에 대해 궁금한 점을 AI에게 물어보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              className="flex-grow w-full px-4 py-3 text-gray-700 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="예: 가장 자신있는 기술 스택은 무엇인가요?"
              onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
            />
            <button
              className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
              onClick={handleQuery}
            >
              질문하기
            </button>
          </div>
          <div className="min-h-[6rem] p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 whitespace-pre-wrap">
            {answer || '답변이 여기에 표시됩니다.'}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
