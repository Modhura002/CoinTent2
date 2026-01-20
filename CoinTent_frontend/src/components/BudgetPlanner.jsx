import { useState } from "react";
import ReactMarkdown from 'react-markdown';

function BudgetPlanner() {
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [targetBudget, setTargetBudget] = useState("");

  const generatePlan = async () => {
    if (!targetBudget) {
      alert("Please enter a target budget.");
      return;
    }
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/ai/planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ targetBudget })
      });
      const data = await res.json();
      setPlan(data.plan);
    } catch (err) {
      console.error("Error generating plan", err);
      setPlan("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <p style={{ marginBottom: "20px" }}>
        Get a personalized monthly budget plan based on your profile and spending.
      </p>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <input
          type="number"
          placeholder="Target Monthly Budget (₹)"
          value={targetBudget}
          onChange={(e) => setTargetBudget(e.target.value)}
          style={{ flex: 1 }}
        />
        <button onClick={generatePlan} disabled={loading} style={{ width: "auto" }}>
          {loading ? "Planning..." : "Generate"}
        </button>
      </div>

      {plan && (
        <div style={{ marginTop: "24px", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
          <h4>Your Plan:</h4>
          <div style={{ marginTop: "12px", color: "#ddd" }}>
            <ReactMarkdown>{plan}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetPlanner;
