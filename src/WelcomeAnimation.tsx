import React, { useState, useEffect } from 'react';

// 애니메이션 종료 시 호출될 콜백 함수의 타입을 정의합니다.
interface WelcomeAnimationProps {
  onAnimationEnd: () => void;
}

// 환영 애니메이션을 위한 컴포넌트입니다.
const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ onAnimationEnd }) => {
  // 표시될 전체 텍스트입니다.
  const fullText = "안녕하세요. 저는 전재현 입니다.";
  // 현재까지 타이핑된 텍스트를 저장하는 상태입니다.
  const [text, setText] = useState('');
  // 커서의 깜빡임을 제어하는 상태입니다.
  const [showCursor, setShowCursor] = useState(true);
  // 컴포넌트가 사라지는 효과(fade-out)를 제어하는 상태입니다.
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // 1. 타이핑 효과 구현
    if (text.length < fullText.length) {
      const typingTimeout = setTimeout(() => {
        setText(fullText.slice(0, text.length + 1));
      }, 120); // 타이핑 속도 (ms)
      return () => clearTimeout(typingTimeout);
    }

    // 2. 타이핑 완료 후 커서 깜빡임 효과
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500); // 커서 깜빡임 속도 (ms)

    // 3. 애니메이션 종료 처리
    const endTimeout = setTimeout(() => {
      clearInterval(cursorInterval); // 커서 깜빡임 중지
      setShowCursor(false);
      setIsFadingOut(true); // Fade-out 효과 시작
    }, 1000); // 타이핑 완료 후 2초 대기

    // 4. Fade-out 완료 후 메인 앱 표시
    const unmountTimeout = setTimeout(() => {
      onAnimationEnd(); // 부모 컴포넌트에 애니메이션 종료를 알림
    }, 2000); // 2초 대기 + 1초 fade-out

    // 컴포넌트가 언마운트될 때 모든 타이머 정리
    return () => {
      clearTimeout(endTimeout);
      clearTimeout(unmountTimeout);
      clearInterval(cursorInterval);
    };
  }, [text, fullText, onAnimationEnd]);

  return (
    <div
      className={`fixed inset-0 bg-slate-900 flex items-center justify-center z-50 transition-opacity duration-1000 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <h1 className="text-3xl md:text-5xl font-bold text-white text-center px-4">
        {text}
        <span className={`transition-opacity duration-200 ${showCursor ? 'opacity-100' : 'opacity-0'}`}>|</span>
      </h1>
    </div>
  );
};

export default WelcomeAnimation;
