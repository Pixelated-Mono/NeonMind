import React from "react";

const HomePage = () => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>Welcome to StudyApp 📚</h1>
      <p>Your personal study companion, inspired by Penseum.</p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        marginTop: "20px"
      }}>
        <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>📖 Notes</h3>
          <p>Store and organize your study notes here.</p>
        </div>
        <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>✅ Tasks</h3>
          <p>Keep track of your assignments and deadlines.</p>
        </div>
        <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>🧠 Quizzes</h3>
          <p>Test your knowledge with custom quizzes.</p>
        </div>
        <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>📅 Planner</h3>
          <p>Plan your study schedule and stay on track.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
