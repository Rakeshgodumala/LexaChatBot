const Question = require('../models/Question');
const { formatStructuredResponse } = require('../utils/responseFormatter');

class QuestionService {
  /**
   * Search stored questions by keyword, query string, technology, difficulty
   */
  async searchQuestions({ query = '', technology = '', category = '', difficulty = '', limit = 10 }) {
    const filter = {};

    if (technology && technology !== 'All') {
      filter.technology = technology;
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }

    if (query && query.trim().length > 0) {
      const cleanQuery = query.trim().toLowerCase();
      const regex = new RegExp(cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

      filter.$or = [
        { title: regex },
        { question: regex },
        { answer: regex },
        { keywords: regex },
      ];
    }

    const questions = await Question.find(filter)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    return questions;
  }

  /**
   * Finds the best matching question in MongoDB for a user's natural query
   */
  async findBestMatch(userQuery, category = '') {
    if (!userQuery || !userQuery.trim()) return null;

    const query = userQuery.trim().toLowerCase();

    // 1. Exact or title contains match
    let match = await Question.findOne({
      $or: [
        { title: { $regex: new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') } },
        { question: { $regex: new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') } },
      ],
    });

    if (match) return match;

    // 2. Keyword tokens matching
    const tokens = query
      .replace(/[^\w\s]/gi, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2 && !['what', 'when', 'where', 'which', 'explain', 'difference', 'between', 'how', 'does', 'work', 'the', 'and', 'with', 'for'].includes(t));

    if (tokens.length > 0) {
      match = await Question.findOne({
        keywords: { $in: tokens },
      });
      if (match) return match;

      // Text search if text index is available
      try {
        const textMatches = await Question.find(
          { $text: { $search: tokens.join(' ') } },
          { score: { $meta: 'textScore' } }
        )
          .sort({ score: { $meta: 'textScore' } })
          .limit(1);

        if (textMatches && textMatches.length > 0) {
          return textMatches[0];
        }
      } catch (err) {
        // Text index might not be ready yet
      }
    }

    return null;
  }

  /**
   * Returns a formatted fallback answer from a question record
   */
  formatQuestionAsResponse(questionDoc) {
    return formatStructuredResponse({
      question: questionDoc.title || questionDoc.question,
      simpleExplanation: questionDoc.simpleExplanation || questionDoc.answer.slice(0, 200),
      technicalAnswer: questionDoc.technicalAnswer || questionDoc.answer,
      codeExample: questionDoc.codeExample || '',
      codeExplanation: questionDoc.codeExplanation || '',
      expectedOutput: questionDoc.expectedOutput || '',
      realWorldUseCases: questionDoc.realWorldUseCases || [],
      interviewPoints: questionDoc.interviewPoints || [],
      followUpQuestions: questionDoc.followUpQuestions || [],
    });
  }

  /**
   * Retrieves unique categories and technology list
   */
  async getCategories() {
    const technologies = await Question.distinct('technology');
    const categories = await Question.distinct('category');
    return { technologies, categories };
  }
}

module.exports = new QuestionService();
