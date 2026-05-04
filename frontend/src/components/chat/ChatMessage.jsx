import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Bot,
  User,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  Sparkles,
  Database,
} from 'lucide-react';

export default function ChatMessage({
  message,
  conversationId,
  isLast = false,
  onRegenerate,
  onFeedback,
  onToggleSave,
}) {
  const isUser = message.role === 'user';
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  if (isUser) {
    return (
      <div className="flex justify-end py-3 px-4 max-w-3xl mx-auto w-full group">
        <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
          <span className="text-[11px] text-slate-400 self-end mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {formattedTime}
          </span>
          <div className="bg-indigo-600 text-white rounded-2xl rounded-br-xs px-4 py-3 shadow-xs text-sm sm:text-base leading-relaxed break-words">
            {message.content}
          </div>
          <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 text-xs font-semibold">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    );
  }

  // Assistant Response Bubble
  return (
    <div className="py-4 px-4 max-w-3xl mx-auto w-full group transition-colors">
      <div className="flex items-start gap-3">
        {/* Lexa Bot Avatar */}
        <div className="w-8 h-8 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200/60 dark:border-indigo-500/30 mt-1">
          <Bot className="w-4 h-4" />
        </div>

        {/* Message Content Container */}
        <div className="flex-1 min-w-0">
          {/* Metadata bar: Response Source & Timestamp */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              LexaChatbot
            </span>

            {/* Source indicator pill */}
            {message.responseSource === 'ai' ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                <Sparkles className="w-3 h-3" />
                AI Generated
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
                <Database className="w-3 h-3" />
                Knowledge Base
              </span>
            )}

            <span className="text-[11px] text-slate-400 ml-auto">
              {formattedTime}
            </span>
          </div>

          {/* Rendered Markdown Body */}
          <div className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h3({ children }) {
                  return (
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-4 mb-2 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-1">
                      {children}
                    </h3>
                  );
                },
                p({ children }) {
                  return <p className="mb-3 text-slate-700 dark:text-slate-300">{children}</p>;
                },
                ul({ children }) {
                  return <ul className="list-disc pl-5 mb-3 space-y-1 text-slate-700 dark:text-slate-300">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal pl-5 mb-3 space-y-1 text-slate-700 dark:text-slate-300">{children}</ol>;
                },
                li({ children }) {
                  return <li className="text-sm leading-relaxed">{children}</li>;
                },
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : 'javascript';
                  const codeString = String(children).replace(/\n$/, '');

                  if (!inline && (match || codeString.includes('\n'))) {
                    return (
                      <div className="relative my-3 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900 text-slate-100 shadow-sm">
                        <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-950/70 border-b border-slate-800 text-xs text-slate-400">
                          <span className="font-mono uppercase tracking-wider">{language}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(codeString, codeString.length)}
                            className="inline-flex items-center gap-1 text-slate-400 hover:text-white px-2 py-0.5 rounded-md hover:bg-slate-800 transition-colors"
                          >
                            {copiedCodeIndex === codeString.length ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={language}
                          PreTag="div"
                          customStyle={{
                            margin: 0,
                            padding: '1rem',
                            fontSize: '0.85rem',
                            background: '#0d1117',
                          }}
                          {...props}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }

                  return (
                    <code className="bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-slate-400">
            {/* Copy Response */}
            <button
              onClick={() => handleCopyText(message.content)}
              title="Copy entire answer"
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              {copiedResponse ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            {/* Like */}
            <button
              onClick={() => onFeedback && onFeedback(message._id, message.feedback === 'like' ? null : 'like')}
              title="Helpful response"
              className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                message.feedback === 'like' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40' : 'hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
            </button>

            {/* Dislike */}
            <button
              onClick={() => onFeedback && onFeedback(message._id, message.feedback === 'dislike' ? null : 'dislike')}
              title="Unhelpful response"
              className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                message.feedback === 'dislike' ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40' : 'hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
            </button>

            {/* Bookmark / Save */}
            <button
              onClick={() => onToggleSave && onToggleSave(message._id)}
              title={message.isSaved ? 'Remove from saved' : 'Save for interview revision'}
              className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                message.isSaved ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' : 'hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {message.isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-amber-500" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            {/* Regenerate Response */}
            {isLast && onRegenerate && (
              <button
                onClick={onRegenerate}
                title="Regenerate this response"
                className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
