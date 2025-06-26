import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser, setIsSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

const handleLogin = async () => {
  try {
   const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/login`, { email, password });

    setUser(res.data); // 🔥 Always set user in state
    localStorage.setItem('user', JSON.stringify(res.data)); // 🔥 Always store it
    if (res.data.isAdmin) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed');
  }
};


  return (
    <div className="login-wrapper">
      <style>{`
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          background: radial-gradient(circle at 30% 30%, #0f0c29, #302b63, #24243e);
          font-family: 'Poppins', sans-serif;
        }
        .login-card {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(15px);
          padding: 2.5rem 2rem;
          border-radius: 20px;
          width: 100%;
          max-width: 400px;
          color: #fff;
          box-shadow: 0 0 25px #ec9aec;
          animation: fadeInCard 0.9s ease-out;
        }
        .login-card h2 {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #ec9aec;
          font-size: 1.8rem;
          text-shadow: 0 0 10px #fff, 0 0 20px #ec9aec;
          animation: pulseTitle 2s infinite;
        }
        .login-card input {
          width: 100%;
          padding: 1rem;
          margin-bottom: 1rem;
          border: none;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          font-size: 1rem;
          backdrop-filter: blur(4px);
        }
        .login-card input::placeholder {
          color: rgba(255,255,255,0.5);
        }
        .login-card button {
          width: 100%;
          padding: 0.9rem;
          background: linear-gradient(135deg, #6c5ce7, #a29bfe);
          border: none;
          border-radius: 16px;
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s ease;
          box-shadow: 0 0 15px #ec9aec;
        }
        .login-card button:hover {
          transform: scale(1.04);
          box-shadow: 0 0 25px #ec9aec;
        }
        .login-card p {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.9rem;
        }
        .login-card p button {
          background: none;
          border: none;
          color: #ec9aec;
          font-weight: bold;
          cursor: pointer;
          margin-left: 0.4rem;
        }
        .login-card p button:hover {
          text-decoration: underline;
        }
        .login-card .error {
          background: rgba(255, 0, 0, 0.1);
          color: #ff7675;
          padding: 0.75rem;
          border-radius: 12px;
          margin-bottom: 1rem;
          text-align: center;
        }
        @keyframes fadeInCard {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseTitle {
          0% { text-shadow: 0 0 10px #fff, 0 0 20px #ec9aec; }
          50% { text-shadow: 0 0 25px #ec9aec; }
          100% { text-shadow: 0 0 10px #fff, 0 0 20px #ec9aec; }
        }
        @media (max-width: 480px) {
          .login-card {
            padding: 2rem 1.5rem;
          }
          .login-card h2 {
            font-size: 1.6rem;
          }
        }
      `}</style>

      <div className="login-card">
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <input
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
        <button onClick={handleLogin}>Login</button>
     <p>
  Don’t have an account?
  <button onClick={() => navigate('/signup')}>Sign up</button>
</p>
      </div>
    </div>
  );



};

export default Login;
