import { useState } from "react";

function BudgetPlanner() {
  const [posts, setPosts] = useState("");
  const [estimatedBudget, setEstimatedBudget] = useState(null);

  function calculateBudget() {
    if (!posts) return;

    // Fake AI logic for now
    const costPerPost = 800;
    const total = posts * costPerPost;

    setEstimatedBudget(total);
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: "16px" }}>AI Budget Planner</h3>

      <input
        type="number"
        placeholder="Number of posts per month"
        value={posts}
        onChange={(e) => setPosts(e.target.value)}
        style={{ marginBottom: "12px" }}
      />

      <button onClick={calculateBudget}>Estimate Budget</button>

      {estimatedBudget && (
        <div style={{ marginTop: "16px" }}>
          <p>
            Estimated Monthly Budget:{" "}
            <strong>₹{estimatedBudget}</strong>
          </p>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Based on average creator costs.
          </p>
        </div>
      )}
    </div>
  );
}

export default BudgetPlanner;
