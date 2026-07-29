import { useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import { useRooms } from "../../context/RoomsContext";
import RoomListItem from "./RoomListItem";
import NewRoomDialog from "./NewRoomDialog";
import JoinRoomDialog from "./JoinRoomDialog";
import "./RoomList.css";

export default function RoomList() {
  const { roomList, activeRoomId, selectRoom, removeRoom } = useRooms();
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState(null); // null | "create" | "join"
  const [menuOpen, setMenuOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return roomList;
    return roomList.filter((r) => r.roomName?.toLowerCase().includes(q));
  }, [roomList, query]);

  return (
    <section className="room-list">
      <header className="room-list__header">
        <div className="room-list__search">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in your Inbox"
          />
        </div>
        <div className="room-list__new">
          <button
            className="room-list__new-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Create or join a room"
          >
            <Plus size={18} />
          </button>
          {menuOpen && (
            <div className="room-list__new-menu">
              <button
                onClick={() => {
                  setDialog("create");
                  setMenuOpen(false);
                }}
              >
                Create a new room
              </button>
              <button
                onClick={() => {
                  setDialog("join");
                  setMenuOpen(false);
                }}
              >
                Join a room by ID
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="room-list__items">
        {filtered.length === 0 && (
          <p className="room-list__empty">
            {roomList.length === 0
              ? "No rooms yet. Create one or join with a room ID someone shared with you."
              : "No rooms match your search."}
          </p>
        )}
        {filtered.map((room) => (
          <RoomListItem
            key={room.roomId}
            room={room}
            active={room.roomId === activeRoomId}
            onSelect={() => selectRoom(room.roomId)}
            onLeave={() => removeRoom(room.roomId)}
          />
        ))}
      </div>

      {dialog === "create" && <NewRoomDialog onClose={() => setDialog(null)} />}
      {dialog === "join" && <JoinRoomDialog onClose={() => setDialog(null)} />}
    </section>
  );
}
