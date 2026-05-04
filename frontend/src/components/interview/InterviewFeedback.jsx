import React, { useState } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Button from '../common/Button';

export default function InterviewFeedback({
  evaluation,
  isCompleted,
  onNext,
  isLoading = false,
}) {
  const [showIdealAnswer, setShowIdealAnswer] = useState(false);
  const score = evaluation?.score ?? 0;

  let scoreColor = 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50';
  if (score >= 7) {
    scoreColor = 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50';
  } else if (score >= 5) {
    scoreColor = 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50';
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Score Header Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Evaluation Result
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              Performance Feedback
            </h3>
          </div>

          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border font-bold text-lg sm:text-xl ${scoreColor}`}>
            <span>Score:</span>
            <span>{score} / 10</span>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="mt-4">
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {evaluation?.feedback || 'Answer recorded.'}
          </p>
        </div>

        {/* Correct Concepts */}
        {evaluation?.correctConcepts && evaluation.correctConcepts.length > 0 && (
          <div className="mt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-2">
              <CheckCircle className="w-3.5 h-3.5" />
              Concepts Demonstrated Well
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {evaluation.correctConcepts.map((item, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Concepts */}
        {evaluation?.missingConcepts && evaluation.missingConcepts.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              Missing or Recommended Points
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {evaluation.missingConcepts.map((item, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Ideal Answer Collapsible */}
        {evaluation?.idealAnswer && (
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setShowIdealAnswer(!showIdealAnswer)}
              className="flex items-center justify-between w-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              <span>{showIdealAnswer ? 'Hide Reference Ideal Answer' : 'View Reference Ideal Answer'}</span>
              {showIdealAnswer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showIdealAnswer && (
              <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {evaluation.idealAnswer}
              </div>
            )}
          </div>
        )}

        {/* Next Action Button */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <Button
            onClick={onNext}
            isLoading={isLoading}
            icon={ArrowRight}
            className="py-2.5 px-5"
          >
            {isCompleted ? 'View Final Performance Report' : 'Proceed to Next Question'}
          </Button>
        </div>
      </div>
    </div>
  );
}
