const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  responseSource: {
    type: String,
    enum: ['ai', 'database', 'system'],
    default: 'ai',
  },
  structuredData: {
    simpleExplanation: { type: String, default: '' },
    technicalAnswer: { type: String, default: '' },
    codeExample: { type: String, default: '' },
    codeExplanation: { type: String, default: '' },
    expectedOutput: { type: String, default: '' },
    realWorldUseCases: [{ type: String }],
    interviewPoints: [{ type: String }],
    followUpQuestions: [{ type: String }],
  },
  feedback: {
    type: String,
    enum: ['like', 'dislike', null],
    default: null,
  },
  isSaved: {
    type: Boolean,
    default: false,
  },
});

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'New Conversation',
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    category: {
      type: String,
      default: 'General',
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ userId: 1, updatedAt: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);
