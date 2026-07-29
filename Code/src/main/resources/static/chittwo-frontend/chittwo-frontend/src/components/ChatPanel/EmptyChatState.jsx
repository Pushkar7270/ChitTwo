import { MessageCircle } from "lucide-react";
import "./ChatPanel.css";

export default function EmptyChatState() {
  return (
    <div className="empty-chat">
      <div className="empty-chat__icon">
        <MessageCircle size={28} />
      </div>
      <h2>Pick a room, or start one</h2>
      <p>Select a room on the left, join one with a room ID, or create a new one to begin.</p>
    </div>
  );
}
