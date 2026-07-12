import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, ArrowRight, User } from 'lucide-react';

interface LoginScreenProps {
  onJoin: (username: string) => void;
}

export default function LoginScreen({ onJoin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  // Generate initial based avatar background color dynamically
  const avatarBg = useMemo(() => {
    if (!username.trim()) return 'bg-gray-100 text-gray-400';
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
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }, [username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      setError('Please enter a username to proceed.');
      return;
    }
    if (trimmed.length < 2) {
      setError('Username must be at least 2 characters long.');
      return;
    }
    if (trimmed.length > 20) {
      setError('Username must be under 20 characters.');
      return;
    }
    onJoin(trimmed);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 selection:bg-blue-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-150 overflow-hidden"
      >
        <div className="p-8 text-center border-b border-gray-100 bg-gray-50/50">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-100">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-800 tracking-tight">
            Pulse Chat
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-Time Instant Messaging Experience
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center font-display text-3xl font-bold shadow-inner ${avatarBg}`}>
                {username.trim() ? (
                  username.trim().substring(0, 2).toUpperCase()
                ) : (
                  <User className="w-8 h-8" />
                )}
              </div>
              <p className="text-xs text-slate-400 mt-2 font-mono">Your Avatar Preview</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-slate-700 block">
                Choose a Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter username (e.g., JaneDoe)"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-base"
                  maxLength={20}
                  autoComplete="off"
                />
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-rose-500 font-medium"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-600/15 hover:shadow-blue-600/25 active:scale-[0.98] transition-all cursor-pointer group"
            >
              <span>Join Chat Room</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-slate-400 font-mono">
            Powered by Node.js, Socket.io & React
          </p>
        </div>
      </motion.div>
    </div>
  );
}
