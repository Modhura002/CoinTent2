import { useEffect, useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cointent_users")) || [];
    setUsers(stored);
  }, []);

  function handleEmailChange(e) {
    const value = e.target.value;
    setEmail(value);

    const match = users.find(u => u.email === value);
    if (match) setPassword(match.password);
    else setPassword("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    const existing = users.find(u => u.email === email);
    let updatedUsers = users;

    if (!existing) {
      updatedUsers = [...users, { email, password }];
      localStorage.setItem("cointent_users", JSON.stringify(updatedUsers));
    }

    onLogin({ email });
  }

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
        <h2 style={{ marginBottom: "8px" }}>Welcome to CoinTent</h2>
        <p style={{ marginBottom: "24px" }}>
          Sign in to manage your creator finances.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            list="email-list"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
            style={{ marginBottom: "12px" }}
          />

          <datalist id="email-list">
            {users.map((u, i) => (
              <option key={i} value={u.email} />
            ))}
          </datalist>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button style={{ width: "100%", marginTop: "20px" }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
