import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MessageSquare,
  Plus,
  Search,
  Trash2,
  Edit2,
  Check,
  X,
  Code2,
  Terminal,
  Bookmark,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  FileCode,
  Palette,
  Server,
  Database,
  Globe,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal';

export const TECH_CATEGORIES = [
  { name: 'JavaScript', icon: Code2, color: 'text-amber-500' },
  { name: 'React.js', icon: Layers, color: 'text-cyan-500' },
  { name: 'HTML5', icon: FileCode, color: 'text-orange-500' },
  { name: 'CSS3', icon: Palette, color: 'text-blue-500' },
  { name: 'Node.js and Express.js', icon: Server, color: 'text-emerald-500' },
  { name: 'MongoDB', icon: Database, color: 'text-green-500' },
  { name: 'Full-Stack Development', icon: Globe, color: 'text-purple-500' },
];

export default function Sidebar({
  conversations = [],
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onRenameConversation,
  onSelectCategory,
  selectedCategory,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [deleteModalId, setDeleteModalId] = useState(null);

  const { user, logout } = useAuth();
  const location = useLocation();

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startRename = (conv, e) => {
    e.stopPropagation();
    setEditingId(conv._id);
    setEditTitle(conv.title);
  };

  const handleSaveRename = (e) => {
    e.stopPropagation();
    if (editTitle.trim() && editingId) {
      onRenameConversation(editingId, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const confirmDelete = () => {
    if (deleteModalId) {
      onDeleteConversation(deleteModalId);
      setDeleteModalId(null);
    }
  };

  return (
    <>
      <aside
        className={`hidden lg:flex flex-col h-screen bg-slate-900 text-slate-200 border-r border-slate-800 transition-all duration-300 relative z-30 select-none ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-slate-700 transition"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                LexaChatbot
              </h1>
              <p className="text-[11px] text-slate-400 truncate">
                Interview Prep Assistant
              </p>
            </div>
          )}
        </div>

        {/* New Chat Primary Action */}
        <div className="p-3">
          <button
            onClick={onNewChat}
            className={`w-full flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition shadow-sm cursor-pointer ${
              isCollapsed ? 'px-0' : ''
            }`}
            title="Start a new interview conversation"
          >
            <Plus className="w-4 h-4" />
            {!isCollapsed && <span>New Chat</span>}
          </button>
        </div>

        {/* Search Conversations (Visible when expanded) */}
        {!isCollapsed && (
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Middle Navigation & Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-4 py-2">
          {/* Main App Navigation Links */}
          <div className="space-y-0.5">
            <Link
              to="/"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                location.pathname === '/'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title="Chat Assistant"
            >
              <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0" />
              {!isCollapsed && <span>Chat Assistant</span>}
            </Link>

            <Link
              to="/interview"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                location.pathname === '/interview'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title="Mock Interview Practice"
            >
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              {!isCollapsed && <span>Interview Practice</span>}
            </Link>

            <Link
              to="/history"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                location.pathname === '/history'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title="Saved Questions & History"
            >
              <Bookmark className="w-4 h-4 text-emerald-400 shrink-0" />
              {!isCollapsed && <span>Saved Questions</span>}
            </Link>
          </div>

          {/* Technology Categories */}
          {!isCollapsed && (
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Categories
              </p>
              <div className="space-y-0.5">
                {TECH_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => onSelectCategory && onSelectCategory(cat.name)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition cursor-pointer text-left ${
                        isSelected
                          ? 'bg-indigo-950/70 text-indigo-300 font-semibold border border-indigo-800/40'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${cat.color}`} />
                        <span className="truncate">{cat.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Conversations */}
          {!isCollapsed && (
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Recent Chats
              </p>
              {filteredConversations.length === 0 ? (
                <p className="px-3 py-2 text-xs text-slate-500 italic">
                  {searchTerm ? 'No matching conversations' : 'No conversations yet'}
                </p>
              ) : (
                <div className="space-y-0.5">
                  {filteredConversations.map((conv) => {
                    const isActive = conv._id === activeConversationId;
                    const isEditing = conv._id === editingId;

                    return (
                      <div
                        key={conv._id}
                        onClick={() => onSelectConversation(conv._id)}
                        className={`group relative flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition ${
                          isActive
                            ? 'bg-slate-800 text-white font-medium'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(e);
                                if (e.key === 'Escape') handleCancelRename(e);
                              }}
                              autoFocus
                              className="w-full bg-slate-900 border border-indigo-500 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
                            />
                            <button
                              onClick={handleSaveRename}
                              className="p-1 hover:text-emerald-400"
                              title="Save"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={handleCancelRename}
                              className="p-1 hover:text-rose-400"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 truncate pr-2">
                              <MessageSquare className="w-3.5 h-3.5 shrink-0 text-slate-500 group-hover:text-slate-400" />
                              <span className="truncate">{conv.title}</span>
                            </div>

                            <div className="hidden group-hover:flex items-center gap-1 text-slate-400 shrink-0">
                              <button
                                onClick={(e) => startRename(conv, e)}
                                className="p-1 hover:text-white rounded"
                                title="Rename conversation"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteModalId(conv._id);
                                }}
                                className="p-1 hover:text-rose-400 rounded"
                                title="Delete conversation"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer: User Profile, Settings & Logout */}
        <div className="p-3 border-t border-slate-800/80 space-y-1">
          <Link
            to="/settings"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition cursor-pointer"
            title="Settings"
          >
            <Settings className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </Link>

          {user ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50 mt-1">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
                  {user.name ? user.name[0] : 'U'}
                </div>
                {!isCollapsed && (
                  <div className="overflow-hidden">
                    <p className="text-xs font-medium text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>
                )}
              </div>

              {!isCollapsed && (
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-700/50 transition cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            !isCollapsed && (
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition"
              >
                Sign In
              </Link>
            )
          )}
        </div>
      </aside>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteModalId)}
        onClose={() => setDeleteModalId(null)}
        title="Delete Conversation"
      >
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Are you sure you want to delete this conversation? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setDeleteModalId(null)}
            className="px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 text-sm rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition font-medium"
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}
