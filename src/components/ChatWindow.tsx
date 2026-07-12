import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  MessageSquare, 
  Search, 
  Smile, 
  Check, 
  CheckCheck, 
  Clock, 
  Sparkles,
  HelpCircle,
  Network,
  Menu
} from 'lucide-react';
import { Message, TypingStatus } from '../types';

interface ChatWindowProps {
  currentUser: string;
  messages: Message[];
  typingUsers: TypingStatus[];
  onSendMessage: (text: string, sendMethod: 'ws' | 'rest') => void;
  onSendTypingStatus: (isTyping: boolean) => void;
  onMarkRead: () => void;
  onToggleSidebar: () => void;
}

export default function ChatWindow({ 
  currentUser, 
  messages, 
  typingUsers, 
  onSendMessage, 
  onSendTypingStatus,
  onMarkRead,
  onToggleSidebar
}: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const [sendMethod, setSendMethod] = useState<'ws' | 'rest'>('ws');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousMessageCountRef = useRef(0);

  // Auto-scroll on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Only auto-scroll if new messages were added (not on initial load)
    if (messages.length > previousMessageCountRef.current) {
      scrollToBottom();
    }
    previousMessageCountRef.current = messages.length;
    
    // Mark messages as read when window mounts
    onMarkRead();
  }, [messages]);

  // Handle typing status logic
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    
    // Notify server of typing
    onSendTypingStatus(true);

    // Debounce to stop typing indicator after 1.5 seconds of silence
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      onSendTypingStatus(false);
    }, 1500);
  };

  // Submit message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    onSendMessage(trimmed, sendMethod);
    setInputText('');
    
    // Immediately clear typing status
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    onSendTypingStatus(false);
  };

  // Helper to format ISO timestamp to human clock string
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  // Helper to format Date header
  const formatDateHeader = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  // Filter messages based on search term
  const filteredMessages = messages.filter((msg) =>
    msg.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate avatar colors
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500 text-white',
      'bg-purple-500 text-white',
      'bg-indigo-500 text-white',
      'bg-emerald-500 text-white',
      'bg-pink-500 text-white',
      'bg-amber-500 text-white',
      'bg-rose-500 text-white',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // Get active typing users string excluding myself
  const activeTypists = typingUsers.filter(u => u.isTyping && u.username !== currentUser);

  return (
    <div className="flex-1 h-full bg-gray-50 flex flex-col min-w-0 selection:bg-blue-100">
      {/* Top Navigation Bar */}
      <div className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-150 px-4 md:px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-gray-100 rounded-lg md:hidden shrink-0 cursor-pointer"
            title="Toggle Sidebar"
          >
            <Menu className="w-5.5 h-5.5" />
          </button>

          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-slate-500 font-bold border border-gray-200 shrink-0 hidden sm:flex">
            #
          </div>
          <div className="min-w-0">
            <h2 className="text-sm md:text-base font-bold text-slate-800 tracking-tight font-display flex items-center gap-1.5 truncate">
              vedaz chat room
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                Main Channel
              </span>
            </h2>
            <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 font-sans truncate">
              Broadcast, REST & WebSocket Unified Chat Sandbox
            </p>
          </div>
        </div>

        {/* Header Tools */}
        <div className="flex items-center gap-3">
          {/* Message Search toggling */}
          <div className="relative flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  type="text"
                  placeholder="Search in chat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-gray-100 rounded-lg text-slate-700 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 mr-2"
                  autoFocus
                />
              )}
            </AnimatePresence>
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (isSearchOpen) setSearchTerm('');
              }}
              title="Search Messages"
              className={`p-2 rounded-lg cursor-pointer transition-colors ${
                isSearchOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-blue-600 hover:bg-gray-100'
              }`}
            >
              <Search className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Protocol Switcher Indicator */}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
            <button
              onClick={() => setSendMethod('ws')}
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                sendMethod === 'ws' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Send natively via WebSocket connection"
            >
              WS ⚡
            </button>
            <button
              onClick={() => setSendMethod('rest')}
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                sendMethod === 'rest' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Send via Node.js Express REST API POST"
            >
              REST 🌐
            </button>
          </div>
        </div>
      </div>

      {/* Messages Stream Content Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6 space-y-4 bg-white">
        {filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-8 bg-white">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 mb-4 animate-bounce">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-slate-700 text-lg">
              {searchTerm ? 'No results found' : 'No messages yet'}
            </h3>
            <p className="text-sm text-slate-400 max-w-xs mt-1">
              {searchTerm 
                ? 'Try adjusting your search filters to find historical items.' 
                : 'Send the very first message! Type below to broadcast real-time chats to anyone.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((msg, index) => {
              const isMe = msg.username === currentUser;
              const isSystem = msg.username === 'System';
              
              // Render standard date separation lines between blocks if date changes
              const showDateHeader = index === 0 || 
                new Date(filteredMessages[index - 1].timestamp).toDateString() !== new Date(msg.timestamp).toDateString();

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex flex-col items-center justify-center my-3">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-[11px] font-mono font-medium text-slate-500 border border-gray-150">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="space-y-2">
                  {showDateHeader && (
                    <div className="flex items-center justify-center my-6">
                      <div className="h-[1px] bg-gray-150 flex-1"></div>
                      <span className="px-3.5 py-1 bg-gray-100 text-slate-500 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase mx-3">
                        {formatDateHeader(msg.timestamp)}
                      </span>
                      <div className="h-[1px] bg-gray-150 flex-1"></div>
                    </div>
                  )}

                  <div className={`flex items-end gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                    {/* Message sender Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display text-xs font-bold shrink-0 mb-5 ${getAvatarColor(msg.username)}`}>
                      {msg.username.substring(0, 2).toUpperCase()}
                    </div>

                    <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                      {/* Sender details */}
                      {!isMe && (
                        <span className="text-[11px] font-semibold text-slate-400 ml-1 mb-1 font-sans">
                          {msg.username}
                        </span>
                      )}

                      {/* Bubble block */}
                      <div
                        className={`p-4 rounded-2xl text-sm leading-relaxed break-words relative transition-all group ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                            : 'bg-gray-100 text-slate-800 rounded-bl-none'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>

                      {/* Info footer (Time + Status) */}
                      <div className={`flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-mono ${isMe ? 'mr-1' : 'ml-1'}`}>
                        <span>{formatTime(msg.timestamp)}</span>
                        {isMe && (
                          <span className="text-blue-500">
                            {msg.status === 'read' ? (
                              <CheckCheck className="w-3.5 h-3.5 text-blue-500" title="Read by everyone" />
                            ) : msg.status === 'delivered' ? (
                              <CheckCheck className="w-3.5 h-3.5 text-slate-400" title="Delivered to room" />
                            ) : (
                              <Check className="w-3.5 h-3.5 text-slate-400" title="Sent successfully" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicators */}
      <AnimatePresence>
        {activeTypists.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="px-4 md:px-8 py-2 bg-white text-xs italic text-slate-400 flex items-center gap-2 shrink-0 border-t border-gray-100 animate-pulse"
          >
            <div className="flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <span>
              {activeTypists.map(u => u.username).join(', ')} is typing...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Message Composition Bar */}
      <div className="p-3 md:p-6 bg-white border-t border-gray-100 shrink-0">
        <form onSubmit={handleSend} className="flex gap-2 md:gap-4 items-center bg-gray-50 rounded-2xl px-3 md:px-5 py-2 md:py-3">
          <input
            type="text"
            placeholder={`Write a message via ${sendMethod === 'ws' ? 'WebSocket...' : 'REST API POST...'}`}
            value={inputText}
            onChange={handleInputChange}
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            maxLength={1000}
            autoComplete="off"
          />
          
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase select-none shrink-0">
              {sendMethod === 'ws' ? (
                <>
                  <Network className="w-3 h-3 text-blue-500" />
                  Socket
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 text-blue-500 animate-spin" />
                  REST API
                </>
              )}
            </span>

            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                inputText.trim()
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                  : 'bg-gray-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4 transform rotate-90" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
