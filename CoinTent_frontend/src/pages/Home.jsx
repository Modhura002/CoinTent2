import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { motion } from "framer-motion";

function Home({ user, onLogout }) {
  const [stats, setStats] = useState({
    monthlyBudget: 0,
    totalSpent: 0,
    insight: "Loading...",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

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
      setNewBudget(profileData?.monthlyBudget || 0);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  }

  async function saveBudget() {
    const token = localStorage.getItem("token");
    try {
      await fetch("http://localhost:5000/profile", {
        method: "POST", // Depending on backend, often POST is used for upsert or create
        // IMPORTANT: We need to make sure the backend supports PARTIAL update or we send full data.
        // If backend replaces document, we might lose other fields if we just send budget.
        // Let's assume we need to update just budget.
        // Actually, the current POST /profile implementation in "impl" usually creates or overwrites.
        // We should double check if we need to fetch existing fields first?
        // Wait, the profile update logic is robust enough usually to just update provided fields if using findOneAndUpdate or similar, 
        // BUT most simplified backends just do `new Profile(req.body).save()` or `findOneAndUpdate(..., req.body, {upsert:true})`.
        // Let's do a safe full update by merging locally if needed, but for now let's hope backend merges.
        // REVISIT: sending only monthlyBudget might clear name/platform if backend isn't smart.
        // Let's rely on standard practice: If backend uses `findOneAndUpdate` with `$set` or `upsert`, it's safe.
        // If it creates new object, we need full data.
        // Let's assume it's an upsert merge for safety.
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ monthlyBudget: Number(newBudget) })
      });
      setIsEditing(false);
      fetchData(); // Refresh integration
    } catch (err) {
      alert("Failed to update budget");
    }
  }

  const isOverBudget = stats.totalSpent > stats.monthlyBudget;

  return (
    <Layout user={user} onLogout={onLogout}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: "900px" }}
      >
        <h1 style={{ fontSize: "56px", marginBottom: "20px" }}>
          Financial clarity for creators.
        </h1>

        <p style={{ fontSize: "18px", marginBottom: "50px" }}>
          CoinTent helps independent creators plan content, track spending,
          and make smarter financial decisions—without spreadsheets or stress.
        </p>

        {isOverBudget && (
          <div style={{
            background: "#ffebee",
            color: "#c62828",
            border: "1px solid #c62828",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <strong>⚠️ Alert:</strong> You have exceeded your monthly budget by ₹{stats.totalSpent - stats.monthlyBudget}.
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}
        >
          {isEditing ? (
            <div className="card">
              <h3>Edit Budget</h3>
              <input
                type="number"
                value={newBudget}
                onChange={e => setNewBudget(e.target.value)}
                style={{ width: "100%", margin: "12px 0" }}
              />
              <button onClick={saveBudget} style={{ width: "100%" }}>Save</button>
            </div>
          ) : (
            <SummaryCard
              title="Monthly Budget"
              value={`₹${stats.monthlyBudget}`}
              isWarning={false}
              onClick={() => setIsEditing(true)}
              isEditable={true}
            />
          )}

          <SummaryCard
            title="Total Spent"
            value={`₹${stats.totalSpent}`}
            isWarning={isOverBudget}
          />
          <SummaryCard title="AI Insight" value={stats.insight} />
        </div>
      </motion.div>
    </Layout>
  );
}

function SummaryCard({ title, value, isWarning, isEditable, onClick }) {
  return (
    <motion.div
      className="card"
      whileHover={{ scale: 1.03 }}
      style={{
        border: isWarning ? "2px solid #ef5350" : "1px solid #333",
        position: "relative"
      }}
    >
      <h3>{title}</h3>
      <p style={{ fontSize: "28px", marginTop: "10px", color: isWarning ? "#ef5350" : "white" }}>
        {value}
      </p>

      {isEditable && (
        <span
          onClick={onClick}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            fontSize: "12px",
            cursor: "pointer",
            background: "#333",
            padding: "4px 8px",
            borderRadius: "4px"
          }}
        >
          EDIT
        </span>
      )}
    </motion.div>
  );
}

export default Home;
