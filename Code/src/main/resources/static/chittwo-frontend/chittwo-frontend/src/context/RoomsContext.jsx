import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "chittwo:rooms";
const RoomsContext = createContext(null);

function loadRooms() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * GroupController exposes create/get-by-id/get-messages but no "list all
 * groups" endpoint, so there is no way to fetch a full inbox from the server.
 * We keep a local directory of rooms this browser has created or joined
 * (by roomId, which is shareable) and enrich it with the latest message
 * preview/unread count as frames arrive over the socket. See README for the
 * suggested backend addition (GET /api/v1/group) that would remove this need.
 */
export function RoomsProvider({ children }) {
  const [rooms, setRooms] = useState(loadRooms);
  const [activeRoomId, setActiveRoomId] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
  }, [rooms]);

  function upsertRoom(room) {
    setRooms((prev) => ({
      ...prev,
      [room.roomId]: { unread: 0, lastPreview: "", lastTime: null, ...prev[room.roomId], ...room },
    }));
  }

  function removeRoom(roomId) {
    setRooms((prev) => {
      const next = { ...prev };
      delete next[roomId];
      return next;
    });
    setActiveRoomId((current) => (current === roomId ? null : current));
  }

  function touchRoom(roomId, { preview, time, incoming }) {
    setRooms((prev) => {
      const existing = prev[roomId];
      if (!existing) return prev;
      const isActive = activeRoomId === roomId;
      return {
        ...prev,
        [roomId]: {
          ...existing,
          lastPreview: preview ?? existing.lastPreview,
          lastTime: time ?? existing.lastTime,
          unread: incoming && !isActive ? (existing.unread || 0) + 1 : existing.unread,
        },
      };
    });
  }

  function markRead(roomId) {
    setRooms((prev) =>
      prev[roomId] ? { ...prev, [roomId]: { ...prev[roomId], unread: 0 } } : prev
    );
  }

  function selectRoom(roomId) {
    setActiveRoomId(roomId);
    markRead(roomId);
  }

  const roomList = useMemo(
    () =>
      Object.values(rooms).sort((a, b) => {
        const ta = a.lastTime ? new Date(a.lastTime).getTime() : 0;
        const tb = b.lastTime ? new Date(b.lastTime).getTime() : 0;
        return tb - ta;
      }),
    [rooms]
  );

  return (
    <RoomsContext.Provider
      value={{
        rooms,
        roomList,
        activeRoomId,
        selectRoom,
        upsertRoom,
        removeRoom,
        touchRoom,
        markRead,
      }}
    >
      {children}
    </RoomsContext.Provider>
  );
}

export function useRooms() {
  const ctx = useContext(RoomsContext);
  if (!ctx) throw new Error("useRooms must be used within RoomsProvider");
  return ctx;
}
