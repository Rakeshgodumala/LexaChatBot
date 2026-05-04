const aiService = require('./aiService');
const questionService = require('./questionService');

class ChatbotService {
  /**
   * Process a user chat message:
   * 1. If AI is configured, try generating answer via AI.
   * 2. If AI is unavailable or fails, fallback to Database question bank.
   * 3. If neither matches, return a helpful guided technical response.
   */
  async processMessage({ message, conversationHistory = [], category = 'General' }) {
    let responseText = '';
    let responseSource = 'ai';
    let matchedQuestion = null;

    // Check if AI is configured
    if (aiService.isConfigured()) {
      try {
        responseText = await aiService.generateInterviewAnswer(message, conversationHistory, category);
        responseSource = 'ai';
        return {
          content: responseText,
          responseSource,
          matchedQuestionId: null,
        };
      } catch (err) {
        console.warn('AI Service invocation failed, falling back to database question bank:', err.message);
      }
    }

    // Database Fallback Engine
    matchedQuestion = await questionService.findBestMatch(message, category);

    if (matchedQuestion) {
      responseText = questionService.formatQuestionAsResponse(matchedQuestion);
      responseSource = 'database';
      return {
        content: responseText,
        responseSource,
        matchedQuestionId: matchedQuestion._id,
      };
    }

    // Secondary fallback: Guided technical response when no direct question matches
    responseSource = 'database';
    responseText = `### 🎯 Question\n${message}\n\n` +
      `### 💡 Simple Explanation\n` +
      `LexaChatbot's Database Knowledge Base is active! We couldn't find an exact pre-stored answer for "${message}" in the local question bank.\n\n` +
      `### 🎓 Technical Interview Recommendation\n` +
      `To get instant answers, try asking about fundamental frontend concepts such as:\n` +
      `- **JavaScript**: Closures, Hoisting, Promises, Event Loop, \`this\` keyword, Call/Apply/Bind, Prototypes.\n` +
      `- **React.js**: Virtual DOM, useState & useEffect, Props vs State, Custom Hooks, Redux Toolkit.\n` +
      `- **HTML5 & CSS3**: Flexbox, CSS Grid, Semantic elements, Box Model, Media Queries.\n` +
      `- **Node.js & MongoDB**: Middleware, Event Loop, JWT Authentication, Mongoose Aggregations.\n\n` +
      `*(Tip: You can also configure a free Gemini API Key in \`backend/.env\` to enable live AI generation for any custom coding challenge!)*\n\n` +
      `### ❓ Follow-up Questions\n` +
      `- Would you like to explore JavaScript closures?\n` +
      `- Would you like to test your skills in React Hooks?\n` +
      `- Should we start a Mock Interview Session in the Interview Practice section?`;

    return {
      content: responseText,
      responseSource,
      matchedQuestionId: null,
    };
  }

  /**
   * Evaluates an interview practice answer using AI if available, or smart rubric fallback
   */
  async evaluateAnswer({ questionText, idealAnswer, candidateAnswer, technology, difficulty }) {
    if (aiService.isConfigured()) {
      try {
        const aiEvaluation = await aiService.evaluateInterviewAnswer({
          questionText,
          idealAnswer,
          candidateAnswer,
          technology,
          difficulty,
        });
        return {
          ...aiEvaluation,
          evaluationSource: 'ai',
        };
      } catch (err) {
        console.warn('AI evaluation failed, using algorithmic rubric evaluation:', err.message);
      }
    }

    // Algorithmic Fallback Evaluation
    return this.algorithmicEvaluation({
      questionText,
      idealAnswer,
      candidateAnswer,
    });
  }

  /**
   * Rule-based rubric evaluation when AI is not configured
   */
  algorithmicEvaluation({ questionText, idealAnswer, candidateAnswer }) {
    const trimmed = candidateAnswer ? candidateAnswer.trim() : '';
    if (!trimmed || trimmed.length < 15) {
      return {
        score: 2,
        feedback: 'The answer was too brief. In a technical interview, elaborate with core concepts, mechanisms, and a short code example.',
        correctConcepts: ['Attempted response'],
        missingConcepts: ['Detailed technical explanation', 'Syntax/Code example', 'Edge cases'],
        strengths: 'Attempted to answer.',
        areasForImprovement: 'Provide in-depth conceptual definitions, syntax usage, and real-world implications.',
        evaluationSource: 'database',
      };
    }

    // Extract key tokens from ideal answer to check presence in candidate answer
    const keywords = idealAnswer
      .toLowerCase()
      .replace(/[^\w\s]/gi, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['this', 'that', 'with', 'from', 'have', 'were', 'which', 'when', 'function'].includes(w));

    const candidateLower = trimmed.toLowerCase();
    const matchedTokens = [];
    const missingTokens = [];

    const uniqueKeywords = [...new Set(keywords)].slice(0, 10);
    uniqueKeywords.forEach((kw) => {
      if (candidateLower.includes(kw)) {
        matchedTokens.push(kw);
      } else {
        missingTokens.push(kw);
      }
    });

    const matchRatio = uniqueKeywords.length > 0 ? matchedTokens.length / uniqueKeywords.length : 0.5;
    let score = Math.min(10, Math.max(3, Math.round((matchRatio * 7 + (trimmed.length > 100 ? 3 : 1)) * 10) / 10));

    return {
      score,
      feedback: score >= 7
        ? 'Great job! Your answer demonstrates a strong grasp of the fundamental technical concept.'
        : 'Good effort. Your answer touched on the basics, but interviewers look for clearer technical terminology, internal mechanics, and code examples.',
      correctConcepts: matchedTokens.length > 0 ? matchedTokens.slice(0, 4) : ['Core idea recognized'],
      missingConcepts: missingTokens.length > 0 ? missingTokens.slice(0, 4) : ['Additional edge case explanations'],
      strengths: 'Clear explanation and structured communication.',
      areasForImprovement: 'Include code demonstrations and mention memory or performance considerations.',
      evaluationSource: 'database',
    };
  }
}

module.exports = new ChatbotService();
