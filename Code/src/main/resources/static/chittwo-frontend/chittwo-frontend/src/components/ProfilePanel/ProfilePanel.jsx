import { useMemo } from "react";
import { Copy, FileText } from "lucide-react";
import Avatar from "../common/Avatar";
import StatusDot from "../common/StatusDot";
import { describeContent } from "../../utils/linkDetect";
import "./ProfilePanel.css";

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

/**
 * The backend has no attachment/upload storage - Message.content is plain
 * text. As an honest stand-in for the reference design's attachment grid, we
 * derive one from any image/file links that have actually been sent in this
 * room, instead of fabricating fake thumbnails.
 */
export default function ProfilePanel({ room, messages, connectionStatus }) {
  const attachments = useMemo(() => {
    return messages
      .map((m) => ({ id: m.id, ...describeContent(m.content || "") }))
      .filter((c) => c.kind === "image" || c.kind === "link");
  }, [messages]);

  function copyRoomId() {
    navigator.clipboard?.writeText(room.roomId);
  }

  return (
    <aside className="profile-panel">
      <h3 className="profile-panel__title">Profile Info</h3>

      <div className="profile-panel__identity">
        <Avatar name={room.roomName || room.roomId} size={84} />
        <h4>{room.roomName || "Untitled room"}</h4>
        <div className="profile-panel__status">
          <StatusDot state={STATUS_STATE[connectionStatus] || "offline"} />
          <span>{STATUS_COPY[connectionStatus] || "Offline"}</span>
        </div>
      </div>

      <div className="profile-panel__room-id">
        <div>
          <span className="profile-panel__label">Room ID</span>
          <span className="profile-panel__value" title={room.roomId}>
            {room.roomId}
          </span>
        </div>
        <button onClick={copyRoomId} title="Copy room ID">
          <Copy size={14} />
        </button>
      </div>

      <div className="profile-panel__attachments">
        <div className="profile-panel__attachments-head">
          <span>Attachment</span>
          <span className="profile-panel__count">{attachments.length}</span>
        </div>

        {attachments.length === 0 && (
          <p className="profile-panel__empty">
            Links to images or files shared in this room will show up here. The backend
            doesn't store uploaded files, so this is built from message links, not a real
            file store.
          </p>
        )}

        <div className="profile-panel__grid">
          {attachments.map((a) => (
            <a
              key={a.id}
              className="profile-panel__tile"
              href={a.url}
              target="_blank"
              rel="noreferrer"
            >
              {a.kind === "image" ? (
                <img src={a.url} alt="" />
              ) : (
                <span className="profile-panel__tile-icon">
                  <FileText size={16} />
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
