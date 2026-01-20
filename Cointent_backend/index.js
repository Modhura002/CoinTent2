const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]); // Force Google DNS to resolve SRV records

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ADD THESE TWO LINES
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const profileRoutes = require("./routes/profile");
app.use("/profile", profileRoutes);

const expenseRoutes = require("./routes/expense");
app.use("/expenses", expenseRoutes);

const aiRoutes = require("./routes/ai");
app.use("/ai", aiRoutes);




mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Fail fast if connection is down
    family: 4 // Force IPv4
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    console.error("Cause:", err.cause); // Log cause if available
  });

app.get("/", (req, res) => {
  res.send("CoinTent backend is running");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
