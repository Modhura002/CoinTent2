const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
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
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("CoinTent backend is running");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
