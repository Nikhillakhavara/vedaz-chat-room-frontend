export interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: string; // ISO string
  status: 'sent' | 'delivered' | 'read';
}

export interface User {
  username: string;
  socketId: string;
  status: 'online' | 'offline';
  joinedAt: string;
}

export interface TypingStatus {
  username: string;
  isTyping: boolean;
}
