import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Login.css";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:10000";

const handleLogin = async () => {
  if (!email || !password) {
    setError("Please enter both email and password");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const res = await axios.post(`${BASE_URL}/api/login`, { email, password });
    const userData = res.data;

    // ensure isAdmin property exists
    if (userData.isAdmin === undefined) userData.isAdmin = false;

    // store user
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    // redirect based on type
    if (userData.isAdmin) {
      navigate("/admin");
    } else {
      navigate("/");
    }
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Login</h2>

        {error && <div className="error">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="button" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don’t have an account?{" "}
          <button type="button" onClick={() => navigate("/signup")}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
