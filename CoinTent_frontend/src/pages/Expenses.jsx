import Layout from "../components/layout/Layout";
import ExpenseTracker from "../components/ExpenseTracker";
import ExpenseGraph from "../components/ExpenseGraph";

function Expenses({ user, onLogout }) {
  return (
    <Layout user={user} onLogout={onLogout}>
      <h1 style={{ marginBottom: "20px" }}>Expenses</h1>
      <ExpenseTracker />
      <ExpenseGraph />
    </Layout>
  );
}

export default Expenses;
