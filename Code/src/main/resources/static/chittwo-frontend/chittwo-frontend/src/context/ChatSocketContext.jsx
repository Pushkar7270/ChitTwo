import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createChatClient, subscribeToRoom, publishMessage } from "../api/socket";

const ChatSocketContext = createContext(null);

/**
 * One STOMP/SockJS connection to the backend's /chat endpoint is opened for
 * the whole app and shared by every open room (STOMP multiplexes many topic
 * subscriptions over a single socket), rather than reconnecting per room.
 */
export function ChatSocketProvider({ children }) {
  const clientRef = useRef(null);
  const [status, setStatus] = useState("connecting"); // connecting | connected | disconnected | error
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const client = createChatClient({
      onConnect: () => {
        setStatus("connected");
        setErrorMessage(null);
      },
      onDisconnect: () => setStatus("disconnected"),
      onError: (message) => {
        setStatus("error");
        setErrorMessage(message);
      },
    });
    clientRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  function subscribe(roomId, onMessage) {
    const client = clientRef.current;
    if (!client) return () => {};

    let sub;

    if (client.connected) {
      sub = subscribeToRoom(client, roomId, onMessage);
      return () => sub?.unsubscribe();
    }

    // Queue subscription until connected
    const pending = { cancelled: false };
    const origOnConnect = client.onConnect;
    client.onConnect = (frame) => {
      origOnConnect?.(frame);
      if (!pending.cancelled) {
        sub = subscribeToRoom(client, roomId, onMessage);
      }
    };
    return () => {
      pending.cancelled = true;
      sub?.unsubscribe();
    };
  }

  function send(roomId, payload) {
    const client = clientRef.current;
    if (!client?.connected) {
      console.error("send() called but client not connected", client);
      return;
    }
    publishMessage(client, roomId, payload);
  }

  return (
    <ChatSocketContext.Provider value={{ status, errorMessage, subscribe, send }}>
      {children}
    </ChatSocketContext.Provider>
  );
}

export function useChatSocket() {
  const ctx = useContext(ChatSocketContext);
  if (!ctx) throw new Error("useChatSocket must be used within ChatSocketProvider");
  return ctx;
}
