const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestionById,
  getCategories,
  searchQuestions,
} = require('../controllers/questionController');

router.get('/categories', getCategories);
router.get('/search', searchQuestions);
router.get('/', getQuestions);
router.get('/:id', getQuestionById);

module.exports = router;
