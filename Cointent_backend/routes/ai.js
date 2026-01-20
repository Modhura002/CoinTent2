const express = require("express");
const jwt = require("jsonwebtoken");
const OpenAI = require("openai");
const Profile = require("../models/Profile");
const Expense = require("../models/Expense");

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Auth middleware (robust)
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

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

// AI BUDGET PLANNER
router.post("/planner", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.userId });
    const expenses = await Expense.find({ userId: req.userId });

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    const prompt = `
You are a financial planning assistant for small content creators.

Creator profile:
Platform: ${profile?.platform}
Content type: ${profile?.contentType}
Team size: ${profile?.teamSize}
Monthly budget: ${profile?.monthlyBudget}

Total spent so far this month: ${totalSpent}

Give a realistic monthly budget plan.
Break down expected costs.
Warn if spending is risky.
Keep the tone calm and practical.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You help creators manage money wisely." },
        { role: "user", content: prompt }
      ]
    });

    res.json({
      plan: response.choices[0].message.content
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
