import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Sparkles,
  Database,
  CheckCircle,
  Save,
  ShieldCheck,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import api from '../services/api';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, updatePreferences } = useAuth();

  const [preferredTech, setPreferredTech] = useState(user?.preferences?.preferredTech || 'JavaScript');
  const [difficultyPreference, setDifficultyPreference] = useState(user?.preferences?.difficultyPreference || 'Beginner');
  const [systemInfo, setSystemInfo] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data.success) {
          setSystemInfo(res.data);
        }
      } catch (err) {
        console.warn('Could not fetch system info:', err.message);
      }
    };
    fetchSystemSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const success = await updatePreferences({
      theme,
      preferredTech,
      difficultyPreference,
    });

    setIsSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-base font-bold text-slate-900 dark:text-white">
              Application Settings
            </h1>
          </div>
        </div>
      </header>

      {/* Main Form */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {saveSuccess && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold animate-in fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>Preferences saved successfully!</span>
          </div>
        )}

        {/* AI & Engine Status Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            AI & Knowledge Engine Status
          </h2>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {systemInfo?.ai?.provider || 'Google Gemini'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Model: {systemInfo?.ai?.model || 'gemini-1.5-flash'}
                </p>
              </div>
            </div>

            <div>
              {systemInfo?.ai?.configured ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Live AI Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  <Database className="w-3.5 h-3.5" />
                  Database Engine Active
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {systemInfo?.ai?.configured
              ? 'Real-time generative AI answers are enabled. The bot generates answers and evaluates code dynamically.'
              : 'The verified MongoDB Question Bank is responding to questions. You can add a GEMINI_API_KEY in backend/.env anytime to activate dynamic AI.'}
          </p>
        </div>

        {/* Preferences Form */}
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            User Experience Preferences
          </h2>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Appearance Theme
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  theme === 'light'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Theme</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  theme === 'dark'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dark Theme</span>
              </button>
            </div>
          </div>

          {/* Preferred Tech */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Default Target Technology
            </label>
            <select
              value={preferredTech}
              onChange={(e) => setPreferredTech(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="JavaScript">JavaScript</option>
              <option value="React.js">React.js</option>
              <option value="HTML5">HTML5</option>
              <option value="CSS3">CSS3</option>
              <option value="Node.js and Express.js">Node.js and Express.js</option>
              <option value="MongoDB">MongoDB</option>
              <option value="Full-Stack Development">Full-Stack Development</option>
            </select>
          </div>

          {/* Default Difficulty */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Default Difficulty Level
            </label>
            <select
              value={difficultyPreference}
              onChange={(e) => setDifficultyPreference(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="Beginner">Beginner (Students & Freshers)</option>
              <option value="Intermediate">Intermediate (1-3 yrs experience)</option>
              <option value="Advanced">Advanced (Senior & Architecture)</option>
            </select>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              isLoading={isSaving}
              icon={Save}
              className="w-full py-2.5"
            >
              Save Preferences
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
