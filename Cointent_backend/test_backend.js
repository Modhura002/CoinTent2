const axios = require("axios");

const API_URL = "http://localhost:5000";
const EMAIL = "test@test.com";
const PASSWORD = "password123";

async function testBackend() {
  try {
    console.log("1. Logging in...");
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: EMAIL,
      password: PASSWORD
    });
    const token = loginRes.data.token;
    console.log("Login successful! Token received.");

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    console.log("\n2. Testing Profile Creation...");
    const profileData = {
      name: "Test User",
      platform: "YouTube",
      contentType: "Tech",
      teamSize: "1",
      monthlyBudget: 1000
    };
    try {
      await axios.post(`${API_URL}/profile`, profileData, config);
      console.log("Profile created successfully!");
    } catch (e) {
      console.log("Profile creation failed (might already exist or error):", e.response?.data || e.message);
    }

    console.log("\n3. Testing Get Profile...");
    const profileRes = await axios.get(`${API_URL}/profile`, config);
    console.log("Profile fetched:", profileRes.data ? "Yes" : "No");

    console.log("\n4. Testing Add Expense...");
    const expenseData = { amount: 50, category: "Software" };
    await axios.post(`${API_URL}/expenses`, expenseData, config);
    console.log("Expense added successfully!");

    console.log("\n5. Testing Get Expenses...");
    const expensesRes = await axios.get(`${API_URL}/expenses`, config);
    console.log(`Expenses fetched: ${expensesRes.data.expenses.length} items`);

    console.log("\n✅ All backend tests passed!");

  } catch (err) {
    console.error("❌ Test failed:", err.response?.data || err.message);
  }
}

testBackend();
