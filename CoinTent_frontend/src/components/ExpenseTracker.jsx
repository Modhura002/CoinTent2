import { useState } from "react";

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  function addExpense() {
    if (!amount || !category) return;

    setExpenses([
      ...expenses,
      { amount: Number(amount), category },
    ]);

    setAmount("");
    setCategory("");
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
