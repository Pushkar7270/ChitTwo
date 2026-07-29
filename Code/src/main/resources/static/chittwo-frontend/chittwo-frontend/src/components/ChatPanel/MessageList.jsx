import { useIdentity } from "../../context/IdentityContext";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import MessageBubble from "./MessageBubble";
import "./ChatPanel.css";

export default function MessageList({ messages, loading, error }) {
  const { name } = useIdentity();
  const scrollRef = useAutoScroll(messages.length);

  return (
    <div className="message-list" ref={scrollRef}>
      {loading && <p className="message-list__hint">Loading history...</p>}
      {error && (
        <p className="message-list__hint message-list__hint--error">
          Couldn't load history: {error}
        </p>
      )}
      {!loading && !error && messages.length === 0 && (
        <p className="message-list__hint">No messages yet. Say hello!</p>
      )}
      {messages.map((message, i) => (
        <MessageBubble
          key={message.id ?? `${message.timeSent}-${i}`}
          message={message}
          isOwn={message.senderId === name}
        />
      ))}
    </div>
  );
}
