import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import ExpenseTracker from "../components/ExpenseTracker";
import BudgetPlanner from "../components/BudgetPlanner";

function Dashboard() {
  const [stats, setStats] = useState({
    monthlyBudget: 0,
    totalSpent: 0,
    insight: "Loading...",
  });

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const headers = { Authorization: `Bearer ${token}` };

        const profileRes = await fetch("http://localhost:5000/profile", { headers });
        const profileData = await profileRes.json();

        const expenseRes = await fetch("http://localhost:5000/expenses", { headers });
        const expenseData = await expenseRes.json();

        const totalSpent = expenseData.expenses
          ? expenseData.expenses.reduce((sum, item) => sum + item.amount, 0)
          : 0;

        setStats({
          monthlyBudget: profileData?.monthlyBudget || 0,
          totalSpent,
          insight: "Spending sustainably",
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    }

    fetchData();
  }, []);

  return (
    <Layout>
      <div style={{ marginBottom: "60px" }}>
        <h1 style={{ fontSize: "48px", marginBottom: "16px" }}>
          Financial clarity for creators.
        </h1>
        <p style={{ maxWidth: "600px" }}>
          CoinTent helps independent creators plan content, track spending,
          and make smarter financial decisions—without spreadsheets or stress.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          marginBottom: "60px",
        }}
      >
        <div className="card">
          <h3>Monthly Budget</h3>
          <p style={{ fontSize: "28px", color: "#c7a17a" }}>₹{stats.monthlyBudget}</p>
        </div>

        <div className="card">
          <h3>Total Spent</h3>
          <p style={{ fontSize: "28px" }}>₹{stats.totalSpent}</p>
        </div>

        <div className="card">
          <h3>AI Insight</h3>
          <p>{stats.insight}</p>
        </div>
      </div>

      <div style={{ marginBottom: "60px" }}>
        <h2 style={{ marginBottom: "20px" }}>Expenses</h2>
        <ExpenseTracker />
      </div>

      <div>
        <h2 style={{ marginBottom: "20px" }}>AI Budget Planner</h2>
        <BudgetPlanner />
      </div>
    </Layout>
  );
}

export default Dashboard;
