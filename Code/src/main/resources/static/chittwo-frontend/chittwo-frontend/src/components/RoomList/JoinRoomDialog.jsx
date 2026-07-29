import { useState } from "react";
import Modal from "../common/Modal";
import { fetchGroup } from "../../api/groups";
import { useRooms } from "../../context/RoomsContext";
import "./RoomDialogs.css";

export default function JoinRoomDialog({ onClose }) {
  const { upsertRoom, selectRoom } = useRooms();
  const [roomId, setRoomId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!roomId.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const group = await fetchGroup(roomId.trim());
      upsertRoom({ roomId: group.roomId, roomName: group.roomName });
      selectRoom(group.roomId);
      onClose();
    } catch (err) {
      setError(err.message || "That room ID wasn't found.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Join a room" onClose={onClose}>
      <form className="room-dialog-form" onSubmit={handleSubmit}>
        <label htmlFor="room-id">Room ID</label>
        <input
          id="room-id"
          autoFocus
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Paste a room ID, e.g. 3f9a1c2e-..."
        />
        <p className="room-dialog-form__hint">
          There's no public directory of rooms - ask whoever created it to share the ID.
        </p>
        {error && <p className="room-dialog-form__error">{error}</p>}
        <button type="submit" disabled={busy || !roomId.trim()}>
          {busy ? "Joining..." : "Join room"}
        </button>
      </form>
    </Modal>
  );
}
