import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { Message, TypingStatus } from './types';
import { socket } from './services/socket';
import { getMessages, getOnlineUsers, sendMessage, markMessagesAsRead } from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    // Persistent local session backup so refreshing doesn't force re-log in
    return localStorage.getItem('chat_username');
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<{ username: string; status: 'online' | 'offline' }[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingStatus[]>([]);
  const [isConnected, setIsConnected] = useState(socket.connected);

  // 1. Fetch historical messages (REST API history retrieval)
  const fetchHistory = async () => {
    try {
      const data = await getMessages();
      if (data.success && data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Failed to fetch message logs:', error);
    }
  };

  // 2. Fetch current online users directory
  const loadOnlineUsers = async () => {
    try {
      const data = await getOnlineUsers();
      if (data.success && data.users) {
        setOnlineUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to load online user logs:', error);
    }
  };

  // 3. Socket initialization lifecycle
  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      console.log('Successfully connected to WebSocket broker');
      
      // If user session is active, rejoin immediately (graceful reconnection handling)
      const cachedUsername = localStorage.getItem('chat_username');
      if (cachedUsername) {
        socket.emit('user:join', cachedUsername);
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log('Disconnected from WebSocket broker');
    };

    // Handle real-time incoming messages with Idempotency guard (No duplications)
    const handleMessageReceived = (newMessage: Message) => {
      setMessages((prev) => {
        const alreadyExists = prev.some((msg) => msg.id === newMessage.id);
        if (alreadyExists) return prev;
        return [...prev, newMessage];
      });
    };

    // Handle real-time updates to the online user listing
    const handleUserListUpdate = (updatedList: { username: string; status: 'online' | 'offline' }[]) => {
      setOnlineUsers(updatedList);
    };

    // Handle typing indicator updates
    const handleTypingUpdate = (status: TypingStatus) => {
      setTypingUsers((prev) => {
        // Filter out existing typing statuses for this specific username
        const filtered = prev.filter((u) => u.username !== status.username);
        if (status.isTyping) {
          return [...filtered, status];
        }
        return filtered;
      });
    };

    // Handle messages read status syncing in real time
    const handleMessagesMarkedRead = ({ username }: { username: string }) => {
      setMessages((prev) => 
        prev.map((msg) => {
          if (msg.username !== username && msg.status !== 'read') {
            return { ...msg, status: 'read' };
          }
          return msg;
        })
      );
    };

    // Bind event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('message:received', handleMessageReceived);
    socket.on('user_list:update', handleUserListUpdate);
    socket.on('typing:update', handleTypingUpdate);
    socket.on('messages:marked_read', handleMessagesMarkedRead);

    // Initial check in case it's already connected
    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }

    // Perform initial fetches
    fetchHistory();
    loadOnlineUsers();

    // Cleanup socket on unmount
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('message:received', handleMessageReceived);
      socket.off('user_list:update', handleUserListUpdate);
      socket.off('typing:update', handleTypingUpdate);
      socket.off('messages:marked_read', handleMessagesMarkedRead);
    };
  }, []);

  // 4. Handle Join Event
  const handleJoin = (username: string) => {
    setCurrentUser(username);
    localStorage.setItem('chat_username', username);
    
    // Emit user:join over active socket connection
    socket.emit('user:join', username);
  };

  // 5. Handle Logout/Session Disconnect
  const handleLogout = () => {
    localStorage.removeItem('chat_username');
    setCurrentUser(null);
    
    // Refresh to force clean socket reload and clean disconnect on backend
    window.location.reload();
  };

  // 6. Send Message Trigger Handler
  const handleSendMessage = async (text: string, sendMethod: 'ws' | 'rest') => {
    if (!currentUser) return;

    if (sendMethod === 'ws' && isConnected) {
      // Method A: WebSocket Direct emission
      socket.emit('message:send', { username: currentUser, text });
    } else {
      // Method B: REST API POST call
      try {
        const data = await sendMessage(currentUser, text);
        if (!data.success) {
          console.error('REST API Send Error:', data.error);
        }
      } catch (error) {
        console.error('REST API Send failed:', error);
      }
    }
  };

  // 7. Emit Typing status
  const handleSendTypingStatus = (isTyping: boolean) => {
    if (!currentUser || !isConnected) return;
    socket.emit('typing:status', { username: currentUser, isTyping });
  };

  // 8. Mark all messages as read
  const handleMarkRead = async () => {
    if (!currentUser) return;
    
    // Mark read in local DB and notify server so other sockets display read double checks
    if (isConnected) {
      socket.emit('message:read_all', { username: currentUser });
    } else {
      try {
        await markMessagesAsRead(currentUser);
      } catch (error) {
        console.error('REST API Mark read failed:', error);
      }
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden font-sans antialiased text-slate-800 bg-slate-50">
      {!currentUser ? (
        <LoginScreen onJoin={handleJoin} />
      ) : (
        <div className="h-full w-full flex overflow-hidden relative">
          {/* Backdrop overlay for mobile */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-all duration-300"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Left Panel Sidebar */}
          <Sidebar
            currentUser={currentUser}
            onlineUsers={onlineUsers}
            isConnected={isConnected}
            onLogout={handleLogout}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          
          {/* Main Chat Feed */}
          <ChatWindow
            currentUser={currentUser}
            messages={messages}
            typingUsers={typingUsers}
            onSendMessage={handleSendMessage}
            onSendTypingStatus={handleSendTypingStatus}
            onMarkRead={handleMarkRead}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>
      )}
    </div>
  );
}
