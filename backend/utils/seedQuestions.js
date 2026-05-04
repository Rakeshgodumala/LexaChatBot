const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('../models/Question');
const connectDB = require('../config/db');

dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

const sampleQuestions = [
  // 1. JAVASCRIPT - Closures
  {
    title: 'Explain JavaScript closures with examples',
    question: 'What is a closure in JavaScript and how does it work under the hood?',
    technology: 'JavaScript',
    category: 'Functions & Scope',
    difficulty: 'Intermediate',
    keywords: ['closure', 'scope', 'lexical scope', 'outer function', 'memory', 'counter'],
    simpleExplanation: 'A closure is a function that remembers and can access variables from its outer (enclosing) scope, even after that outer function has finished executing.',
    technicalAnswer: 'In JavaScript, functions form closures around their lexical environments. When an inner function references an outer function’s variable, the JavaScript engine preserves that variable’s binding in heap memory rather than garbage collecting it when the outer execution context pops off the call stack.',
    codeExample: `function createCounter(initialValue = 0) {
  let count = initialValue;

  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getValue: function() {
      return count;
    }
  };
}

const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.getValue());   // 12`,
    codeExplanation: 'createCounter returns an object containing methods that close over the private variable `count`. Even after createCounter finishes, `count` remains encapsulated and accessible exclusively through those inner methods.',
    expectedOutput: `11\n12\n12`,
    realWorldUseCases: [
      'Encapsulating private variables and data hiding (Module Pattern).',
      'Function currying and partial application.',
      'Event handlers that need access to specific loop variables or component state.',
      'Maintaining state in asynchronous callbacks and timers.'
    ],
    interviewPoints: [
      'Be ready to explain how closures interact with the Garbage Collector (GC).',
      'Mention lexical scoping: scope is determined by where variables and functions are declared in code, not where they are called.',
      'A classic interview trap is closures inside `for (var i = 0; ...)` loops vs `for (let i = 0; ...)`. `var` shares a single function scope, while `let` binds per iteration.'
    ],
    followUpQuestions: [
      'What is lexical scope and how is it different from dynamic scope?',
      'How does the event loop interact with closed-over variables in setTimeout?',
      'Can closures cause memory leaks in JavaScript if not handled properly?'
    ],
    answer: 'A closure is created when an inner function retains access to the lexical environment of its parent function.'
  },

  // 2. JAVASCRIPT - var vs let vs const
  {
    title: 'Difference between var, let and const',
    question: 'What are the key differences between var, let, and const in JavaScript?',
    technology: 'JavaScript',
    category: 'Variables & Scope',
    difficulty: 'Beginner',
    keywords: ['var', 'let', 'const', 'hoisting', 'temporal dead zone', 'scope'],
    simpleExplanation: '`var` is function-scoped and outdated. `let` is block-scoped and allows reassignment. `const` is block-scoped and prevents reassignment.',
    technicalAnswer: '`var` attaches to the global/function scope and is hoisted with `undefined`. `let` and `const` are block-scoped and hoisted to the Temporal Dead Zone (TDZ), throwing a ReferenceError if accessed before declaration. `const` creates an immutable variable binding (though properties of objects assigned to const can still be mutated).',
    codeExample: `// 1. var allows redeclaration & is function-scoped
var x = 1;
var x = 2; // Valid

// 2. let is block-scoped
if (true) {
  let blockScoped = "Inside block";
  const constantObj = { role: "Developer" };
  constantObj.role = "Lead"; // Allowed: mutating property
  // constantObj = {};      // TypeError: Assignment to constant variable
}

// console.log(blockScoped); // ReferenceError: blockScoped is not defined`,
    codeExplanation: '`let` and `const` restrict their lifecycle to the curly braces `{}` they are defined in, preventing unintentional variable leaking and overwriting.',
    expectedOutput: `ReferenceError if accessing block-scoped variables outside their block`,
    realWorldUseCases: [
      'Default to `const` for immutable references to avoid accidental bugs.',
      'Use `let` for loop accumulators or changing state flags.',
      'Avoid `var` in modern ES6+ codebases.'
    ],
    interviewPoints: [
      'Explain the Temporal Dead Zone (TDZ): the period between entering scope and the declaration being evaluated.',
      'Mention that `var` creates properties on the global `window` object in browsers, while `let` and `const` do not.',
      'Emphasize that `const` guarantees reference immutability, not value immutability (use Object.freeze() for deep value freeze).'
    ],
    followUpQuestions: [
      'What is the Temporal Dead Zone (TDZ)?',
      'How does hoisting differ between var, let, and const?',
      'How can you make a const object truly immutable in JavaScript?'
    ],
    answer: 'var is function-scoped and hoisted with undefined, while let and const are block-scoped and subject to TDZ.'
  },

  // 3. JAVASCRIPT - Promises & Async/Await
  {
    title: 'Explain promises and async/await',
    question: 'How do Promises and async/await work in JavaScript, and how do they resolve callback hell?',
    technology: 'JavaScript',
    category: 'Asynchronous Programming',
    difficulty: 'Intermediate',
    keywords: ['promises', 'async', 'await', 'asynchronous', 'microtask', 'callback hell'],
    simpleExplanation: 'A Promise represents a value that may be available now, in the future, or never. `async/await` is syntactic sugar over Promises that lets you write asynchronous code that looks and behaves like synchronous code.',
    technicalAnswer: 'A Promise exists in one of three states: pending, fulfilled, or rejected. Promises queue callbacks in the microtask queue, which has higher priority than the macrotask queue. `async/await` pauses execution of the enclosing async function until the awaited Promise settles, handling errors cleanly using standard `try/catch` blocks.',
    codeExample: `// Promise with Async/Await & Try-Catch
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const user = await response.json();
    return user.name;
  } catch (error) {
    console.error("Failed to fetch user:", error.message);
    throw error;
  }
}

fetchUserData(1).then(name => console.log("Fetched User:", name));`,
    codeExplanation: 'The `await` keyword pauses execution within `fetchUserData` without blocking the main browser thread, and resumes once the promise settles.',
    expectedOutput: `Fetched User: Leanne Graham`,
    realWorldUseCases: [
      'Fetching data from REST or GraphQL APIs.',
      'Handling database queries in Node.js/Express.',
      'Parallel operations using `Promise.all()` or `Promise.allSettled()`.'
    ],
    interviewPoints: [
      'Know the difference between `Promise.all()` (fails fast on first rejection) and `Promise.allSettled()` (waits for all).',
      'Explain how `Promise.race()` and `Promise.any()` behave.',
      'Always use `try...catch` with `async/await` to avoid unhandled promise rejections.'
    ],
    followUpQuestions: [
      'What is the difference between Promise.all and Promise.allSettled?',
      'How does the JavaScript Event Loop process Microtasks vs Macrotasks?',
      'Can an async function return a non-promise value?'
    ],
    answer: 'A Promise represents an asynchronous operation state; async/await allows reading promises sequentially with try/catch.'
  },

  // 4. REACT.JS - Virtual DOM
  {
    title: 'What is the Virtual DOM in React?',
    question: 'What is the Virtual DOM, how does React reconciliation work, and why is it fast?',
    technology: 'React.js',
    category: 'Core Concepts',
    difficulty: 'Intermediate',
    keywords: ['virtual dom', 'reconciliation', 'diffing algorithm', 'fiber', 'real dom'],
    simpleExplanation: 'The Virtual DOM (VDOM) is a lightweight JavaScript representation of the real DOM kept in memory. React compares this copy with a new version when state changes and updates only what actually changed in the real DOM.',
    technicalAnswer: 'Manipulating the real browser DOM is slow because it triggers layout recalculation (reflow) and repaint. React keeps a Virtual DOM tree. When state changes, React creates a new VDOM tree, runs a diffing heuristic algorithm (O(n) complexity based on component types and keys), and calculates the minimal batch of DOM operations to apply via the Fiber reconciler.',
    codeExample: `import React, { useState } from 'react';

export default function UserList() {
  const [users, setUsers] = useState(['Alex', 'Bob', 'Charlie']);

  const addUser = () => {
    // React creates a new Virtual DOM tree and diffs it
    setUsers([...users, \`Dev_\${users.length + 1}\`]);
  };

  return (
    <div>
      <button onClick={addUser}>Add User</button>
      <ul>
        {users.map((user, index) => (
          // Keys assist React's reconciliation diffing algorithm
          <li key={user}>{user}</li>
        ))}
      </ul>
    </div>
  );
}`,
    codeExplanation: 'When `addUser` triggers `setUsers`, React re-renders the component in virtual memory, computes the diff, and appends only the single new `<li>` element to the real DOM rather than re-rendering the whole `<ul>`.',
    expectedOutput: `List rendered with only the updated DOM nodes modified`,
    realWorldUseCases: [
      'High-frequency UI updates like live dashboards and form inputs.',
      'Single Page Applications (SPAs) managing dynamic lists.',
      'Complex interfaces where multiple independent components update concurrently.'
    ],
    interviewPoints: [
      'React uses keys in lists so its reconciliation algorithm can track which items were added, removed, or moved.',
      'React 16+ uses the Fiber architecture which allows incremental rendering and pausing work to prioritize high-priority user interactions.',
      'The VDOM is not always faster than raw handwritten DOM operations, but it provides declarative UI programming with consistently high performance.'
    ],
    followUpQuestions: [
      'Why are index keys not recommended in dynamic React lists?',
      'What is React Fiber and how does it improve reconciliation?',
      'What is the difference between Reflow and Repaint in the browser?'
    ],
    answer: 'The Virtual DOM is an in-memory representation of UI elements used to compute diffs and batch minimal updates to the real DOM.'
  },

  // 5. REACT.JS - useState and useEffect
  {
    title: 'Explain useState and useEffect',
    question: 'How do useState and useEffect work, and what are their lifecycle equivalents?',
    technology: 'React.js',
    category: 'Hooks',
    difficulty: 'Beginner',
    keywords: ['usestate', 'useeffect', 'hooks', 'lifecycle', 'dependency array', 'cleanup'],
    simpleExplanation: '`useState` gives functional components local state that triggers re-renders when updated. `useEffect` lets components perform side effects like fetching data, subscriptions, or manual DOM updates.',
    technicalAnswer: '`useState` returns a stateful value and an updater function. It uses React’s internal dispatcher linked to the component’s fiber node. `useEffect` accepts an effect callback and a dependency array. Without dependencies, it runs after every render; with an empty array `[]`, it runs once on mount; with dependencies `[dep]`, it runs when dependencies change. Its returned function acts as a cleanup before re-running or on unmount.',
    codeExample: `import React, { useState, useEffect } from 'react';

export default function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Side effect: interval timer setup
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Cleanup function: runs on unmount or before effect re-runs
    return () => clearInterval(interval);
  }, []); // Empty dependency array: runs on mount

  return <div>Elapsed time: {seconds} seconds</div>;
}`,
    codeExplanation: 'The `useEffect` hook schedules a background interval on component mount and cleans it up via `clearInterval` when the component unmounts, preventing memory leaks.',
    expectedOutput: `Elapsed time: 1 seconds ... 2 seconds ... 3 seconds`,
    realWorldUseCases: [
      'Fetching data from an API when a component loads.',
      'Setting up event listeners (e.g. window resize, scroll) and removing them on unmount.',
      'Syncing state changes to local storage or analytics.'
    ],
    interviewPoints: [
      'Always use functional state updates `setCount(prev => prev + 1)` when the next state depends on the previous state.',
      'Never omit variables from the dependency array if they are used inside the effect callback (stale closures problem).',
      'The cleanup function is critical for preventing memory leaks in subscriptions or timers.'
    ],
    followUpQuestions: [
      'What causes a stale closure inside useEffect?',
      'What is the difference between useEffect and useLayoutEffect?',
      'How does React batch state updates in React 18+?'
    ],
    answer: 'useState manages component-level state and triggers re-renders; useEffect executes side effects with optional dependency arrays and cleanup functions.'
  },

  // 6. REACT.JS - Props and State
  {
    title: 'What are React props and state?',
    question: 'What is the difference between props and state in React?',
    technology: 'React.js',
    category: 'Core Concepts',
    difficulty: 'Beginner',
    keywords: ['props', 'state', 'unidirectional data flow', 'read-only', 'lifting state up'],
    simpleExplanation: 'Props (properties) are passed down from a parent component and are read-only. State is managed internally within a component and can change over time.',
    technicalAnswer: 'Props represent external inputs to a component following React’s unidirectional data flow. Components are pure with respect to their props. State represents internal, private mutable storage managed by the component. When state updates via its setter function, React re-renders that component and its descendants.',
    codeExample: `// Parent component manages state and passes down props
function Parent() {
  const [theme, setTheme] = useState('dark');

  return (
    <div>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        Toggle Theme
      </button>
      {/* Passing theme as a prop */}
      <Child theme={theme} />
    </div>
  );
}

// Child component receives props (read-only)
function Child({ theme }) {
  return <div className={\`box \${theme}\`}>Current theme: {theme}</div>;
}`,
    codeExplanation: 'The Parent owns and modifies `theme` using state, while the Child receives `theme` as a prop and cannot mutate it directly.',
    expectedOutput: `Current theme: dark (switches to light on button click)`,
    realWorldUseCases: [
      'Props: Reusable design system components like Buttons, Cards, Inputs.',
      'State: Form inputs, modal open/close flags, accordion toggles.',
      'Lifting state up: Sharing state between sibling components through their nearest common parent.'
    ],
    interviewPoints: [
      'Props are immutable; modifying `props.myProp = 12` will throw an error or cause unexpected bugs.',
      'State updates are asynchronous and batched in React 18+ automatic batching.',
      'Props drilling can be resolved using React Context API or state management libraries (Redux Toolkit, Zustand).'
    ],
    followUpQuestions: [
      'What is prop drilling and how do you prevent it?',
      'What does "lifting state up" mean in React?',
      'Can child components modify props passed by their parent?'
    ],
    answer: 'Props are immutable inputs passed from parent to child; state is mutable data managed locally within a component.'
  },

  // 7. JAVASCRIPT - Event Loop & Asynchronous JS
  {
    title: 'Explain the JavaScript Event Loop',
    question: 'How does the JavaScript runtime execute single-threaded asynchronous code using the Event Loop?',
    technology: 'JavaScript',
    category: 'Runtime & Architecture',
    difficulty: 'Advanced',
    keywords: ['event loop', 'call stack', 'microtask', 'macrotask', 'web apis', 'task queue'],
    simpleExplanation: 'JavaScript is single-threaded, meaning it can only do one thing at a time. The event loop continuously checks if the Call Stack is empty, and if so, pushes tasks from the Microtask and Macrotask queues to the stack.',
    technicalAnswer: 'The JS runtime has a Call Stack, Web APIs (in browsers) / C++ APIs (in Node), a Microtask Queue (Promises, queueMicrotask, MutationObserver), and a Macrotask Queue (setTimeout, setInterval, I/O). The Event Loop constantly checks if the Call Stack is clear. When empty, it drains ALL pending microtasks first, renders if needed, and then dequeues one macrotask before checking microtasks again.',
    codeExample: `console.log('1: Start');

setTimeout(() => {
  console.log('2: Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Microtask (Promise)');
});

console.log('4: End');`,
    codeExplanation: 'Synchronous logs 1 and 4 run immediately on the Call Stack. The Promise callback is placed in the Microtask queue, while setTimeout is placed in the Macrotask queue. Once the stack is clear, Microtasks run first (3), followed by Macrotasks (2).',
    expectedOutput: `1: Start\n4: End\n3: Microtask (Promise)\n2: Macrotask (setTimeout)`,
    realWorldUseCases: [
      'Non-blocking I/O operations in high-throughput Node.js servers.',
      'Keeping web applications responsive during intensive calculations.',
      'Predicting exact execution order for async UI updates.'
    ],
    interviewPoints: [
      'Microtask queue has absolute priority over the Macrotask queue.',
      'An infinite microtask loop (e.g. recursively scheduling promises) will starve the event loop and freeze the browser/server.',
      'Node.js includes `process.nextTick()`, which has higher priority than standard microtasks.'
    ],
    followUpQuestions: [
      'What happens if a microtask keeps queuing another microtask?',
      'How does Node.js event loop phases (timers, poll, check) differ from browser event loop?',
      'What is the difference between setTimeout(fn, 0) and setImmediate in Node.js?'
    ],
    answer: 'The Event Loop coordinates the Call Stack, Web APIs, Microtask Queue, and Task Queue to achieve non-blocking asynchronous execution in a single thread.'
  },

  // 8. NODE.JS & EXPRESS - Middleware
  {
    title: 'What is Middleware in Express.js?',
    question: 'What is middleware in Express.js and how does the request-response cycle work?',
    technology: 'Node.js and Express.js',
    category: 'Architecture',
    difficulty: 'Intermediate',
    keywords: ['middleware', 'express', 'next()', 'req', 'res', 'pipeline'],
    simpleExplanation: 'Middleware functions are functions that have access to the request (`req`), response (`res`), and the `next` function in the application’s request-response cycle. They can modify request data, end the request, or call `next()` to pass control.',
    technicalAnswer: 'Express operates as a routing and middleware web framework. Middleware functions run in the order they are defined via `app.use()` or within route handlers. They can execute any code, modify `req` and `res` objects, end the cycle via `res.json()`, or call `next()` to invoke the next middleware. An error-handling middleware has four arguments: `(err, req, res, next)`.',
    codeExample: `const express = require('express');
const app = express();

// Custom Logger Middleware
const requestLogger = (req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(\`[\${req.method}] \${req.url} at \${req.requestTime}\`);
  next(); // Pass control to next middleware
};

app.use(requestLogger);

app.get('/api/users', (req, res) => {
  res.json({ message: 'Users list', time: req.requestTime });
});`,
    codeExplanation: '`requestLogger` intercepts incoming HTTP requests, records the current timestamp on `req.requestTime`, and invokes `next()` so the matching `/api/users` route can handle the response.',
    expectedOutput: `[GET] /api/users at 2026-11-04T12:00:00.000Z`,
    realWorldUseCases: [
      'Authentication and authorization checks (e.g., verifying JWT tokens).',
      'Request body parsing (`express.json()`).',
      'Logging, rate limiting, and CORS handling.',
      'Centralized error handling middleware.'
    ],
    interviewPoints: [
      'If a middleware neither calls `next()` nor sends a response (e.g. `res.send()`), the request will hang indefinitely.',
      'Error handling middleware MUST declare exactly 4 arguments `(err, req, res, next)` so Express recognizes its signature.',
      'Order of `app.use()` matters: authentication middleware must precede protected route handlers.'
    ],
    followUpQuestions: [
      'What happens if you do not call next() in an Express middleware?',
      'How does Express distinguish regular middleware from error-handling middleware?',
      'What is the difference between application-level and router-level middleware?'
    ],
    answer: 'Middleware functions sit in the Express request-response pipeline to inspect, modify, or terminate requests before passing control via next().'
  },

  // 9. MONGODB - SQL vs NoSQL & Mongoose
  {
    title: 'SQL vs NoSQL and MongoDB Mongoose',
    question: 'What are the core differences between SQL and NoSQL databases, and what role does Mongoose play in a Node.js stack?',
    technology: 'MongoDB',
    category: 'Database Architecture',
    difficulty: 'Intermediate',
    keywords: ['mongodb', 'nosql', 'sql', 'mongoose', 'schema', 'documents', 'acid'],
    simpleExplanation: 'SQL databases are relational with strict tabular schemas and ACID transactions. NoSQL databases like MongoDB are document-oriented, storing flexible JSON-like documents. Mongoose is an ODM (Object Data Modeling) library that provides schema validation and business logic for MongoDB in Node.js.',
    technicalAnswer: 'SQL (PostgreSQL, MySQL) uses fixed schemas, normalized tables, and joins, scaling vertically. MongoDB (NoSQL) stores BSON (Binary JSON) documents in collections, designed for horizontal scalability (sharding) and unstructured/semi-structured data. Mongoose abstracts native MongoDB driver operations, enforcing type checking, validation rules, middleware hooks (pre/post save), and model relationships.',
    codeExample: `const mongoose = require('mongoose');

// Mongoose Schema definition with validation & defaults
const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  skills: [{ type: String }],
  experienceYears: { type: Number, min: 0, default: 0 },
}, { timestamps: true });

// Pre-save hook / middleware
CandidateSchema.pre('save', function(next) {
  this.email = this.email.toLowerCase();
  next();
});

const Candidate = mongoose.model('Candidate', CandidateSchema);`,
    codeExplanation: 'Mongoose provides structured schema validation on top of MongoDB’s naturally schemaless database, ensuring data consistency before saving.',
    expectedOutput: `Valid candidate document persisted with timestamps and formatted email`,
    realWorldUseCases: [
      'Rapidly evolving web apps where data schema changes frequently.',
      'Hierarchical or nested data models like user profiles with embedded settings.',
      'High-velocity write operations and large-scale document storage.'
    ],
    interviewPoints: [
      'MongoDB does support multi-document ACID transactions since version 4.0.',
      'Explain when to embed documents vs when to reference (normalize) documents via ObjectId references.',
      'Creating proper indexes (single field, compound, text) is vital for query performance in large MongoDB collections.'
    ],
    followUpQuestions: [
      'When should you embed documents versus referencing them in MongoDB?',
      'How does MongoDB indexing affect read and write performance?',
      'What is the aggregation framework in MongoDB?'
    ],
    answer: 'SQL uses structured relational tables with strict schemas; MongoDB stores flexible BSON documents, and Mongoose provides ODM validation and schema modeling.'
  },

  // 10. CSS3 - Flexbox vs Grid
  {
    title: 'Flexbox vs CSS Grid in CSS3',
    question: 'What is the difference between Flexbox and CSS Grid, and when should you use each?',
    technology: 'CSS3',
    category: 'Layouts',
    difficulty: 'Beginner',
    keywords: ['flexbox', 'css grid', '1d vs 2d', 'responsive', 'align-items', 'justify-content'],
    simpleExplanation: 'Flexbox is one-dimensional (handles either rows OR columns). CSS Grid is two-dimensional (handles rows AND columns simultaneously).',
    technicalAnswer: 'CSS Flexbox is content-out and 1D, meaning it arranges elements along a primary axis (main-axis) and secondary axis (cross-axis), ideal for linear navigation bars, toolbars, and vertical centering. CSS Grid is layout-in and 2D, allowing you to define grid tracks, template areas, and line-based positioning simultaneously across both dimensions, ideal for full-page layouts and card grids.',
    codeExample: `/* 1D Navigation with Flexbox */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

/* 2D Responsive Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}`,
    codeExplanation: 'The `.navbar` uses flexbox to distribute items horizontally and align them vertically. The `.dashboard-grid` creates a responsive multi-column layout that automatically adapts to viewport width without media queries.',
    expectedOutput: `Responsive cards automatically wrap into columns as viewport changes`,
    realWorldUseCases: [
      'Flexbox: Centering a modal dialog, button groups, breadcrumbs.',
      'Grid: Complex web app layouts (sidebar, header, main content, footer).',
      'Combining both: Grid for page skeleton, Flexbox inside individual grid items.'
    ],
    interviewPoints: [
      'Remember: Flexbox = 1D (row OR column), Grid = 2D (rows AND columns).',
      'Explain the difference between `justify-content` (main axis) and `align-items` (cross axis) in Flexbox.',
      'Know the modern `gap` property works in both Flexbox and Grid in all modern browsers.'
    ],
    followUpQuestions: [
      'How does `auto-fit` differ from `auto-fill` in CSS Grid?',
      'What is the Box Model in CSS and what does `box-sizing: border-box` do?',
      'How does CSS specificity calculate which selector overrides another?'
    ],
    answer: 'Flexbox is a 1-dimensional layout model for rows or columns, while CSS Grid is a 2-dimensional layout model for simultaneous rows and columns.'
  },

  // 11. HTML5 - Semantic Elements & Accessibility
  {
    title: 'Semantic HTML5 and Accessibility (a11y)',
    question: 'Why are semantic HTML5 elements important for accessibility (a11y) and SEO?',
    technology: 'HTML5',
    category: 'Semantics & a11y',
    difficulty: 'Beginner',
    keywords: ['semantic html', 'accessibility', 'a11y', 'seo', 'screen readers', 'header', 'nav', 'main'],
    simpleExplanation: 'Semantic HTML uses tags that clearly describe their meaning to both browser and developer (like `<header>`, `<nav>`, `<article>`, `<button>`), rather than generic `<div>` tags.',
    technicalAnswer: 'Semantic HTML tags communicate roles, states, and document structure to assistive technologies (screen readers) via the browser’s Accessibility Tree. They improve SEO because web crawlers index content with accurate hierarchy. Using native elements like `<button>` provides built-in keyboard navigation (Tab focus) and Enter/Space key triggers without requiring custom ARIA attributes.',
    codeExample: `<!-- Good: Semantic & Accessible -->
<header>
  <nav aria-label="Main Navigation">
    <ul>
      <li><a href="/home">Home</a></li>
      <li><a href="/prep">Interview Prep</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Technical Interview Prep</h1>
    <p>Master frontend concepts with LexaChatbot.</p>
  </article>
</main>

<!-- Bad: Non-semantic div soup -->
<div class="header">
  <div class="nav" onclick="navigate()">Home</div> <!-- Not accessible via Tab! -->
</div>`,
    codeExplanation: 'The semantic markup allows screen reader users to jump directly between landmarks (`<nav>`, `<main>`, `<article>`) and ensures keyboard accessibility.',
    expectedOutput: `Accessible, keyboard-navigable page structure`,
    realWorldUseCases: [
      'Accessible web applications complying with WCAG 2.1 AA standards.',
      'SEO-optimized blog articles and landing pages.',
      'Mobile web apps requiring keyboard and screen reader accessibility.'
    ],
    interviewPoints: [
      'Rule of thumb: "First rule of ARIA: Do not use ARIA if a native HTML element can do the job."',
      'Never replace `<button>` with `<div onclick="...">` unless you manually implement focus, role, and keyboard listeners.',
      'Always include descriptive `alt` tags on `<img>` elements and `for` / `id` associations on form labels.'
    ],
    followUpQuestions: [
      'What is the difference between `<section>` and `<article>`?',
      'How do ARIA attributes supplement semantic HTML?',
      'What are landmark roles in HTML5 accessibility?'
    ],
    answer: 'Semantic HTML5 provides meaningful document structure for search engines and assistive screen readers while supplying native keyboard focus and interaction.'
  },

  // 12. FULL-STACK - JWT Authentication & Architecture
  {
    title: 'JWT Authentication and Client-Server Flow',
    question: 'How does JWT (JSON Web Token) authentication work in a full-stack MERN application?',
    technology: 'Full-Stack Development',
    category: 'Security & Auth',
    difficulty: 'Advanced',
    keywords: ['jwt', 'authentication', 'json web token', 'http-only cookie', 'authorization', 'bearer'],
    simpleExplanation: 'A JWT is a digitally signed token that proves a user’s identity. The backend creates it upon successful login and sends it to the frontend, which attaches it to subsequent requests.',
    technicalAnswer: 'A JWT consists of three parts separated by dots: Header (algorithm & token type), Payload (claims such as userId and expiration), and Signature (HMAC or RSA hash of header + payload using a secret key). Because it is digitally signed, the backend verifies authenticity without querying a session database on every request. Storing JWTs in HTTP-only, secure, SameSite cookies protects them against Cross-Site Scripting (XSS) attacks.',
    codeExample: `// 1. Backend: Sign token upon login
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { id: user._id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// Send token via HTTP-only cookie
res.cookie('token', token, {
  httpOnly: true, // Prevents JavaScript document.cookie access (XSS protection)
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax'
});

// 2. Backend Middleware: Verify token
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};`,
    codeExplanation: 'The token encodes user claims securely. The backend verifies the signature using `process.env.JWT_SECRET` on protected routes without needing stateful session storage.',
    expectedOutput: `Stateless, secure token authentication across client and server`,
    realWorldUseCases: [
      'Single Sign-On (SSO) and REST APIs across multiple microservices.',
      'Protected routes in Single Page Applications (React + Express).',
      'Mobile apps and external API access tokens.'
    ],
    interviewPoints: [
      'Never store sensitive data (like passwords or credit card numbers) in a JWT payload; the payload is only Base64Url encoded, NOT encrypted.',
      'Explain the difference between storing tokens in localStorage (vulnerable to XSS) vs HTTP-only cookies (immune to XSS, protect against CSRF).',
      'Know how Token Invalidation works: since JWT is stateless, invalidating before expiry requires token blacklists (Redis) or short-lived access tokens with refresh tokens.'
    ],
    followUpQuestions: [
      'How do you revoke or invalidate a JWT before its expiration date?',
      'What is the difference between Access Tokens and Refresh Tokens?',
      'Why is storing JWT in localStorage dangerous compared to HTTP-only cookies?'
    ],
    answer: 'JWT is a compact, URL-safe means of representing claims between two parties, digitally signed using a cryptographic secret.'
  }
];

async function seedDatabase() {
  try {
    const conn = await connectDB();
    if (!conn) {
      console.error('Cannot seed: MongoDB connection failed.');
      process.exit(1);
    }

    console.log('Clearing existing questions in Question collection...');
    await Question.deleteMany({});

    console.log(`Inserting ${sampleQuestions.length} curated interview questions...`);
    const inserted = await Question.insertMany(sampleQuestions);

    console.log(`Successfully seeded ${inserted.length} questions into MongoDB!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding questions database:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { sampleQuestions, seedDatabase };
