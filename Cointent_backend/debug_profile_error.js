const axios = require("axios");

const API_URL = "http://localhost:5000";
const EMAIL = "test@test.com"; // Use the user we simplified created
const PASSWORD = "password123";

async function run() {
  try {
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: EMAIL,
      password: PASSWORD
    });
    const token = loginRes.data.token;

    try {
      await axios.post(
        `${API_URL}/profile`,
        { name: "Debug User" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Success");
    } catch (e) {
      if (e.response) {
        console.log("Status:", e.response.status);
        const fs = require('fs');
        fs.writeFileSync('error.html', typeof e.response.data === 'string' ? e.response.data : JSON.stringify(e.response.data));
        console.log("Error written to error.html");
      } else {
        console.log("Error:", e.message);
      }
    }

  } catch (e) {
    console.error("Login failed:", e.message);
  }
}

run();
