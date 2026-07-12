import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  timeout: 20000,
});

/**
 * Connect socket manually (optional)
 */
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

/**
 * Join chat with username
 */
export const joinUser = (username: string) => {
  socket.emit("user:join", username);
};

/**
 * Send chat message
 */
export const sendMessageSocket = (
  username: string,
  text: string
) => {
  socket.emit("message:send", {
    username,
    text,
  });
};

/**
 * Send typing status
 */
export const sendTypingStatus = (
  username: string,
  isTyping: boolean
) => {
  socket.emit("typing:status", {
    username,
    isTyping,
  });
};

/**
 * Mark all messages as read
 */
export const markMessagesAsRead = (username: string) => {
  socket.emit("message:read_all", {
    username,
  });
};