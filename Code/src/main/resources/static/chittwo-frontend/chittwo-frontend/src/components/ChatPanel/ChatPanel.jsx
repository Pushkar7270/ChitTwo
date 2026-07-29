import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageComposer from "./MessageComposer";
import EmptyChatState from "./EmptyChatState";
import "./ChatPanel.css";

export default function ChatPanel({
  room,
  messages,
  loading,
  error,
  sendMessage,
  connectionStatus,
  onToggleProfile,
  profileOpen,
}) {
  if (!room) {
    return (
      <main className="chat-panel chat-panel--empty">
        <EmptyChatState />
      </main>
    );
  }

  return (
    <main className="chat-panel">
      <ChatHeader
        room={room}
        connectionStatus={connectionStatus}
        onToggleProfile={onToggleProfile}
        profileOpen={profileOpen}
      />
      <MessageList messages={messages} loading={loading} error={error} />
      <MessageComposer onSend={sendMessage} disabled={connectionStatus !== "connected"} />
    </main>
  );
}
