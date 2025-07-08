import type React from 'react';

// HomePage Props 타입 정의
interface HomePageProps {
  prompt: string;
  setPrompt: (value: string) => void;
  answer: string;
  handleQuery: () => Promise<void>;
}

// 실리콘밸리 스타일로 업데이트된 HomePage 컴포넌트
const HomePage: React.FC<HomePageProps> = ({
  prompt,
  setPrompt,
  answer,
  handleQuery,
}) => {
  // 개인 정보
  const personalInfo = {
    name: '전재현',
    email: 'z0108174@gmail.com',
    phone: '010-4241-4445',
    // 중요: 이 이미지를 표시하려면 프로젝트 루트의 'public' 폴더에 'face.jpg' 파일을 넣어주세요.
    // 파일이 없는 경우 아래의 placeholder 이미지가 표시됩니다.
    profileImage: '/face.jpg', 
  };

  const isQuerying = answer.includes('생성 중');

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* --- 프로필 섹션 --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col md:flex-row items-center text-center md:text-left space-y-6 md:space-y-0 md:space-x-10">
          <img
            src={personalInfo.profileImage}
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover ring-4 ring-slate-200 shadow-md"
            // public/face.jpg 파일이 없을 경우, 대체 이미지를 표시합니다.
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/200x200/E2E8F0/4A5568?text=Gildong'; }}
          />
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">{personalInfo.name}</h1>
            <p className="text-xl text-slate-500 mt-2">AI Developer & Data Analyst</p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-6 text-slate-600">
              <a href={`mailto:${personalInfo.email}`} className="flex items-center space-x-2.5 group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="group-hover:text-blue-600 transition">{personalInfo.email}</span>
              </a>
              <div className="flex items-center space-x-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.518.76a11.024 11.024 0 006.29 6.29l.76-1.518a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>{personalInfo.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- RAG Q&A 섹션 --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800">AI Resume Q&A</h2>
            <p className="text-slate-500 mt-1">
              이력서에 대해 궁금한 점을 AI에게 물어보세요.
            </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            className="flex-grow w-full px-4 py-3 text-slate-800 bg-slate-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="예: 가장 자신있는 기술 스택은 무엇인가요?"
            onKeyDown={(e) => e.key === 'Enter' && !isQuerying && handleQuery()}
          />
          <button
            className="px-8 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed"
            onClick={handleQuery}
            disabled={isQuerying}
          >
            {isQuerying ? '생성중...' : '질문하기'}
          </button>
        </div>
        <div className="min-h-[8rem] p-5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 whitespace-pre-wrap leading-relaxed">
          {answer || '답변이 여기에 표시됩니다.'}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
