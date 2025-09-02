import React from 'react';
import History from './History';
import '../HistoryPage.css'
const HistoryPage = ({ user }) => {
  if (!user) {
    return (
      <div className="signup-wrapper">
        <div className="signup-card">
          <p className="error">🚫 Unauthorized access</p>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h2>🔮 Your Translation History</h2>
        <History userId={user._id} />
      </div>
    </div>
  );
};

export default HistoryPage;
