import React from 'react';
import { Sparkles, Code2, Layers, Cpu, ArrowRight } from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  {
    title: 'Explain JavaScript closures with examples',
    category: 'JavaScript',
    desc: 'Lexical scoping, private variables & outer function memory retention.',
    icon: Code2,
    badgeColor: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
  },
  {
    title: 'What is the Virtual DOM in React?',
    category: 'React.js',
    desc: 'Reconciliation, fiber diffing algorithm & real DOM batch updates.',
    icon: Layers,
    badgeColor: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/40',
  },
  {
    title: 'Explain useState and useEffect',
    category: 'React.js',
    desc: 'Component state, lifecycle effects, dependency array & cleanup.',
    icon: Layers,
    badgeColor: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/40',
  },
  {
    title: 'Difference between var, let and const',
    category: 'JavaScript',
    desc: 'Scope, variable hoisting, and Temporal Dead Zone (TDZ).',
    icon: Code2,
    badgeColor: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
  },
  {
    title: 'Explain promises and async/await',
    category: 'JavaScript',
    desc: 'Microtask queue, event loop integration & handling callback hell.',
    icon: Cpu,
    badgeColor: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/40',
  },
  {
    title: 'What are React props and state?',
    category: 'React.js',
    desc: 'Unidirectional data flow, immutability & lifting state up.',
    icon: Layers,
    badgeColor: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/40',
  },
];

export default function WelcomeScreen({ onSelectPrompt }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-4xl mx-auto w-full text-center">
      {/* Brand Icon & Heading */}
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 mb-4 animate-in zoom-in-75 duration-300">
        <Sparkles className="w-7 h-7" />
      </div>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
        Welcome to <span className="text-indigo-600 dark:text-indigo-400">LexaChatbot</span>
      </h1>

      <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl">
        Your personal technical interview preparation assistant. Ask any frontend or full-stack interview question and receive in-depth, structured answers.
      </p>

      {/* Suggested Prompt Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full mt-8 text-left">
        {SUGGESTED_QUESTIONS.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => onSelectPrompt(item.title)}
              className="group relative flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.category}
                  </span>
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {item.desc}
                </p>
              </div>

              <div className="mt-3 flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Ask Lexa</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
