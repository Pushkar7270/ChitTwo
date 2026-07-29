import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { WS_URL } from "../constants/appConstants";

/**
 * Thin wrapper around a single STOMP client connected to the backend's
 * WebSocketConfig endpoint ("/chat", SockJS-backed). One instance is shared
 * for the whole app (see hooks/useRoomSocket.js) since STOMP supports many
 * topic subscriptions over one connection.
 */
export function createChatClient({ onConnect, onDisconnect, onError }) {
  const client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 3000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    onConnect: () => onConnect?.(),
    onWebSocketClose: () => onDisconnect?.(),
    onStompError: (frame) => onError?.(frame.headers?.message || "STOMP error"),
    onWebSocketError: () => onError?.("Could not reach the chat server"),
  });

  return client;
}

/** Subscribes to /topic/group/{roomId}, matching ChatController's @SendTo. */
export function subscribeToRoom(client, roomId, onMessage) {
  return client.subscribe(`/topic/group/${roomId}`, (frame) => {
    try {
      onMessage(JSON.parse(frame.body));
    } catch {
      // Ignore malformed frames rather than crashing the chat.
    }
  });
}

/** Publishes to /app/sendMessage/{roomId}, matching ChatController's @MessageMapping. */
export function publishMessage(client, roomId, { content, sender }) {
  client.publish({
    destination: `/app/sendMessage/${roomId}`,
    body: JSON.stringify({ content, sender, roomId }),
  });
}
