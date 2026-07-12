const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Fetch chat history
 */
export async function getMessages() {
  const response = await fetch(`${API_URL}/messages`);

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  const data = await response.json();
  return data;
}

/**
 * Send a new message
 */
export async function sendMessage(username: string, text: string) {
  const response = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return await response.json();
}

/**
 * Get online users
 */
export async function getOnlineUsers() {
  const response = await fetch(`${API_URL}/users`);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return await response.json();
}

/**
 * Mark all messages as read
 */
export async function markMessagesAsRead(username: string) {
  const response = await fetch(`${API_URL}/messages/read`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to mark messages as read");
  }

  return await response.json();
}