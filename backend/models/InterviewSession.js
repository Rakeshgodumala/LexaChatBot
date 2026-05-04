const mongoose = require('mongoose');

const interviewItemSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    default: null,
  },
  questionText: {
    type: String,
    required: true,
  },
  idealAnswer: {
    type: String,
    required: true,
  },
  userAnswer: {
    type: String,
    default: '',
  },
  score: {
    type: Number,
    min: 0,
    max: 10,
    default: null,
  },
  feedback: {
    type: String,
    default: '',
  },
  correctConcepts: [{
    type: String,
  }],
  missingConcepts: [{
    type: String,
  }],
  evaluatedAt: {
    type: Date,
    default: null,
  },
});

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    technology: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'abandoned'],
      default: 'in-progress',
    },
    questions: [interviewItemSchema],
    finalScore: {
      type: Number,
      default: 0,
    },
    finalReport: {
      totalQuestions: { type: Number, default: 0 },
      questionsAttempted: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      correctConcepts: [{ type: String }],
      missingConcepts: [{ type: String }],
      strengths: [{ type: String }],
      areasForImprovement: [{ type: String }],
      suggestedRevisionTopics: [{ type: String }],
      summary: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

interviewSessionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
