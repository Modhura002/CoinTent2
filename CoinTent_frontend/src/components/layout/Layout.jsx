import Navbar from "./Navbar";
import { motion } from "framer-motion";

function Layout({ children, user, onLogout }) {
  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}
      >
        {children}
      </motion.div>
    </>
  );
}

export default Layout;
