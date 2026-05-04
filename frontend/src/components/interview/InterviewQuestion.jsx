import React, { useState } from 'react';
import { Send, AlertCircle, HelpCircle } from 'lucide-react';
import Button from '../common/Button';

export default function InterviewQuestion({
  question,
  currentIndex,
  totalQuestions,
  onSubmitAnswer,
  isLoading = false,
}) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim() || isLoading) return;
    onSubmitAnswer(answer.trim());
  };

  const progressPercentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <span className="text-indigo-600 dark:text-indigo-400">{progressPercentage}% Completed</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Technical Interview Question
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
              {question?.questionText || 'Loading question...'}
            </h3>
          </div>
        </div>

        {/* Answer Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              Your Answer (Provide explanations, syntax, and relevant nuances):
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your technical answer here. Mention definitions, mechanisms, and code if applicable..."
              rows={8}
              disabled={isLoading}
              className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 font-mono text-sm leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {answer.length} characters entered
            </span>
            <Button
              type="submit"
              disabled={!answer.trim() || isLoading}
              isLoading={isLoading}
              icon={Send}
            >
              Submit Answer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
