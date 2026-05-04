import React from 'react';
import { Menu, Sun, Moon, Sparkles, MessageSquare, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Header({
  onToggleMobileSidebar,
  currentTitle,
  category,
  onNewChat,
}) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 flex items-center justify-between z-20 shrink-0">
      {/* Left: Mobile hamburger & current conversation title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 hidden sm:block" />
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate max-w-xs sm:max-w-md">
            {currentTitle || 'LexaChatbot Interview Assistant'}
          </h2>
          {category && category !== 'General' && (
            <span className="hidden md:inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {category}
            </span>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {onNewChat && (
          <button
            onClick={onNewChat}
            className="sm:hidden p-2 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
            title="Start new chat"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {user ? (
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase">
              {user.name ? user.name[0] : 'U'}
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
              {user.name}
            </span>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-1"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
