import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Award,
  Calendar,
  Sparkles,
  Database,
  ExternalLink,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { chatService } from '../services/chatService';
import { interviewService } from '../services/interviewService';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import Modal from '../components/common/Modal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function History() {
  const [activeTab, setActiveTab] = useState('saved'); // 'saved' | 'interviews'
  const [savedItems, setSavedItems] = useState([]);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedSessionModal, setSelectedSessionModal] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === 'saved') {
        const data = await chatService.getSavedMessages();
        if (data.success) {
          setSavedItems(data.saved || []);
        }
      } else {
        const data = await interviewService.getInterviewHistory();
        if (data.success) {
          setInterviewHistory(data.history || []);
        }
      }
    } catch (err) {
      setError('Failed to load records. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSession = async (id) => {
    try {
      const data = await interviewService.getInterviewById(id);
      if (data.success) {
        setSelectedSessionModal(data.session);
      }
    } catch (err) {
      console.error('Failed to load session details:', err.message);
    }
  };

  const filteredSaved = savedItems.filter(
    (item) =>
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase())
  );

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
          <h1 className="text-base font-bold text-slate-900 dark:text-white">
            Interview Prep Archive
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Questions ({savedItems.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('interviews')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'interviews'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Mock Sessions ({interviewHistory.length})</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6">
        {error && <ErrorMessage message={error} onRetry={loadData} className="mb-4" />}

        {isLoading ? (
          <Loader text="Loading your interview records..." />
        ) : activeTab === 'saved' ? (
          <div>
            {/* Search */}
            <div className="relative mb-6">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search saved interview questions & answers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {filteredSaved.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <Bookmark className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                  No Saved Questions Found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Click the bookmark icon under any chatbot response to save questions for quick revision before your interviews.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSaved.map((item) => (
                  <div
                    key={item.messageId}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                        {item.category || 'General'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                      {item.question}
                    </h4>

                    <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm line-clamp-6">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {item.content}
                      </ReactMarkdown>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                      <Link
                        to="/"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Open in Chat Assistant <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Mock Sessions List */
          <div>
            {interviewHistory.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <Award className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                  No Mock Interview Sessions Yet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto mb-4">
                  Test your skills under realistic technical interview conditions and get evaluated with constructive feedback.
                </p>
                <Link
                  to="/interview"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition"
                >
                  Start First Mock Interview
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {interviewHistory.map((sess) => (
                  <div
                    key={sess._id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(sess.createdAt).toLocaleDateString()}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                            sess.finalScore >= 7
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                              : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                          }`}
                        >
                          Score: {sess.finalScore} / 10
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {sess.technology}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {sess.difficulty} Level • {sess.totalQuestions} Questions
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                      <button
                        onClick={() => handleViewSession(sess._id)}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        View Performance Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Session Details Modal */}
      <Modal
        isOpen={Boolean(selectedSessionModal)}
        onClose={() => setSelectedSessionModal(null)}
        title="Mock Interview Evaluation Details"
        maxWidth="max-w-2xl"
      >
        {selectedSessionModal && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {selectedSessionModal.technology} ({selectedSessionModal.difficulty})
                </p>
                <p className="text-[11px] text-slate-500">
                  {new Date(selectedSessionModal.createdAt).toLocaleString()}
                </p>
              </div>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                Score: {selectedSessionModal.finalScore} / 10
              </span>
            </div>

            <div className="space-y-3">
              {selectedSessionModal.questions?.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2"
                >
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    Q{idx + 1}: {q.questionText}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Your Answer: </span>
                    {q.userAnswer || '(No answer provided)'}
                  </p>
                  <p className="text-indigo-600 dark:text-indigo-400">
                    <span className="font-semibold">Feedback: </span>
                    {q.feedback} (Score: {q.score}/10)
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
