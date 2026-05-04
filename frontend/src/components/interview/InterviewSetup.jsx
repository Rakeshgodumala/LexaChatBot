import React, { useState } from 'react';
import { Award, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';

const TECHNOLOGIES = [
  'JavaScript',
  'React.js',
  'HTML5',
  'CSS3',
  'Node.js and Express.js',
  'MongoDB',
  'Full-Stack Development',
];

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const QUESTION_COUNTS = [5, 10, 15, 20];

export default function InterviewSetup({ onStart, isLoading = false }) {
  const [technology, setTechnology] = useState('JavaScript');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [totalQuestions, setTotalQuestions] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart({ technology, difficulty, totalQuestions });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Technical Mock Interview Setup
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Simulate a real technical round with structured scoring and instant feedback
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Technology Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
            Select Technology
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TECHNOLOGIES.map((tech) => (
              <button
                type="button"
                key={tech}
                onClick={() => setTechnology(tech)}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition flex items-center justify-between cursor-pointer ${
                  technology === tech
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-500 dark:text-indigo-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="truncate">{tech}</span>
                {technology === tech && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
            Select Difficulty
          </label>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTIES.map((diff) => (
              <button
                type="button"
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium border text-center transition cursor-pointer ${
                  difficulty === diff
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-500 dark:text-indigo-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Question Count Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
            Number of Questions
          </label>
          <div className="grid grid-cols-4 gap-3">
            {QUESTION_COUNTS.map((cnt) => (
              <button
                type="button"
                key={cnt}
                onClick={() => setTotalQuestions(cnt)}
                className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-medium border text-center transition cursor-pointer ${
                  totalQuestions === cnt
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-500 dark:text-indigo-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {cnt} Questions
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-4">
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full py-3"
            icon={Sparkles}
          >
            Start Mock Interview Session
          </Button>
        </div>
      </form>
    </div>
  );
}
