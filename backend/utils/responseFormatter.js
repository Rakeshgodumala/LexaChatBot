/**
 * Formats a technical response according to the 9-point interview structure:
 * 1. Question
 * 2. Simple Explanation
 * 3. Technical Interview Answer
 * 4. Code Example
 * 5. Code Explanation
 * 6. Expected Output
 * 7. Real-World Use Cases
 * 8. Important Interview Points
 * 9. Follow-up Questions
 */
const formatStructuredResponse = ({
  question,
  simpleExplanation,
  technicalAnswer,
  codeExample,
  codeExplanation,
  expectedOutput,
  realWorldUseCases = [],
  interviewPoints = [],
  followUpQuestions = [],
}) => {
  let markdown = `### 🎯 Question\n${question}\n\n`;

  if (simpleExplanation) {
    markdown += `### 💡 Simple Explanation\n${simpleExplanation}\n\n`;
  }

  if (technicalAnswer) {
    markdown += `### 🎓 Technical Interview Answer\n${technicalAnswer}\n\n`;
  }

  if (codeExample) {
    markdown += `### 💻 Practical Code Example\n\`\`\`javascript\n${codeExample.trim()}\n\`\`\`\n\n`;
  }

  if (codeExplanation) {
    markdown += `### 🔍 Code Explanation\n${codeExplanation}\n\n`;
  }

  if (expectedOutput) {
    markdown += `### ⚡ Expected Output\n\`\`\`text\n${expectedOutput.trim()}\n\`\`\`\n\n`;
  }

  if (realWorldUseCases && realWorldUseCases.length > 0) {
    markdown += `### 🌐 Real-World Use Cases\n`;
    realWorldUseCases.forEach((item) => {
      markdown += `- ${item}\n`;
    });
    markdown += `\n`;
  }

  if (interviewPoints && interviewPoints.length > 0) {
    markdown += `### 📌 Important Interview Points\n`;
    interviewPoints.forEach((point) => {
      markdown += `- ${point}\n`;
    });
    markdown += `\n`;
  }

  if (followUpQuestions && followUpQuestions.length > 0) {
    markdown += `### ❓ Follow-up Questions\n`;
    followUpQuestions.forEach((q) => {
      markdown += `- ${q}\n`;
    });
    markdown += `\n`;
  }

  return markdown.trim();
};

module.exports = {
  formatStructuredResponse,
};
