import Layout from "../components/layout/Layout";
import BudgetPlanner from "../components/BudgetPlanner";

function Planner({ user, onLogout }) {
  return (
    <Layout user={user} onLogout={onLogout}>
      <h1 style={{ marginBottom: "20px" }}>Planner</h1>
      <BudgetPlanner />
    </Layout>
  );
}

export default Planner;
