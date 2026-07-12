import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, LogOut, Search, Radio, MessageSquareCode, X } from 'lucide-react';

interface SidebarProps {
  currentUser: string;
  onlineUsers: { username: string; status: 'online' | 'offline' }[];
  isConnected: boolean;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ currentUser, onlineUsers, isConnected, onLogout, isOpen, onClose }: SidebarProps) {
  const [search, setSearch] = useState('');

  // Dynamically generate initials based avatar colors
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

  const filteredUsers = onlineUsers.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`fixed md:static inset-y-0 left-0 z-50 w-80 h-full bg-white text-slate-800 flex flex-col border-r border-gray-200 transition-transform duration-300 ease-in-out md:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Sidebar Header */}
      <div className="p-5 border-b border-gray-150 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
            <MessageSquareCode className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-slate-800">
            Pulse Chat
          </span>
        </div>

        {/* Server Connection Status & Mobile Close */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-full border border-gray-200">
            <span className={`relative flex h-2 w-2`}>
              {isConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg md:hidden transition-colors cursor-pointer shrink-0"
            title="Close Sidebar"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Current User Info */}
      <div className="p-4 bg-gray-50/50 border-b border-gray-150 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display text-sm font-bold shadow-sm ${getAvatarColor(currentUser)}`}>
            {currentUser.substring(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate text-slate-800">{currentUser}</p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              Active Now
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          title="Disconnect Nickname"
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Online Users Heading and Counter */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            Active Users
          </span>
          <span className="bg-slate-100 px-2 py-0.5 rounded-full font-mono font-bold text-slate-600 text-[10px]">
            {onlineUsers.length}
          </span>
        </div>

        {/* Search Filter bar */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-gray-100 border border-transparent rounded-lg text-xs placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-sans"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        <AnimatePresence initial={false}>
          {filteredUsers.map((user) => {
            const isMe = user.username === currentUser;
            return (
              <motion.div
                key={user.username}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                  isMe ? 'bg-blue-50 text-blue-900 border border-blue-100/50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-display text-xs font-bold shrink-0 ${getAvatarColor(user.username)}`}>
                    {user.username.substring(0, 2).toUpperCase()}
                  </div>
                  <span className={`text-sm truncate ${isMe ? 'font-semibold text-blue-700' : 'text-slate-700'}`}>
                    {user.username} {isMe && '(You)'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredUsers.length === 0 && (
          <div className="p-4 text-center text-xs text-slate-400">
            No matching users
          </div>
        )}
      </div>

      {/* Channel metadata */}
      <div className="p-4 border-t border-gray-150 bg-gray-50 flex items-center gap-2">
        <Radio className="w-4 h-4 text-blue-500 animate-pulse shrink-0" />
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
          Room: #global-comms
        </p>
      </div>
    </div>
  );
}
