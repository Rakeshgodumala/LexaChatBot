import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  X,
  Plus,
  MessageSquare,
  Award,
  Bookmark,
  Settings,
  LogOut,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TECH_CATEGORIES } from './Sidebar';

export default function MobileSidebar({
  isOpen,
  onClose,
  conversations = [],
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onSelectCategory,
  selectedCategory,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!isOpen) return null;

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectChat = (id) => {
    onSelectConversation(id);
    onClose();
  };

  const handleStartNew = () => {
    onNewChat();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-80 max-w-[85vw] bg-slate-900 text-slate-200 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">LexaChatbot</h2>
              <p className="text-[10px] text-slate-400">Interview Prep</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={handleStartNew}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700/60 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-2 space-y-3 py-1">
          <div className="space-y-0.5">
            <Link
              to="/"
              onClick={onClose}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                location.pathname === '/' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800/50'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Chat Assistant</span>
            </Link>

            <Link
              to="/interview"
              onClick={onClose}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                location.pathname === '/interview' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800/50'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Interview Practice</span>
            </Link>

            <Link
              to="/history"
              onClick={onClose}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                location.pathname === '/history' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800/50'
              }`}
            >
              <Bookmark className="w-4 h-4 text-emerald-400" />
              <span>Saved Questions</span>
            </Link>
          </div>

          {/* Categories */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Categories
            </p>
            <div className="space-y-0.5">
              {TECH_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => {
                      onSelectCategory && onSelectCategory(cat.name);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition text-left ${
                      isSelected
                        ? 'bg-indigo-950 text-indigo-300 font-semibold'
                        : 'text-slate-400 hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${cat.color}`} />
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Chats */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Recent Chats
            </p>
            <div className="space-y-0.5">
              {filteredConversations.map((conv) => (
                <div
                  key={conv._id}
                  onClick={() => handleSelectChat(conv._id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition ${
                    conv._id === activeConversationId
                      ? 'bg-slate-800 text-white font-medium'
                      : 'text-slate-400 hover:bg-slate-800/40'
                  }`}
                >
                  <span className="truncate pr-2">{conv.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv._id);
                    }}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <Link
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>

          {user ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 mt-1">
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="p-1.5 text-slate-400 hover:text-rose-400"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className="w-full flex items-center justify-center py-2 px-3 rounded-xl bg-slate-800 text-white text-xs font-medium"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
