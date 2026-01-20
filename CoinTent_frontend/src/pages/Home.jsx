import Layout from "../components/layout/Layout";
import { motion } from "framer-motion";

function Home({ user, onLogout }) {
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}
        >
          <SummaryCard title="Monthly Budget" value="₹15,000" />
          <SummaryCard title="Total Spent" value="₹6,200" />
          <SummaryCard title="AI Insight" value="Spending sustainably" />
        </div>
      </motion.div>
    </Layout>
  );
}

function SummaryCard({ title, value }) {
  return (
    <motion.div className="card" whileHover={{ scale: 1.03 }}>
      <h3>{title}</h3>
      <p style={{ fontSize: "28px", marginTop: "10px" }}>{value}</p>
    </motion.div>
  );
}

export default Home;
