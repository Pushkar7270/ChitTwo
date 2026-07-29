import { useState } from "react";
import { Smile, Send } from "lucide-react";
import "./ChatPanel.css";

export default function MessageComposer({ onSend, disabled }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
  }

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <button
        type="button"
        className="composer__icon-btn"
        title="Emoji"
        onClick={() => setText((t) => t + "🙂")}
      >
        <Smile size={19} />
      </button>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={disabled ? "Connecting to the chat server..." : "Type a message..."}
        disabled={disabled}
      />
      <button type="submit" className="composer__send" disabled={disabled || !text.trim()}>
        <Send size={17} />
      </button>
    </form>
  );
}
