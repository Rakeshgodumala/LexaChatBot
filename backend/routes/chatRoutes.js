const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const { chatLimiter } = require('../middleware/rateLimitMiddleware');

// All chat routes are protected
router.use(protect);

router.post('/message', chatLimiter, sendMessage);
router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.get('/conversations/:id', getConversationById);
router.patch('/conversations/:id', updateConversation);
router.delete('/conversations/:id', deleteConversation);
router.post('/regenerate/:id', chatLimiter, regenerateResponse);
router.patch('/conversations/:id/messages/:messageId/feedback', submitFeedback);
router.patch('/conversations/:id/messages/:messageId/save', toggleSaveMessage);
router.get('/saved', getSavedMessages);

module.exports = router;
