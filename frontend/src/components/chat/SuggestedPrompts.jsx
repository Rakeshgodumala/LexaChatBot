import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function SuggestedPrompts({ onSelectPrompt, prompts = [] }) {
  if (!prompts || prompts.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {prompts.map((prompt, idx) => (
        <button
          key={idx}
          onClick={() => onSelectPrompt(prompt)}
          className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 dark:bg-slate-800/80 dark:hover:bg-indigo-950/40 dark:text-slate-300 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-700/60 transition-colors text-left"
        >
          <span>{prompt}</span>
          <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      ))}
    </div>
  );
}
