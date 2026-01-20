import { useState } from "react";


function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    platform: "",
    contentType: "",
    monthlyBudget: "",
  });

  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isSignup ? "/auth/signup" : "/auth/login";

    try {
      // 1. Auth Request (Login or Signup)
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");

      let token = data.token;

      // 2. If Signup, we need to Login first (if API doesn't return token on signup)
      // Note: Usually signup endpoints might return token, but checking auth.js:
      // Signup returns { message: "User created" }, Login returns { token }
      if (isSignup) {
        const loginRes = await fetch("http://localhost:5000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          }),
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error("Auto-login failed");
        token = loginData.token;

        // 3. Create Profile
        await fetch("http://localhost:5000/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: formData.name,
            platform: formData.platform,
            contentType: formData.contentType,
            monthlyBudget: Number(formData.monthlyBudget),
            teamSize: "1" // Default for now
          }),
        });
      }

      // 4. Final Success
      localStorage.setItem("token", token);
      onLogin({ email: formData.email, token });

    } catch (err) {
      alert(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #0f0f0f, #121212)",
      }}
    >
      <div style={{ width: "360px" }} className="card">
        <h2 style={{ marginBottom: "8px" }}>
          {isSignup ? "Create Account" : "Welcome to CoinTent"}
        </h2>
        <p style={{ marginBottom: "24px" }}>
          {isSignup
            ? "Start your financial journey today."
            : "Sign in to manage your creator finances."}
        </p>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{ marginBottom: "12px" }}
              />
              <input
                placeholder="Platform (YouTube, Instagram...)"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                required
                style={{ marginBottom: "12px" }}
              />
              <input
                placeholder="Content Type (Tech, Vlogs...)"
                value={formData.contentType}
                onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                required
                style={{ marginBottom: "12px" }}
              />
              <input
                type="number"
                placeholder="Monthly Budget (₹)"
                value={formData.monthlyBudget}
                onChange={(e) => setFormData({ ...formData, monthlyBudget: e.target.value })}
                required
                style={{ marginBottom: "12px" }}
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            style={{ marginBottom: "12px" }}
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <button
            type="submit"
            style={{ width: "100%", marginTop: "20px" }}
            disabled={loading}
          >
            {loading
              ? isSignup
                ? "Creating Account..."
                : "Signing in..."
              : isSignup
                ? "Sign Up"
                : "Sign In"}
          </button>
        </form>

        <p style={{ marginTop: "20px", fontSize: "14px", color: "#888" }}>
          {isSignup ? "Already have an account? " : "New to CoinTent? "}
          <span
            onClick={() => setIsSignup(!isSignup)}
            style={{
              color: "#c7a17a",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
