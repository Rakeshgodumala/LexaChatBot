const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { optionalAuth, protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

router.get('/', optionalAuth, async (req, res) => {
  res.status(200).json({
    success: true,
    app: {
      name: 'LexaChatbot',
      tagline: 'Your Smart Companion for Technical Interview Preparation',
      shortDescription: 'Learn. Practice. Prepare. Succeed.',
      version: '1.0.0',
    },
    ai: {
      provider: 'Google Gemini',
      configured: aiService.isConfigured(),
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    },
    userPreferences: req.user ? req.user.preferences : null,
  });
});

router.patch('/', protect, async (req, res, next) => {
  try {
    const { theme, preferredTech, difficultyPreference } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (theme) user.preferences.theme = theme;
    if (preferredTech) user.preferences.preferredTech = preferredTech;
    if (difficultyPreference) user.preferences.difficultyPreference = difficultyPreference;

    await user.save();

    res.status(200).json({
      success: true,
      preferences: user.preferences,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
