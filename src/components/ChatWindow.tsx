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
      <div className="h-14 md:h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 px-3 md:px-6 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-600 hover:text-slate-800 hover:bg-gray-100 rounded-lg md:hidden shrink-0 cursor-pointer active:scale-95 transition-transform"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-white shadow-md shrink-0">
            <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm md:text-base font-bold text-slate-800 tracking-tight font-display flex items-center gap-1.5 truncate">
              Vedaz Chat
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                Main
              </span>
            </h2>
            <p className="hidden sm:block text-[10px] md:text-xs text-slate-400 mt-0.5 font-sans truncate">
              Real-time WebSocket Chat
            </p>
          </div>
        </div>

        {/* Header Tools */}
        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          {/* Message Search toggling */}
          <div className="relative flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 140, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-2 py-1.5 text-xs bg-gray-100 rounded-lg text-slate-700 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 mr-1"
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
              className={`p-2 rounded-lg cursor-pointer transition-colors active:scale-95 ${
                isSearchOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-blue-600 hover:bg-gray-100'
              }`}
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Protocol Switcher Indicator */}
          <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
            <button
              onClick={() => setSendMethod('ws')}
              className={`px-2 py-1 text-[10px] font-mono font-bold rounded-md transition-all cursor-pointer ${
                sendMethod === 'ws' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              title="WebSocket"
            >
              WS
            </button>
            <button
              onClick={() => setSendMethod('rest')}
              className={`px-2 py-1 text-[10px] font-mono font-bold rounded-md transition-all cursor-pointer ${
                sendMethod === 'rest' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              title="REST API"
            >
              REST
            </button>
          </div>
        </div>
      </div>

      {/* Messages Stream Content Area */}
      <div className="flex-1 overflow-y-auto px-3 md:px-6 py-3 md:py-4 space-y-3 bg-white">
        {filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-6 bg-white">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 mb-3 animate-bounce">
              <MessageSquare className="w-7 h-7 md:w-8 md:h-8" />
            </div>
            <h3 className="font-display font-bold text-slate-700 text-base md:text-lg">
              {searchTerm ? 'No results found' : 'No messages yet'}
            </h3>
            <p className="text-xs md:text-sm text-slate-400 max-w-xs mt-1">
              {searchTerm 
                ? 'Try adjusting your search.' 
                : 'Send the first message to start chatting!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMessages.map((msg, index) => {
              const isMe = msg.username === currentUser;
              const isSystem = msg.username === 'System';
              
              // Render date separation lines between blocks if date changes
              const showDateHeader = index === 0 || 
                new Date(filteredMessages[index - 1].timestamp).toDateString() !== new Date(msg.timestamp).toDateString();

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex flex-col items-center justify-center my-2">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-mono font-medium text-slate-500 border border-gray-200">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="space-y-2">
                  {showDateHeader && (
                    <div className="flex items-center justify-center my-4">
                      <div className="h-[1px] bg-gray-200 flex-1"></div>
                      <span className="px-2.5 py-0.5 bg-gray-100 text-slate-500 rounded-full text-[9px] md:text-[10px] font-mono font-bold tracking-wider uppercase mx-2">
                        {formatDateHeader(msg.timestamp)}
                      </span>
                      <div className="h-[1px] bg-gray-200 flex-1"></div>
                    </div>
                  )}

                  <div className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                    {/* Message sender Avatar */}
                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-display text-[10px] md:text-xs font-bold shrink-0 ${getAvatarColor(msg.username)}`}>
                      {msg.username.substring(0, 2).toUpperCase()}
                    </div>

                    <div className={`flex flex-col max-w-[75%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                      {/* Sender name - only show for other users */}
                      {!isMe && (
                        <span className="text-[10px] md:text-[11px] font-semibold text-slate-500 mb-0.5 px-1">
                          {msg.username}
                        </span>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`px-3 py-2 md:px-4 md:py-2.5 rounded-2xl text-sm md:text-[15px] leading-relaxed break-words shadow-sm ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-br-md'
                            : 'bg-gray-100 text-slate-800 rounded-bl-md'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>

                      {/* Info footer (Time + Status) */}
                      <div className={`flex items-center gap-1 mt-0.5 text-[9px] md:text-[10px] text-slate-400 font-mono px-1 ${isMe ? '' : ''}`}>
                        <span>{formatTime(msg.timestamp)}</span>
                        {isMe && (
                          <span>
                            {msg.status === 'read' ? (
                              <CheckCheck className="w-3 h-3 text-blue-500" title="Read" />
                            ) : msg.status === 'delivered' ? (
                              <CheckCheck className="w-3 h-3 text-slate-400" title="Delivered" />
                            ) : (
                              <Check className="w-3 h-3 text-slate-400" title="Sent" />
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
            className="px-3 md:px-6 py-1.5 md:py-2 bg-white text-[10px] md:text-xs italic text-slate-400 flex items-center gap-2 shrink-0 border-t border-gray-100"
          >
            <div className="flex gap-1 items-center">
              <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <span>
              {activeTypists.map(u => u.username).join(', ')} typing...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Message Composition Bar */}
      <div className="p-2 md:p-4 bg-white border-t border-gray-200 shrink-0">
        <form onSubmit={handleSend} className="flex gap-2 items-center bg-gray-50 rounded-xl md:rounded-2xl px-3 md:px-4 py-2 md:py-2.5 border border-gray-200">
          <input
            type="text"
            placeholder={`Message via ${sendMethod === 'ws' ? 'WebSocket' : 'REST'}...`}
            value={inputText}
            onChange={handleInputChange}
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 placeholder-slate-400 focus:outline-none min-w-0"
            maxLength={1000}
            autoComplete="off"
          />
          
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSendMethod(sendMethod === 'ws' ? 'rest' : 'ws')}
              className="sm:hidden inline-flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-mono font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase select-none active:scale-95 transition-transform cursor-pointer"
              title="Toggle send method"
            >
              {sendMethod === 'ws' ? (
                <>
                  <Network className="w-2.5 h-2.5" />
                  WS
                </>
              ) : (
                <>
                  <Clock className="w-2.5 h-2.5" />
                  REST
                </>
              )}
            </button>

            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase select-none">
              {sendMethod === 'ws' ? (
                <>
                  <Network className="w-3 h-3 text-blue-500" />
                  WS
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 text-blue-500" />
                  REST
                </>
              )}
            </span>

            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center transition-all shrink-0 active:scale-95 ${
                inputText.trim()
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md cursor-pointer'
                  : 'bg-gray-200 text-slate-300 cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
