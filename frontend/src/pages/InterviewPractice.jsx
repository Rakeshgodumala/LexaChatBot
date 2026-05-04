import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, Sparkles, BookOpen } from 'lucide-react';
import InterviewSetup from '../components/interview/InterviewSetup';
import InterviewQuestion from '../components/interview/InterviewQuestion';
import InterviewFeedback from '../components/interview/InterviewFeedback';
import InterviewReport from '../components/interview/InterviewReport';
import ErrorMessage from '../components/common/ErrorMessage';
import { interviewService } from '../services/interviewService';
import { useAuth } from '../context/AuthContext';

export default function InterviewPractice() {
  const { user } = useAuth();
  const [phase, setPhase] = useState('setup'); // 'setup' | 'question' | 'feedback' | 'report'
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [latestEvaluation, setLatestEvaluation] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStartInterview = async ({ technology, difficulty, totalQuestions }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await interviewService.startInterview({
        technology,
        difficulty,
        totalQuestions,
      });

      if (data.success && data.session) {
        setSession(data.session);
        setCurrentQuestion(data.session.currentQuestion);
        setPhase('question');
      } else {
        throw new Error(data.message || 'Failed to start interview session');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to initialize mock interview.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async (answerText) => {
    if (!session?._id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await interviewService.submitAnswer({
        sessionId: session._id,
        answer: answerText,
      });

      if (data.success) {
        setLatestEvaluation(data.evaluation);
        setIsCompleted(data.isCompleted);
        setSession(data.session);

        if (data.isCompleted) {
          setPhase('feedback');
        } else {
          setCurrentQuestion(data.nextQuestion);
          setPhase('feedback');
        }
      } else {
        throw new Error(data.message || 'Failed to evaluate answer');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit answer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedFromFeedback = () => {
    if (isCompleted) {
      setPhase('report');
    } else {
      setPhase('question');
    }
  };

  const handleRetake = () => {
    setSession(null);
    setCurrentQuestion(null);
    setLatestEvaluation(null);
    setIsCompleted(false);
    setPhase('setup');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Return to Chat"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h1 className="text-base font-bold text-slate-900 dark:text-white">
              Mock Technical Interview
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/history"
            className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition"
          >
            Past Sessions & Bookmarks
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onRetry={() => setError(null)} />
          </div>
        )}

        {phase === 'setup' && (
          <InterviewSetup
            onStart={handleStartInterview}
            isLoading={isLoading}
          />
        )}

        {phase === 'question' && (
          <InterviewQuestion
            question={currentQuestion}
            currentIndex={session?.currentQuestionIndex ?? currentQuestion?.index ?? 0}
            totalQuestions={session?.totalQuestions || 5}
            onSubmitAnswer={handleSubmitAnswer}
            isLoading={isLoading}
          />
        )}

        {phase === 'feedback' && (
          <InterviewFeedback
            evaluation={latestEvaluation}
            isCompleted={isCompleted}
            onNext={handleProceedFromFeedback}
            isLoading={isLoading}
          />
        )}

        {phase === 'report' && (
          <InterviewReport
            session={session}
            onRetake={handleRetake}
          />
        )}
      </main>
    </div>
  );
}
