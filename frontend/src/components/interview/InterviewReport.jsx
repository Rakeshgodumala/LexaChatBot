import React from 'react';
import {
  Award,
  CheckCircle,
  AlertCircle,
  BookOpen,
  RotateCcw,
  Home,
  Star,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

export default function InterviewReport({ session, onRetake }) {
  const report = session?.finalReport || {};
  const avgScore = session?.finalScore ?? report?.averageScore ?? 0;

  let scoreGradient = 'from-rose-500 to-orange-500';
  let badgeText = 'Needs Preparation';
  if (avgScore >= 8) {
    scoreGradient = 'from-emerald-500 to-teal-600';
    badgeText = 'Interview Ready';
  } else if (avgScore >= 6) {
    scoreGradient = 'from-indigo-500 to-blue-600';
    badgeText = 'Good Foundation';
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Hero Performance Card */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-4">
          <Award className="w-3.5 h-3.5" />
          {badgeText}
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Interview Performance Summary
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          {session?.technology} ({session?.difficulty} Level) • {report?.questionsAttempted || session?.totalQuestions} Questions Evaluated
        </p>

        {/* Circular / Badge Score */}
        <div className="mt-6 flex flex-col items-center">
          <div className={`w-28 h-28 rounded-full bg-gradient-to-tr ${scoreGradient} flex items-center justify-center text-white shadow-lg p-1`}>
            <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {avgScore}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Out of 10
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 max-w-lg mx-auto">
          {report?.summary || 'Great effort! Review your specific strengths and recommended revision topics below.'}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs text-slate-500">Total Questions</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{report?.totalQuestions || session?.totalQuestions}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs text-slate-500">Attempted</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{report?.questionsAttempted || session?.totalQuestions}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs text-slate-500">Mastered Concepts</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{report?.correctConcepts?.length || 0}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs text-slate-500">Revision Needs</span>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">{report?.missingConcepts?.length || 0}</p>
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-emerald-500" />
            Key Strengths Identified
          </h3>
          <ul className="space-y-2">
            {(report?.strengths && report.strengths.length > 0 ? report.strengths : ['Demonstrated clear articulation of answers']).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-amber-500" />
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {(report?.areasForImprovement && report.areasForImprovement.length > 0 ? report.areasForImprovement : ['Include code walkthroughs and runtime nuances']).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggested Revision Topics */}
      {report?.suggestedRevisionTopics && report.suggestedRevisionTopics.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            Suggested Revision Roadmap
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {report.suggestedRevisionTopics.map((topic, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-200"
              >
                {topic}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Button onClick={onRetake} icon={RotateCcw} size="lg">
          Start Another Mock Interview
        </Button>
        <Link to="/">
          <Button variant="secondary" icon={Home} size="lg">
            Return to Chat Assistant
          </Button>
        </Link>
      </div>
    </div>
  );
}
