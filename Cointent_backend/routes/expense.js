const express = require("express");
const jwt = require("jsonwebtoken");
const Expense = require("../models/Expense");

const router = express.Router();

// auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // support both raw token and "Bearer <token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}


// ADD EXPENSE
router.post("/", auth, async (req, res) => {
  try {
    const expense = new Expense({
      userId: req.userId,
      amount: req.body.amount,
      category: req.body.category
    });

    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET EXPENSES + WEEKLY GRAPH DATA
router.get("/", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId });

    const weeklyTotals = {};

    expenses.forEach(exp => {
      const date = new Date(exp.date);
      // Get week of month (0-4)
      const dayOfMonth = date.getDate();
      const weekNumber = Math.ceil(dayOfMonth / 7);

      const weekLabel = `Week ${weekNumber}`;
      weeklyTotals[weekLabel] = (weeklyTotals[weekLabel] || 0) + exp.amount;
    });

    // Ensure all 4 weeks exist for cleaner graph
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const weeklyTrend = weeks.map(week => ({
      week,
      total: weeklyTotals[week] || 0
    }));

    res.json({ expenses, weeklyTrend });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
