import { useState, useEffect } from "react";

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setExpenses(data.expenses || []);
    } catch (err) {
      console.error("Error fetching expenses", err);
    }
  }

  async function addExpense() {
    if (!amount || !category) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: Number(amount), category }),
      });

      const newExpense = await res.json();

      setExpenses([...expenses, newExpense]);
      setAmount("");
      setCategory("");
    } catch (err) {
      console.error("Error adding expense", err);
    }
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: "16px" }}>Add Expense</h3>

      <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
        <input
          type="number"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          placeholder="Category (Ads, Tools, Travel...)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <button onClick={addExpense}>Add Expense</button>

      {expenses.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h4>Expense History</h4>
          <ul style={{ paddingLeft: "18px" }}>
            {expenses.map((e, index) => (
              <li key={index}>
                ₹{e.amount} — {e.category}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ExpenseTracker;
