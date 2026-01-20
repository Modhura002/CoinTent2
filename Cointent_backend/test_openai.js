require("dotenv").config();
const OpenAI = require("openai");

async function testOpenAI() {
  console.log("Testing OpenAI API...");
  if (!process.env.OPENAI_API_KEY) {
    console.error("ERROR: No OPENAI_API_KEY found in .env");
    return;
  }
  // Log first few chars to verify it loaded correct key
  console.log("Key loaded:", process.env.OPENAI_API_KEY.substring(0, 8) + "...");

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Hello, are you working?" }],
    });
    console.log("Success! Response:", response.choices[0].message.content);
  } catch (error) {
    console.error("OpenAI Test Failed:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Full Error:", JSON.stringify(error.response.data, null, 2));
    }
  }
}

testOpenAI();
