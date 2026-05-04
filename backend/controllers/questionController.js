const Question = require('../models/Question');
const questionService = require('../services/questionService');

/**
 * @desc    Get questions with filters & pagination
 * @route   GET /api/questions
 * @access  Public
 */
const getQuestions = async (req, res, next) => {
  try {
    const { technology, category, difficulty, search, page = 1, limit = 15 } = req.query;

    const query = {};

    if (technology && technology !== 'All') {
      query.technology = technology;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (search && search.trim()) {
      const cleanSearch = search.trim();
      const regex = new RegExp(cleanSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { title: regex },
        { question: regex },
        { keywords: regex },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [questions, total] = await Promise.all([
      Question.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Question.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: questions.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      questions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single question by ID
 * @route   GET /api/questions/:id
 * @access  Public
 */
const getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get available categories and technologies
 * @route   GET /api/questions/categories
 * @access  Public
 */
const getCategories = async (req, res, next) => {
  try {
    const data = await questionService.getCategories();
    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search questions by keywords
 * @route   GET /api/questions/search
 * @access  Public
 */
const searchQuestions = async (req, res, next) => {
  try {
    const { q, technology, category, difficulty, limit = 10 } = req.query;
    const questions = await questionService.searchQuestions({
      query: q,
      technology,
      category,
      difficulty,
      limit,
    });

    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
  getCategories,
  searchQuestions,
};
