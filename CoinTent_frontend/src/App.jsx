import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Expenses from "./pages/Expenses";
import Planner from "./pages/Planner";
import Insights from "./pages/Insights";

/* Wrapper to allow navigation after login */
function AppRouter({ user, onLogout }) {
  const navigate = useNavigate();

  // Always redirect to home when router mounts
  useState(() => {
    navigate("/");
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home user={user} onLogout={onLogout} />} />
      <Route path="/expenses" element={<Expenses user={user} onLogout={onLogout} />} />
      <Route path="/planner" element={<Planner user={user} onLogout={onLogout} />} />
      <Route path="/insights" element={<Insights user={user} onLogout={onLogout} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  const [user, setUser] = useState(null);

  function handleLogin(userData) {
    setUser(userData);
  }

  function handleLogout() {
    setUser(null);
  }

  // 🚨 Router only exists AFTER login
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <AppRouter user={user} onLogout={handleLogout} />
    </BrowserRouter>
  );
}

export default App;
