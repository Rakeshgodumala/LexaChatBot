const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    technology: {
      type: String,
      required: true,
      index: true,
      enum: [
        'HTML5',
        'CSS3',
        'JavaScript',
        'React.js',
        'Bootstrap and Tailwind CSS',
        'Node.js and Express.js',
        'MongoDB',
        'Full-Stack Development',
      ],
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
      index: true,
    },
    keywords: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    simpleExplanation: {
      type: String,
      default: '',
    },
    technicalAnswer: {
      type: String,
      default: '',
    },
    codeExample: {
      type: String,
      default: '',
    },
    codeExplanation: {
      type: String,
      default: '',
    },
    expectedOutput: {
      type: String,
      default: '',
    },
    realWorldUseCases: [{
      type: String,
    }],
    interviewPoints: [{
      type: String,
    }],
    followUpQuestions: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

questionSchema.index({ keywords: 1 });
questionSchema.index({ title: 'text', question: 'text', answer: 'text' });

module.exports = mongoose.model('Question', questionSchema);
