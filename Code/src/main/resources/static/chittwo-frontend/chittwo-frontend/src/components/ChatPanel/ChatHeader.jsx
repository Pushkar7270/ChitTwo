import { useState } from "react";
import { Paperclip, Link2, PanelRight } from "lucide-react";
import Avatar from "../common/Avatar";
import StatusDot from "../common/StatusDot";
import "./ChatPanel.css";

const STATUS_COPY = {
  connected: "Connected",
  connecting: "Connecting...",
  disconnected: "Disconnected",
  error: "Connection error",
};

const STATUS_STATE = {
  connected: "online",
  connecting: "connecting",
  disconnected: "offline",
  error: "error",
};

export default function ChatHeader({ room, connectionStatus, onToggleProfile, profileOpen }) {
  const [copied, setCopied] = useState(false);

  function copyRoomId() {
    navigator.clipboard?.writeText(room.roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <header className="chat-header">
      <div className="chat-header__identity">
        <Avatar name={room.roomName || room.roomId} size={40} />
        <div>
          <h2>{room.roomName || "Untitled room"}</h2>
          <div className="chat-header__status">
            <StatusDot state={STATUS_STATE[connectionStatus] || "offline"} />
            <span>{STATUS_COPY[connectionStatus] || "Offline"}</span>
          </div>
        </div>
      </div>
      <div className="chat-header__actions">
        <button
          className="chat-header__icon-btn"
          title="Attachments aren't supported by the backend - paste an image or file link instead"
          disabled
        >
          <Paperclip size={18} />
        </button>
        <button className="chat-header__icon-btn" title="Copy room ID to invite others" onClick={copyRoomId}>
          <Link2 size={18} />
        </button>
        <button
          className="chat-header__icon-btn chat-header__icon-btn--panel"
          title="Toggle profile panel"
          onClick={onToggleProfile}
          data-active={profileOpen}
        >
          <PanelRight size={18} />
        </button>
        {copied && <span className="chat-header__copied">Room ID copied</span>}
      </div>
    </header>
  );
}
