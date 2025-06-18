import { useState } from "react";
import type { FormEvent } from "react";


const ChatPrompt: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [alert, setAlert] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setAlert("RAG 기능은 아직 준비 중입니다.");
    setTimeout(() => setAlert(null), 2000);
    setInput("");
  }

  return (
    <div className="chat-container">
      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="무엇이든 물어보세요"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="chat-input"
        />
        <button type="submit" className="chat-btn">질문</button>
      </form>
      {alert && <div className="chat-alert">{alert}</div>}
    </div>
  );
};

export default ChatPrompt;
