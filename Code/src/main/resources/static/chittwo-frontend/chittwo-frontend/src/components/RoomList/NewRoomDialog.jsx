import { useState } from "react";
import Modal from "../common/Modal";
import { createGroup } from "../../api/groups";
import { useRooms } from "../../context/RoomsContext";
import "./RoomDialogs.css";

export default function NewRoomDialog({ onClose }) {
  const { upsertRoom, selectRoom } = useRooms();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const group = await createGroup(name.trim());
      upsertRoom({ roomId: group.roomId, roomName: group.roomName });
      selectRoom(group.roomId);
      onClose();
    } catch (err) {
      setError(err.message || "Couldn't create the room. Is the backend running?");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Create a new room" onClose={onClose}>
      <form className="room-dialog-form" onSubmit={handleSubmit}>
        <label htmlFor="room-name">Room name</label>
        <input
          id="room-name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Trip planning"
          maxLength={80}
        />
        <p className="room-dialog-form__hint">
          Anyone with the generated room ID can join afterwards - share it from the room's
          profile panel once it's created.
        </p>
        {error && <p className="room-dialog-form__error">{error}</p>}
        <button type="submit" disabled={busy || !name.trim()}>
          {busy ? "Creating..." : "Create room"}
        </button>
      </form>
    </Modal>
  );
}
