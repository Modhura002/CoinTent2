import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { week: "Week 1", amount: 1200 },
  { week: "Week 2", amount: 1800 },
  { week: "Week 3", amount: 1400 },
  { week: "Week 4", amount: 1800 },
];

function ExpenseGraph() {
  return (
    <div className="card" style={{ marginTop: "40px" }}>
      <h3>Weekly Expense Trend</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="week" stroke="#a3a3a3" />
          <YAxis stroke="#a3a3a3" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="amount"
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
