const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || null;
    this.modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    this.genAI = null;

    if (this.apiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
      } catch (err) {
        console.warn('Failed to initialize GoogleGenerativeAI client:', err.message);
      }
    }
  }

  isConfigured() {
    return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  }

  /**
   * Generates a structured technical answer for interview preparation
   */
  async generateInterviewAnswer(questionText, contextMessages = [], category = 'General') {
    if (!this.isConfigured()) {
      throw new Error('AI_NOT_CONFIGURED');
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction: `You are LexaChatbot, an elite Senior Technical Interview Coach specializing in Frontend, Full-Stack, JavaScript, React.js, Node.js, Express.js, and MongoDB.
Your mission is to help students, freshers, and developers ace technical interviews.
Always provide thorough, beginner-friendly, and technically precise answers.

Whenever you answer a technical question, follow this EXACT structure using these Markdown headings:
### 🎯 Question
[The exact question or topic being addressed]

### 💡 Simple Explanation
[A simple, intuitive 1-2 sentence explanation suitable for a beginner]

### 🎓 Technical Interview Answer
[The precise, professional answer suitable for a senior interview board, covering mechanics, specifications, and architecture]

### 💻 Practical Code Example
\`\`\`javascript
// Clean, executable code demonstrating the concept
\`\`\`

### 🔍 Code Explanation
[Step-by-step breakdown of how the code works]

### ⚡ Expected Output
\`\`\`text
[The exact console or visual output]
\`\`\`

### 🌐 Real-World Use Cases
- [Use case 1]
- [Use case 2]
- [Use case 3]

### 📌 Important Interview Points
- [Key gotcha, complexity note, or common interview pitfall]
- [Edge case or performance consideration]
- [Best practice tip]

### ❓ Follow-up Questions
- [Follow-up question 1]
- [Follow-up question 2]
- [Follow-up question 3]

Never hallucinate API behavior or invent facts. If a question is ambiguous, explain clearly.`
      });

      // Prepare context history
      const formattedHistory = contextMessages
        .slice(-6)
        .map((m) => `${m.role === 'user' ? 'User' : 'LexaChatbot'}: ${m.content}`)
        .join('\n\n');

      const prompt = `${formattedHistory ? `Previous conversation history:\n${formattedHistory}\n\n` : ''}User Category/Focus: ${category}\nUser Question: ${questionText}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AIService error in generateInterviewAnswer:', error.message);
      throw error;
    }
  }

  /**
   * Evaluates a candidate's answer for mock interview practice
   */
  async evaluateInterviewAnswer({ questionText, idealAnswer, candidateAnswer, technology, difficulty }) {
    if (!this.isConfigured()) {
      throw new Error('AI_NOT_CONFIGURED');
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        generationConfig: { responseMimeType: 'application/json' }
      });

      const prompt = `You are an expert technical interviewer evaluating a candidate for a ${technology} (${difficulty} level) role.
Question: "${questionText}"
Reference Ideal Answer: "${idealAnswer}"
Candidate's Submitted Answer: "${candidateAnswer}"

Evaluate the candidate's answer fairly and constructively.
Return a valid JSON object matching this schema:
{
  "score": <number between 0 and 10, integer or 1 decimal point>,
  "feedback": "<detailed constructive feedback explaining the score and how to improve>",
  "correctConcepts": ["<key concept candidate explained well>", "<another positive concept>"],
  "missingConcepts": ["<important missing point 1>", "<important missing point 2>"],
  "strengths": "<what the candidate did well>",
  "areasForImprovement": "<actionable advice for the candidate>"
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error('AIService error in evaluateInterviewAnswer:', error.message);
      throw error;
    }
  }
}

module.exports = new AIService();
