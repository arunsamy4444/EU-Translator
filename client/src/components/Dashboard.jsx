import React, { useState } from 'react';
import TranslatorBox from './TranslatorBox';

const Dashboard = ({ user, onLogout }) => {
  const [outputLanguage, setOutputLanguage] = useState(user.nativeLanguage || 'en');

  return (
    <div className="dashboard-wrapper">
      <style>{`
        .dashboard-wrapper {
          min-height: 100vh;
          padding: 2rem;
          background: radial-gradient(circle at 30% 30%, #0f0c29, #302b63, #24243e);
          font-family: 'Poppins', sans-serif;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .logout-button {
          background: linear-gradient(135deg, #ff7675, #e84393);
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 14px;
          color: white;
          font-weight: bold;
          font-size: 1rem;
          margin-bottom: 1.5rem;
          cursor: pointer;
          box-shadow: 0 0 15px #ec9aec;
          transition: 0.3s ease;
        }

        .logout-button:hover {
          box-shadow: 0 0 25px #ff00ff;
          transform: scale(1.05);
        }
      `}</style>

      <button onClick={onLogout} className="logout-button">Logout</button>
      <TranslatorBox user={user} outputLanguage={outputLanguage} />
    </div>
  );
};

export default Dashboard;
