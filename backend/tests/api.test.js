const { app, server } = require('../server');

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('\n==================================================');
  console.log('🧪 Starting LexaChatbot End-to-End API Test Suite');
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;
  let testUserToken = '';
  let testUserId = '';
  let conversationId = '';
  let lastMessageId = '';
  let interviewSessionId = '';

  const testEmail = `candidate_test_${Date.now()}@lexachatbot.dev`;
  const testPassword = 'SecurePassword2026!';

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'ok', 'Health Check Endpoint (GET /api/health)');

    // 2. Settings info
    const settingsRes = await fetch(`${BASE_URL}/settings`);
    const settingsData = await settingsRes.json();
    assert(settingsRes.status === 200 && settingsData.app.name === 'LexaChatbot', 'Settings & System Info Endpoint (GET /api/settings)');

    // 3. User Registration
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Senior Test Engineer',
        email: testEmail,
        password: testPassword,
        confirmPassword: testPassword,
      }),
    });
    const regData = await regRes.json();
    assert(regRes.status === 201 && regData.token && regData.user, 'User Registration (POST /api/auth/register)');
    testUserToken = regData.token;
    testUserId = regData.user.id;

    // 4. User Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && loginData.token, 'User Login (POST /api/auth/login)');

    // 5. Current User Profile (/api/auth/me)
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.user.email === testEmail, 'Protected Current User Profile (GET /api/auth/me)');

    // 6. Question Categories
    const catRes = await fetch(`${BASE_URL}/questions/categories`);
    const catData = await catRes.json();
    assert(catRes.status === 200 && Array.isArray(catData.technologies) && catData.technologies.length > 0, 'Fetch Question Categories (GET /api/questions/categories)');

    // 7. Search Questions
    const searchRes = await fetch(`${BASE_URL}/questions/search?q=closure`);
    const searchData = await searchRes.json();
    assert(searchRes.status === 200 && searchData.count > 0, 'Search Interview Questions (GET /api/questions/search?q=closure)');

    // 8. Chatbot Message (JavaScript Closures)
    const chatRes = await fetch(`${BASE_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`,
      },
      body: JSON.stringify({
        message: 'What is closure in JavaScript and how does it work?',
        category: 'JavaScript',
      }),
    });
    const chatData = await chatRes.json();
    assert(
      chatRes.status === 200 &&
      chatData.assistantMessage &&
      chatData.conversationId &&
      chatData.assistantMessage.content.includes('### 🎯 Question'),
      'Chatbot Structured Interview Answer (POST /api/chat/message)'
    );
    conversationId = chatData.conversationId;
    lastMessageId = chatData.assistantMessage._id || chatData.conversation.messages[chatData.conversation.messages.length - 1]._id;

    // 9. Fetch Conversations List
    const convsRes = await fetch(`${BASE_URL}/chat/conversations`, {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });
    const convsData = await convsRes.json();
    assert(convsRes.status === 200 && convsData.conversations.length > 0, 'List User Conversations (GET /api/chat/conversations)');

    // 10. Feedback on Assistant Message
    const feedbackRes = await fetch(`${BASE_URL}/chat/conversations/${conversationId}/messages/${lastMessageId}/feedback`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`,
      },
      body: JSON.stringify({ feedback: 'like' }),
    });
    const feedbackData = await feedbackRes.json();
    assert(feedbackRes.status === 200 && feedbackData.feedback === 'like', 'Submit Message Feedback (PATCH .../feedback)');

    // 11. Bookmark / Save Message
    const saveRes = await fetch(`${BASE_URL}/chat/conversations/${conversationId}/messages/${lastMessageId}/save`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${testUserToken}` },
    });
    const saveData = await saveRes.json();
    assert(saveRes.status === 200 && saveData.isSaved === true, 'Toggle Save Message (PATCH .../save)');

    // 12. Fetch Saved Messages
    const savedListRes = await fetch(`${BASE_URL}/chat/saved`, {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });
    const savedListData = await savedListRes.json();
    assert(savedListRes.status === 200 && savedListData.saved.length > 0, 'Get Saved Messages (GET /api/chat/saved)');

    // 13. Start Mock Interview
    const startInterviewRes = await fetch(`${BASE_URL}/interview/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`,
      },
      body: JSON.stringify({
        technology: 'JavaScript',
        difficulty: 'Beginner',
        totalQuestions: 2,
      }),
    });
    const startInterviewData = await startInterviewRes.json();
    assert(
      startInterviewRes.status === 201 &&
      startInterviewData.session &&
      startInterviewData.session.currentQuestion,
      'Start Mock Interview Session (POST /api/interview/start)'
    );
    interviewSessionId = startInterviewData.session._id;

    // 14. Submit Interview Answer
    const submitAnswerRes = await fetch(`${BASE_URL}/interview/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`,
      },
      body: JSON.stringify({
        sessionId: interviewSessionId,
        answer: 'A closure is a function bundled together with its lexical environment. It allows inner functions to access outer scope variables even after outer function execution terminates.',
      }),
    });
    const submitAnswerData = await submitAnswerRes.json();
    assert(
      submitAnswerRes.status === 200 &&
      submitAnswerData.evaluation &&
      typeof submitAnswerData.evaluation.score === 'number',
      'Submit & Evaluate Interview Answer (POST /api/interview/answer)'
    );

    // 15. Fetch Interview History
    const historyRes = await fetch(`${BASE_URL}/interview/history`, {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });
    const historyData = await historyRes.json();
    assert(historyRes.status === 200 && historyData.history.length > 0, 'Fetch Interview History (GET /api/interview/history)');

    console.log('\n==================================================');
    console.log(`🎉 TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
    console.log('==================================================\n');
  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    server.close();
    process.exit(failed > 0 ? 1 : 0);
  }
}

// Allow 1 second for DB connection to establish before executing tests
setTimeout(runTests, 1200);
