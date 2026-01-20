const mongoose = require("mongoose");
const User = require("./models/User"); // Assuming User model path
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]); // Force Google DNS
require("dotenv").config();

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4
    });
    console.log("MongoDB connected");

    const email = "test@test.com";
    const password = "password123";

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      process.exit(0);
    }

    const user = new User({ email, password });
    await user.save();
    console.log(`User created successfully!\nEmail: ${email}\nPassword: ${password}`);
  } catch (err) {
    console.error("Error creating user:", err);
  } finally {
    mongoose.connection.close();
  }
};

createUser();
