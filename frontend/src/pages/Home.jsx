import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import MobileSidebar from '../components/layout/MobileSidebar';
import Header from '../components/layout/Header';
import ChatWindow from '../components/chat/ChatWindow';
import ChatInput from '../components/chat/ChatInput';
import { chatService } from '../services/chatService';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Fetch conversations on mount or user login
  useEffect(() => {
    fetchConversations();
  }, [user]);

  const fetchConversations = async () => {
    if (!user) {
      setConversations([]);
      return;
    }
    try {
      const data = await chatService.getConversations();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (err) {
      console.warn('Could not load conversations:', err.message);
    }
  };

  // Load active conversation details
  const handleSelectConversation = async (id) => {
    setActiveConversationId(id);
    setIsLoading(true);
    setError(null);
    try {
      const data = await chatService.getConversationById(id);
      if (data.success && data.conversation) {
        setActiveConversation(data.conversation);
        setMessages(data.conversation.messages || []);
        if (data.conversation.category) {
          setSelectedCategory(data.conversation.category);
        }
      }
    } catch (err) {
      setError('Failed to load conversation history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setActiveConversation(null);
    setMessages([]);
    setError(null);
  };

  // Send a message
  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    // Temporary optimistic user message
    const tempUserMsg = {
      _id: `temp_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const data = await chatService.sendMessage({
        message: text,
        conversationId: activeConversationId,
        category: selectedCategory,
      });

      if (data.success) {
        setActiveConversationId(data.conversationId);
        setActiveConversation(data.conversation);
        setMessages(data.conversation.messages);
        fetchConversations();
      } else {
        throw new Error(data.message || 'Failed to receive response');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error communicating with LexaChatbot API';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Regenerate last response
  const handleRegenerate = async () => {
    if (!activeConversationId || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await chatService.regenerateResponse(activeConversationId);
      if (data.success && data.conversation) {
        setMessages(data.conversation.messages);
        setActiveConversation(data.conversation);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to regenerate answer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Like or Dislike response
  const handleFeedback = async (messageId, feedback) => {
    if (!activeConversationId) return;
    try {
      await chatService.submitFeedback(activeConversationId, messageId, feedback);
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, feedback } : m))
      );
    } catch (err) {
      console.error('Failed to submit feedback:', err.message);
    }
  };

  // Bookmark / Save message
  const handleToggleSave = async (messageId) => {
    if (!activeConversationId) return;
    try {
      const data = await chatService.toggleSaveMessage(activeConversationId, messageId);
      if (data.success) {
        setMessages((prev) =>
          prev.map((m) => (m._id === messageId ? { ...m, isSaved: data.isSaved } : m))
        );
      }
    } catch (err) {
      console.error('Failed to toggle save:', err.message);
    }
  };

  // Delete conversation
  const handleDeleteConversation = async (id) => {
    try {
      await chatService.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (activeConversationId === id) {
        handleNewChat();
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err.message);
    }
  };

  // Rename conversation
  const handleRenameConversation = async (id, newTitle) => {
    try {
      const data = await chatService.updateConversation(id, { title: newTitle });
      if (data.success) {
        setConversations((prev) =>
          prev.map((c) => (c._id === id ? { ...c, title: newTitle } : c))
        );
        if (activeConversationId === id) {
          setActiveConversation((prev) => ({ ...prev, title: newTitle }));
        }
      }
    } catch (err) {
      console.error('Failed to rename conversation:', err.message);
    }
  };

  // Select category from sidebar
  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Desktop Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        onSelectCategory={handleSelectCategory}
        selectedCategory={selectedCategory}
      />

      {/* Mobile Sidebar Drawer */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onSelectCategory={handleSelectCategory}
        selectedCategory={selectedCategory}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Header
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          currentTitle={activeConversation?.title || (selectedCategory !== 'General' ? `${selectedCategory} Interview Prep` : 'New Interview Conversation')}
          category={selectedCategory}
          onNewChat={handleNewChat}
        />

        {/* Chat Window Messages */}
        <ChatWindow
          messages={messages}
          conversationId={activeConversationId}
          isLoading={isLoading}
          error={error}
          onSendMessage={handleSendMessage}
          onRegenerate={handleRegenerate}
          onFeedback={handleFeedback}
          onToggleSave={handleToggleSave}
          onRetry={() => {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg && lastMsg.role === 'user') {
              handleSendMessage(lastMsg.content);
            }
          }}
        />

        {/* Chat Input Composer */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder={
            selectedCategory && selectedCategory !== 'General'
              ? `Ask anything about ${selectedCategory} technical interviews...`
              : 'Ask LexaChatbot anything about JavaScript, React.js, or frontend development...'
          }
        />
      </div>
    </div>
  );
}
