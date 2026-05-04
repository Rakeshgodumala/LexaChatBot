const express = require('express');
const router = express.Router();
const {
  startInterview,
  submitAnswer,
  getInterviewHistory,
  getInterviewById,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/start', startInterview);
router.post('/answer', submitAnswer);
router.get('/history', getInterviewHistory);
router.get('/:id', getInterviewById);

module.exports = router;
