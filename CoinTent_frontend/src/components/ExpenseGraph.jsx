import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";

const data = [
  { week: "Week 1", amount: 1200 },
  { week: "Week 2", amount: 1800 },
  { week: "Week 3", amount: 1400 },
  { week: "Week 4", amount: 1800 },
];

function ExpenseGraph() {
  const [trendData, setTrendData] = useState([]);

  // Fetch trend on mount and every 5 seconds to stay updated
  // (In a real app, we'd lift state up, but this works for now)
  useEffect(() => {
    fetchTrend();
    const interval = setInterval(fetchTrend, 5000);
    return () => clearInterval(interval);
  }, []);

  async function fetchTrend() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTrendData(data.weeklyTrend || []);
    } catch (err) {
      console.error("Error fetching trend data", err);
    }
  }

  return (
    <div className="card" style={{ marginTop: "40px" }}>
      <h3>Weekly Expense Trend</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trendData}>
          <XAxis dataKey="week" stroke="#a3a3a3" />
          <YAxis stroke="#a3a3a3" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#c7a17a"
            strokeWidth={3}
            dot={{ r: 4 }}
            animationDuration={900}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpenseGraph;
