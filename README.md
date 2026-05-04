# LexaChatbot 🤖
> **"Your Smart Companion for Technical Interview Preparation"**  
> *Learn. Practice. Prepare. Succeed.*

LexaChatbot is a full-stack, production-quality MERN application powered by Google Gemini and a structured MongoDB Question Bank. Designed specifically for computer science students, MCA/BCA graduates, freshers, and experienced frontend/full-stack developers preparing for rigorous technical interviews.

---

## 🌟 Key Features

- **ChatGPT-Inspired Developer Interface**:
  - Clean desktop sidebar with collapsible views, conversation search, rename & delete controls.
  - Smooth mobile slide-out navigation drawer with responsive breakpoints (375px to 1440px+).
  - Dark and Light themes with instant toggle and persistent user preferences.
  - Auto-scrolling chat window with a floating scroll-to-bottom indicator.
  - Multiline auto-resizing composer with `Enter` to send, `Shift+Enter` for new line, and duplicate submission prevention.

- **9-Part Structured Interview Answers**:
  Every response from Lexa conforms to a comprehensive 9-point technical interview rubric:
  1. 🎯 **Question**
  2. 💡 **Simple Explanation** (Beginner-friendly intuition)
  3. 🎓 **Technical Interview Answer** (Mechanics, specifications, & runtime engine)
  4. 💻 **Practical Code Example** (Clean, executable JavaScript/React)
  5. 🔍 **Code Explanation** (Step-by-step breakdown)
  6. ⚡ **Expected Output** (Console / visual output)
  7. 🌐 **Real-World Use Cases** (Production scenarios)
  8. 📌 **Important Interview Points** (Gotchas, edge cases, time/space complexity)
  9. ❓ **Follow-up Questions** (Anticipate interviewer next steps)

- **Hybrid AI + Database Fallback Engine**:
  - **Live AI Mode**: Powered by Google Gemini (`@google/generative-ai`) via a secure backend service layer. Never exposes API keys to the client.
  - **Database Knowledge Base Mode**: Operates seamlessly even without an AI API key by searching the MongoDB question bank using regex, keyword tokens, and full-text indexes.
  - Clear visual badge on every response ("AI Generated" vs "Knowledge Base").

- **Interactive Mock Interview Mode**:
  - Choose technology (JavaScript, React.js, HTML5, CSS3, Node.js & Express, MongoDB, Full-Stack).
  - Select difficulty (Beginner, Intermediate, Advanced) and question count (5 to 20).
  - Interactive turn-by-turn question delivery and answer evaluation.
  - Scored out of 10 with constructive feedback, identified concepts mastered, and missing topics.
  - Performance Summary Report with score dial, strengths, improvement areas, and revision roadmap.

- **Complete JWT Authentication**:
  - Registration, Login, and Session checking (`/api/auth/me`).
  - Passwords hashed with `bcryptjs`.
  - HTTP-only cookie support and Bearer tokens for secure client-server communication.
  - Protected routes and strict user-data isolation.

- **Response Management**:
  - One-click copy for complete responses and individual code blocks.
  - Like / Dislike community feedback on answers.
  - Bookmark / Save questions for rapid pre-interview revision.
  - Regenerate last answer capability.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, React Router DOM v7, Axios, Lucide React, React Markdown, Remark GFM, React Syntax Highlighter |
| **Backend** | Node.js (v22+), Express.js (v4.21+), RESTful MVC Architecture, Cookie Parser |
| **Database** | MongoDB, Mongoose (v8.9+) with indexing and text search |
| **AI Integration** | Google Gemini (`@google/generative-ai`), Configurable AI Service Layer |
| **Security** | JSON Web Tokens (JWT), bcryptjs password hashing, express-rate-limit, CORS policy |

---

## 📁 Project Architecture & Folder Structure

```
d:\LexaChatBot\
├── backend/
│   ├── config/
│   │   └── db.js                       # MongoDB connection with resilient error handling
│   ├── controllers/
│   │   ├── authController.js           # Register, login, me, profile preferences
│   │   ├── chatController.js           # Messages, conversations, bookmarks, feedback
│   │   ├── questionController.js       # Search, filter, and list interview questions
│   │   └── interviewController.js      # Mock interview session lifecycle and scoring
│   ├── middleware/
│   │   ├── authMiddleware.js           # JWT verification and user extraction
│   │   ├── errorMiddleware.js          # Centralized error and 404 handler
│   │   └── rateLimitMiddleware.js      # Express rate limiters for chat & auth
│   ├── models/
│   │   ├── User.js                     # User account & preferences schema
│   │   ├── Conversation.js             # Chat messages & bookmarks schema
│   │   ├── Question.js                 # 9-point interview questions schema
│   │   └── InterviewSession.js         # Mock interview attempts and final reports
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── interviewRoutes.js
│   │   └── settingsRoutes.js
│   ├── services/
│   │   ├── aiService.js                # Google Gemini LLM provider integration
│   │   ├── chatbotService.js           # AI/Database decision & fallback engine
│   │   └── questionService.js          # MongoDB keyword & text matching
│   ├── tests/
│   │   └── api.test.js                 # 15-point End-to-End API verification test suite
│   ├── utils/
│   │   ├── responseFormatter.js        # 9-point structured response builder
│   │   ├── seedQuestions.js            # Initial curated interview database seeder
│   │   └── validators.js               # Registration, login, & input validation
│   ├── .env.example
│   ├── package.json
│   └── server.js                       # Express application entrypoint
├── frontend/
│   ├── public/
│   │   └── favicon.svg                 # Lexa brand logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   │   ├── ChatInput.jsx       # Multiline composer with auto-resize
│   │   │   │   ├── ChatMessage.jsx     # Markdown, syntax highlighter, copy, like/save
│   │   │   │   ├── ChatWindow.jsx      # Scroll management & empty/welcome states
│   │   │   │   ├── SuggestedPrompts.jsx
│   │   │   │   ├── TypingIndicator.jsx # Animated waiting indicator
│   │   │   │   └── WelcomeScreen.jsx   # Hero welcome with suggested questions
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx          # Reusable variant button component
│   │   │   │   ├── ErrorMessage.jsx    # Error alert banner with retry
│   │   │   │   ├── Loader.jsx          # Accessible spinner
│   │   │   │   └── Modal.jsx           # Accessible dialog backdrop with ESC listener
│   │   │   ├── interview/
│   │   │   │   ├── InterviewFeedback.jsx # Score pill, correct/missing points, ideal answer
│   │   │   │   ├── InterviewQuestion.jsx # Progress indicator & answer editor
│   │   │   │   ├── InterviewReport.jsx   # Final performance score & revision roadmap
│   │   │   │   └── InterviewSetup.jsx    # Tech, difficulty, and question count selector
│   │   │   └── layout/
│   │   │       ├── Header.jsx          # Mobile toggle, title, theme switch & user pill
│   │   │       ├── MobileSidebar.jsx   # Slide-out drawer for phones and tablets
│   │   │       └── Sidebar.jsx         # Collapsible desktop sidebar with search & rename
│   │   ├── context/
│   │   │   ├── AuthContext.jsx         # User authentication & preference state
│   │   │   └── ThemeContext.jsx        # Dark/Light theme provider with localStorage sync
│   │   ├── pages/
│   │   │   ├── History.jsx             # Saved bookmarked questions & past interviews
│   │   │   ├── Home.jsx                # Core chat assistant workspace
│   │   │   ├── InterviewPractice.jsx   # Mock interview engine
│   │   │   ├── Login.jsx               # Sign in with demo account auto-filler
│   │   │   ├── NotFound.jsx            # 404 page
│   │   │   ├── Register.jsx            # Account sign up
│   │   │   └── Settings.jsx            # Theme, difficulty, and AI engine status
│   │   ├── services/
│   │   │   ├── api.js                  # Axios instance with auth interceptor
│   │   │   ├── authService.js
│   │   │   ├── chatService.js
│   │   │   ├── interviewService.js
│   │   │   └── questionService.js
│   │   ├── App.jsx                     # Route declarations & ProtectedRoute guards
│   │   ├── index.css                   # Tailwind CSS v4 styling & dark mode vars
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js                  # Vite configuration with proxy to backend
├── .gitignore
├── package.json                        # Root workspace scripts
└── README.md
```

---

## ⚡ Quick Start Installation

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v22+ recommended).
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` or a MongoDB Atlas connection string.

### 2. Clone / Open Project
Navigate to the project root:
```bash
cd d:\LexaChatBot
```

### 3. Backend Setup
1. Enter the `backend` folder and install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment variables in `backend/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/lexachatbot
   JWT_SECRET=lexachatbot_super_secret_jwt_key_2026_dev_secure
   JWT_EXPIRES_IN=7d
   GEMINI_API_KEY=your_gemini_api_key_optional
   CLIENT_URL=http://localhost:5173
   ```
   *(Note: `GEMINI_API_KEY` is optional. If left blank, LexaChatbot automatically uses the local verified question bank!)*

3. Seed the initial question bank:
   ```bash
   node utils/seedQuestions.js
   ```

4. Run the API test suite to verify everything:
   ```bash
   node tests/api.test.js
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```
   Backend will be running at `http://localhost:5000`.

### 4. Frontend Setup
1. In a new terminal, enter the `frontend` directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Frontend will be running at `http://localhost:5173`.

---

## 🔑 AI Configuration (Optional Google Gemini Integration)

To enable live AI generation for unscripted questions and dynamic code evaluation:
1. Obtain a free API Key from [Google AI Studio](https://aistudio.google.com/).
2. Open `backend/.env` and paste your key:
   ```env
   GEMINI_API_KEY=AIzaSy...YourKeyHere
   ```
3. Restart the backend. Lexa will instantly switch to "Live AI Active" status, visible in the Settings page and on message badges.

---

## 📡 API Reference

### Authentication
- `POST /api/auth/register` - Create a new user account.
- `POST /api/auth/login` - Authenticate and receive JWT cookie/token.
- `POST /api/auth/logout` - Clear session.
- `GET /api/auth/me` - Get current user profile (Protected).
- `PATCH /api/auth/profile` - Update user preferences (Protected).

### Chat Assistant
- `POST /api/chat/message` - Send query, get 9-point structured interview response (Protected).
- `GET /api/chat/conversations` - List all user conversations (Protected).
- `GET /api/chat/conversations/:id` - Get full message history of a conversation (Protected).
- `PATCH /api/chat/conversations/:id` - Rename conversation title (Protected).
- `DELETE /api/chat/conversations/:id` - Delete conversation (Protected).
- `POST /api/chat/regenerate/:id` - Regenerate last assistant response (Protected).
- `PATCH /api/chat/conversations/:id/messages/:messageId/feedback` - Like/dislike response (Protected).
- `PATCH /api/chat/conversations/:id/messages/:messageId/save` - Bookmark/save question (Protected).
- `GET /api/chat/saved` - Get all saved questions for pre-interview revision (Protected).

### Mock Interview Practice
- `POST /api/interview/start` - Initialize mock interview session with tech, difficulty, & count (Protected).
- `POST /api/interview/answer` - Submit answer for evaluation, scoring (0-10), and feedback (Protected).
- `GET /api/interview/history` - List past mock sessions and scores (Protected).
- `GET /api/interview/:id` - Retrieve full evaluation report for a session (Protected).

### Questions & Knowledge Base
- `GET /api/questions` - List and filter questions by tech, category, difficulty.
- `GET /api/questions/search` - Search by keyword tokens.
- `GET /api/questions/categories` - Distinct categories and technologies.

---

## 🧪 Testing Verification
Run the automated end-to-end API test runner anytime:
```bash
npm run test:backend
```
Verifies 15 automated checks with zero external mock dependencies.

---

## 🚀 Production Build & Deployment

To build the client for production deployment:
```bash
cd frontend
npm run build
```
The optimized assets will be generated in `frontend/dist`. You can serve them using Nginx, Vercel, Netlify, or directly via Express static middleware.

---

## 📄 License
This project is licensed under the MIT License.
