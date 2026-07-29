import { X } from "lucide-react";
import Avatar from "../common/Avatar";
import { formatListTime } from "../../utils/time";
import "./RoomList.css";

export default function RoomListItem({ room, active, onSelect, onLeave }) {
  return (
    <div
      className={`room-item${active ? " room-item--active" : ""}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
    >
      <Avatar name={room.roomName || room.roomId} size={44} />
      <div className="room-item__body">
        <div className="room-item__top">
          <span className="room-item__name">{room.roomName || "Untitled room"}</span>
          <span className="room-item__time">{formatListTime(room.lastTime)}</span>
        </div>
        <div className="room-item__bottom">
          <span className="room-item__preview">
            {room.lastPreview || "No messages yet - say hi!"}
          </span>
          {room.unread > 0 && <span className="room-item__badge">{room.unread}</span>}
        </div>
      </div>
      <button
        className="room-item__leave"
        title="Remove from this list (doesn't delete the room)"
        onClick={(e) => {
          e.stopPropagation();
          onLeave();
        }}
      >
        <X size={13} />
      </button>
    </div>
  );
}
