const express = require("express");
const jwt = require("jsonwebtoken");
const OpenAI = require("openai");
const Profile = require("../models/Profile");
const Expense = require("../models/Expense");

const router = express.Router();

// Initialize OpenAI
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
    const { targetBudget } = req.body;
    const profile = await Profile.findOne({ userId: req.userId });
    const expenses = await Expense.find({ userId: req.userId });

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    const prompt = `
You are a financial planning assistant for small content creators.

Creator profile:
Platform: ${profile?.platform || "General"}
Content type: ${profile?.contentType || "General"}
Current Monthly Budget: ${profile?.monthlyBudget || "Unknown"}
User's Target for this Plan: ${targetBudget || profile?.monthlyBudget || "Optimize spending"}

Total spent so far this month: ${totalSpent}

Give a detailed monthly budget plan to hit the target of ${targetBudget}.
Break down costs into percentages and categories.
Give specific advice for their content type.
Use Markdown formatting (headers, bolding, lists) to structure the plan clearly.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You help creators manage money wisely." },
        { role: "user", content: prompt }
      ]
    });

    res.json({ plan: response.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI Error:", err);
    res.status(500).json({ error: "AI Service Unavailable" });
  }
});

// AI FINANCE CHAT
router.post("/chat", auth, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const profile = await Profile.findOne({ userId: req.userId });
    const expenses = await Expense.find({ userId: req.userId });

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    const prompt = `
You are a calm and helpful financial assistant for content creators.

Creator profile:
Platform: ${profile?.platform || "Unknown"}
Content type: ${profile?.contentType || "Unknown"}
Monthly budget: ${profile?.monthlyBudget || "Unknown"}
Total spent so far: ${totalSpent}

User question:
"${message}"

Give a clear, practical answer.
Avoid fear-based language.
Explain reasoning simply.
Use Markdown formatting (bullet points, bold text) to make it easy to read.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You help creators make mindful financial decisions." },
        { role: "user", content: prompt }
      ]
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI Chat Error:", err);
    res.status(500).json({ error: "AI Service Unavailable" });
  }
});


module.exports = router;
