const Conversation = require('../models/Conversation');
const chatbotService = require('../services/chatbotService');
const { validateChatMessage } = require('../utils/validators');

/**
 * @desc    Send a message and get chatbot response
 * @route   POST /api/chat/message
 * @access  Private / Authenticated
 */
const sendMessage = async (req, res, next) => {
  try {
    const { isValid, errors } = validateChatMessage(req.body);
    if (!isValid) {
      return res.status(400).json({ success: false, errors });
    }

    const { message, conversationId, category = 'General' } = req.body;
    const userId = req.user._id;

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findOne({ _id: conversationId, userId });
      if (!conversation) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }
    } else {
      // Auto-generate title from the first question (up to 40 chars)
      const title = message.length > 40 ? `${message.substring(0, 40).trim()}...` : message;
      conversation = await Conversation.create({
        userId,
        title,
        category,
        messages: [],
      });
    }

    // Append user message
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    conversation.messages.push(userMessage);

    // Call chatbot engine with conversation history
    const botResult = await chatbotService.processMessage({
      message,
      conversationHistory: conversation.messages.slice(-8),
      category: conversation.category || category,
    });

    // Append assistant response
    const assistantMessage = {
      role: 'assistant',
      content: botResult.content,
      timestamp: new Date(),
      responseSource: botResult.responseSource,
    };
    conversation.messages.push(assistantMessage);

    await conversation.save();

    res.status(200).json({
      success: true,
      conversationId: conversation._id,
      title: conversation.title,
      userMessage,
      assistantMessage,
      conversation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all conversations of the user
 * @route   GET /api/chat/conversations
 * @access  Private
 */
const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ userId: req.user._id })
      .select('title category updatedAt createdAt messages')
      .sort({ updatedAt: -1 });

    const formatted = conversations.map((c) => ({
      _id: c._id,
      title: c.title,
      category: c.category,
      updatedAt: c.updatedAt,
      createdAt: c.createdAt,
      messageCount: c.messages.length,
      lastMessage: c.messages.length > 0 ? c.messages[c.messages.length - 1].content.slice(0, 80) : '',
    }));

    res.status(200).json({
      success: true,
      conversations: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new empty conversation
 * @route   POST /api/chat/conversations
 * @access  Private
 */
const createConversation = async (req, res, next) => {
  try {
    const { title = 'New Conversation', category = 'General' } = req.body;
    const conversation = await Conversation.create({
      userId: req.user._id,
      title,
      category,
      messages: [],
    });

    res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single conversation by ID
 * @route   GET /api/chat/conversations/:id
 * @access  Private
 */
const getConversationById = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Rename a conversation
 * @route   PATCH /api/chat/conversations/:id
 * @access  Private
 */
const updateConversation = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title: title.trim() },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a conversation
 * @route   DELETE /api/chat/conversations/:id
 * @access  Private
 */
const deleteConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Regenerate response for the last user prompt in a conversation
 * @route   POST /api/chat/regenerate/:id
 * @access  Private
 */
const regenerateResponse = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!conversation || conversation.messages.length === 0) {
      return res.status(404).json({ success: false, message: 'No messages to regenerate' });
    }

    // Find the last user message
    let lastUserIndex = -1;
    for (let i = conversation.messages.length - 1; i >= 0; i--) {
      if (conversation.messages[i].role === 'user') {
        lastUserIndex = i;
        break;
      }
    }

    if (lastUserIndex === -1) {
      return res.status(400).json({ success: false, message: 'No user message found to regenerate' });
    }

    const lastUserMessage = conversation.messages[lastUserIndex];

    // Remove any assistant responses after this user message
    conversation.messages = conversation.messages.slice(0, lastUserIndex + 1);

    // Call chatbot engine
    const botResult = await chatbotService.processMessage({
      message: lastUserMessage.content,
      conversationHistory: conversation.messages.slice(-8),
      category: conversation.category,
    });

    const assistantMessage = {
      role: 'assistant',
      content: botResult.content,
      timestamp: new Date(),
      responseSource: botResult.responseSource,
    };
    conversation.messages.push(assistantMessage);

    await conversation.save();

    res.status(200).json({
      success: true,
      conversation,
      assistantMessage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Feedback (like/dislike) for a message
 * @route   PATCH /api/chat/conversations/:id/messages/:messageId/feedback
 * @access  Private
 */
const submitFeedback = async (req, res, next) => {
  try {
    const { feedback } = req.body;
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const msg = conversation.messages.id(req.params.messageId);
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    msg.feedback = feedback;
    await conversation.save();

    res.status(200).json({
      success: true,
      message: 'Feedback updated',
      feedback: msg.feedback,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Save/bookmark or unsave a message
 * @route   PATCH /api/chat/conversations/:id/messages/:messageId/save
 * @access  Private
 */
const toggleSaveMessage = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const msg = conversation.messages.id(req.params.messageId);
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    msg.isSaved = !msg.isSaved;
    await conversation.save();

    res.status(200).json({
      success: true,
      isSaved: msg.isSaved,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all saved questions/answers across all user conversations
 * @route   GET /api/chat/saved
 * @access  Private
 */
const getSavedMessages = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      userId: req.user._id,
      'messages.isSaved': true,
    });

    const savedItems = [];
    conversations.forEach((conv) => {
      conv.messages.forEach((msg, idx) => {
        if (msg.isSaved) {
          // If assistant message is saved, find the user question right before it
          const userQuestion = idx > 0 && conv.messages[idx - 1].role === 'user'
            ? conv.messages[idx - 1].content
            : conv.title;

          savedItems.push({
            conversationId: conv._id,
            conversationTitle: conv.title,
            category: conv.category,
            messageId: msg._id,
            question: userQuestion,
            content: msg.content,
            timestamp: msg.timestamp,
            responseSource: msg.responseSource,
          });
        }
      });
    });

    res.status(200).json({
      success: true,
      saved: savedItems,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getConversations,
  createConversation,
  getConversationById,
  updateConversation,
  deleteConversation,
  regenerateResponse,
  submitFeedback,
  toggleSaveMessage,
  getSavedMessages,
};
