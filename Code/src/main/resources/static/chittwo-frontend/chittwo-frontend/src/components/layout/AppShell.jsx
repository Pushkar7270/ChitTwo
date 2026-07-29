import { useState } from "react";
import { useRooms } from "../../context/RoomsContext";
import { useRoomMessages } from "../../hooks/useRoomMessages";
import IconRail from "../IconRail/IconRail";
import RoomList from "../RoomList/RoomList";
import ChatPanel from "../ChatPanel/ChatPanel";
import ProfilePanel from "../ProfilePanel/ProfilePanel";
import "./AppShell.css";

export default function AppShell() {
  const { rooms, activeRoomId } = useRooms();
  const room = activeRoomId ? rooms[activeRoomId] : null;
  const { messages, loading, error, sendMessage, connectionStatus } =
    useRoomMessages(activeRoomId);
  const [profileOpen, setProfileOpen] = useState(true);

  return (
    <div className="app-shell">
      <IconRail />
      <RoomList />
      <ChatPanel
        room={room}
        messages={messages}
        loading={loading}
        error={error}
        sendMessage={sendMessage}
        connectionStatus={connectionStatus}
        profileOpen={profileOpen}
        onToggleProfile={() => setProfileOpen((v) => !v)}
      />
      {room && profileOpen && (
        <ProfilePanel room={room} messages={messages} connectionStatus={connectionStatus} />
      )}
    </div>
  );
}
