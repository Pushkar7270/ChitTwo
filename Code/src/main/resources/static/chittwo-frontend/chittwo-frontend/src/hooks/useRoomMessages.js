import { useEffect, useState } from "react";
import { fetchMessages } from "../api/groups";
import { useChatSocket } from "../context/ChatSocketContext";
import { useRooms } from "../context/RoomsContext";
import { useIdentity } from "../context/IdentityContext";

function byTimeAsc(a, b) {
  return new Date(a.timeSent).getTime() - new Date(b.timeSent).getTime();
}

/**
 * Loads history for `roomId` over REST, then keeps it live via the shared
 * STOMP subscription. History ordering isn't guaranteed by the backend (see
 * README), so we sort by timeSent client-side; new frames are appended and
 * de-duplicated by id in case the socket echoes a message we already have.
 */
export function useRoomMessages(roomId) {
  const { subscribe, send, status } = useChatSocket();
  const { touchRoom } = useRooms();
  const { name } = useIdentity();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roomId) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchMessages(roomId)
      .then((history) => {
        if (cancelled) return;
        setMessages([...(history || [])].sort(byTimeAsc));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    const unsubscribe = subscribe(roomId, (incoming) => {
      setMessages((prev) => {
        if (incoming.id && prev.some((m) => m.id === incoming.id)) return prev;
        return [...prev, incoming];
      });
      touchRoom(roomId, {
        preview: incoming.content,
        time: incoming.timeSent,
        incoming: incoming.senderId !== name,
      });
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  function sendMessage(content) {
    if (!content.trim() || !roomId) return;
    send(roomId, { content: content.trim(), sender: name });
  }

  return { messages, loading, error, sendMessage, connectionStatus: status };
}
