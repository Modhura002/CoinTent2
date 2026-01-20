import Layout from "../components/layout/Layout";
import ExpenseTracker from "../components/ExpenseTracker";
import BudgetPlanner from "../components/BudgetPlanner";

function Dashboard() {
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
          <p style={{ fontSize: "28px", color: "#c7a17a" }}>₹15,000</p>
        </div>

        <div className="card">
          <h3>Total Spent</h3>
          <p style={{ fontSize: "28px" }}>₹6,200</p>
        </div>

        <div className="card">
          <h3>AI Insight</h3>
          <p>You’re spending sustainably this month.</p>
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
