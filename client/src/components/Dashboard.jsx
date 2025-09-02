import React, { useState } from 'react';
import TranslatorBox from './TranslatorBox';
import '../styles/Dashboard.css'

const Dashboard = ({ user, onLogout }) => {
  const [outputLanguage, setOutputLanguage] = useState(user.nativeLanguage || 'en');

  return (
    <div className="dashboard-wrapper">
      <button onClick={onLogout} className="logout-button">Logout</button>
      <TranslatorBox user={user} outputLanguage={outputLanguage} />
    </div>
  );
};

export default Dashboard;
