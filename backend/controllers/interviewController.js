const InterviewSession = require('../models/InterviewSession');
const Question = require('../models/Question');
const chatbotService = require('../services/chatbotService');

/**
 * @desc    Start a new interview session
 * @route   POST /api/interview/start
 * @access  Private
 */
const startInterview = async (req, res, next) => {
  try {
    const { technology = 'JavaScript', difficulty = 'Beginner', totalQuestions = 5 } = req.body;
    const count = Math.min(20, Math.max(1, Number(totalQuestions) || 5));

    // Map technology variations if needed
    const techRegex = new RegExp(technology.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    // Fetch questions matching technology and difficulty
    let candidateQuestions = await Question.find({
      technology: { $regex: techRegex },
      difficulty: difficulty,
    });

    // If not enough questions for exact difficulty, relax difficulty
    if (candidateQuestions.length < count) {
      const moreQuestions = await Question.find({
        technology: { $regex: techRegex },
      });
      candidateQuestions = moreQuestions;
    }

    // If still not enough, grab general questions
    if (candidateQuestions.length === 0) {
      candidateQuestions = await Question.find().limit(count);
    }

    // Shuffle and slice
    const shuffled = [...candidateQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    const interviewQuestions = selected.map((q) => ({
      questionId: q._id,
      questionText: q.question || q.title,
      idealAnswer: q.technicalAnswer || q.answer,
      userAnswer: '',
      score: null,
      feedback: '',
      correctConcepts: [],
      missingConcepts: [],
    }));

    const session = await InterviewSession.create({
      userId: req.user._id,
      technology,
      difficulty,
      totalQuestions: interviewQuestions.length,
      currentQuestionIndex: 0,
      status: 'in-progress',
      questions: interviewQuestions,
    });

    res.status(201).json({
      success: true,
      session: {
        _id: session._id,
        technology: session.technology,
        difficulty: session.difficulty,
        totalQuestions: session.totalQuestions,
        currentQuestionIndex: session.currentQuestionIndex,
        status: session.status,
        currentQuestion: {
          index: 0,
          questionText: session.questions[0].questionText,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit answer to the current question in session
 * @route   POST /api/interview/answer
 * @access  Private
 */
const submitAnswer = async (req, res, next) => {
  try {
    const { sessionId, answer } = req.body;

    const session = await InterviewSession.findOne({
      _id: sessionId,
      userId: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    if (session.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Interview session is already completed' });
    }

    const currentIndex = session.currentQuestionIndex;
    const currentItem = session.questions[currentIndex];

    if (!currentItem) {
      return res.status(400).json({ success: false, message: 'Invalid question index in session' });
    }

    // Evaluate answer
    const evaluation = await chatbotService.evaluateAnswer({
      questionText: currentItem.questionText,
      idealAnswer: currentItem.idealAnswer,
      candidateAnswer: answer || '',
      technology: session.technology,
      difficulty: session.difficulty,
    });

    // Update current question
    currentItem.userAnswer = answer || '';
    currentItem.score = evaluation.score;
    currentItem.feedback = evaluation.feedback;
    currentItem.correctConcepts = evaluation.correctConcepts || [];
    currentItem.missingConcepts = evaluation.missingConcepts || [];
    currentItem.evaluatedAt = new Date();

    const isLastQuestion = currentIndex + 1 >= session.totalQuestions;

    if (isLastQuestion) {
      // Complete session & compute report
      session.status = 'completed';
      session.currentQuestionIndex = currentIndex + 1;

      const scoredQuestions = session.questions.filter((q) => q.score !== null);
      const totalScore = scoredQuestions.reduce((acc, q) => acc + q.score, 0);
      const avgScore = scoredQuestions.length > 0 ? Math.round((totalScore / scoredQuestions.length) * 10) / 10 : 0;
      session.finalScore = avgScore;

      // Aggregate concepts & strengths
      const allCorrect = [];
      const allMissing = [];
      scoredQuestions.forEach((q) => {
        allCorrect.push(...q.correctConcepts);
        allMissing.push(...q.missingConcepts);
      });

      const uniqueCorrect = [...new Set(allCorrect)];
      const uniqueMissing = [...new Set(allMissing)];

      const strengths = avgScore >= 7
        ? ['Strong conceptual foundation', 'Accurate technical terminology', 'Good structural communication']
        : ['Clear effort to articulate concepts', 'Familiarity with basic syntax'];

      const areasForImprovement = uniqueMissing.length > 0
        ? uniqueMissing.slice(0, 4)
        : ['Elaborate with concrete code snippets', 'Cover edge cases and performance implications'];

      const suggestedRevisionTopics = [
        `${session.technology} Core Concepts and Mechanics`,
        `${session.technology} Best Practices & Design Patterns`,
        'Hands-on Practical Code Exercises',
      ];

      session.finalReport = {
        totalQuestions: session.totalQuestions,
        questionsAttempted: scoredQuestions.length,
        averageScore: avgScore,
        correctConcepts: uniqueCorrect.slice(0, 6),
        missingConcepts: uniqueMissing.slice(0, 6),
        strengths,
        areasForImprovement,
        suggestedRevisionTopics,
        summary: avgScore >= 8
          ? 'Outstanding performance! You are well prepared for technical interviews in this domain.'
          : avgScore >= 6
          ? 'Solid performance! With targeted revision on missing concepts and code walkthroughs, you will excel.'
          : 'Good practice session! Review the recommended topics and ideal answers to boost your interview readiness.',
      };
    } else {
      session.currentQuestionIndex = currentIndex + 1;
    }

    await session.save();

    res.status(200).json({
      success: true,
      evaluation: {
        score: evaluation.score,
        feedback: evaluation.feedback,
        correctConcepts: evaluation.correctConcepts,
        missingConcepts: evaluation.missingConcepts,
        idealAnswer: currentItem.idealAnswer,
        evaluationSource: evaluation.evaluationSource,
      },
      isCompleted: isLastQuestion,
      nextQuestion: !isLastQuestion ? {
        index: session.currentQuestionIndex,
        questionText: session.questions[session.currentQuestionIndex].questionText,
      } : null,
      session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's past interview sessions
 * @route   GET /api/interview/history
 * @access  Private
 */
const getInterviewHistory = async (req, res, next) => {
  try {
    const history = await InterviewSession.find({ userId: req.user._id })
      .select('technology difficulty totalQuestions currentQuestionIndex status finalScore createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get specific interview session details and report
 * @route   GET /api/interview/:id
 * @access  Private
 */
const getInterviewById = async (req, res, next) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  getInterviewHistory,
  getInterviewById,
};
