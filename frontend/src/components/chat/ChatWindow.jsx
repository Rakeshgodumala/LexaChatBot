import React, { useRef, useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import WelcomeScreen from './WelcomeScreen';
import TypingIndicator from './TypingIndicator';
import ErrorMessage from '../common/ErrorMessage';
import { ChevronDown } from 'lucide-react';

export default function ChatWindow({
  messages = [],
  conversationId,
  isLoading = false,
  error = null,
  onSendMessage,
  onRegenerate,
  onFeedback,
  onToggleSave,
  onRetry,
}) {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 150;
    setShowScrollBottom(isScrolledUp);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto relative flex flex-col"
    >
      {messages.length === 0 ? (
        <WelcomeScreen onSelectPrompt={onSendMessage} />
      ) : (
        <div className="flex-1 py-4 divide-y divide-slate-100/50 dark:divide-slate-800/40">
          {messages.map((message, index) => (
            <ChatMessage
              key={message._id || index}
              message={message}
              conversationId={conversationId}
              isLast={index === messages.length - 1}
              onRegenerate={onRegenerate}
              onFeedback={onFeedback}
              onToggleSave={onToggleSave}
            />
          ))}

          {isLoading && <TypingIndicator />}

          {error && (
            <div className="max-w-3xl mx-auto px-4 py-3 w-full">
              <ErrorMessage message={error} onRetry={onRetry} />
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      )}

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottom && (
        <button
          onClick={() => scrollToBottom('smooth')}
          className="absolute bottom-6 right-6 p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer z-10"
          title="Scroll to bottom"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
