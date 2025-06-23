import React from 'react';
import History from './History';

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
      <style>{`
        .signup-wrapper {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          background: radial-gradient(circle at 30% 30%, #0f0c29, #302b63, #24243e);
          font-family: 'Poppins', sans-serif;
        }
        .signup-card {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(15px);
          padding: 2.5rem 2rem;
          border-radius: 20px;
          width: 100%;
          max-width: 800px;
          color: #fff;
          box-shadow: 0 0 25px #ec9aec;
          animation: fadeInCard 0.9s ease-out;
        }
        .signup-card h2 {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #ec9aec;
          font-size: 1.8rem;
          text-shadow: 0 0 10px #fff, 0 0 20px #ec9aec;
          animation: pulseTitle 2s infinite;
        }
        .error {
          background: rgba(255, 0, 0, 0.1);
          color: #ff7675;
          padding: 0.75rem;
          border-radius: 12px;
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
      `}</style>

      <div className="signup-card">
        <h2>🔮 Your Translation History</h2>
        <History userId={user._id} />
      </div>
    </div>
  );
};

export default HistoryPage;


// import React from 'react';
// import History from './History';

// const HistoryPage = ({ user }) => {
//   if (!user) return <p style={{ color: 'red', textAlign: 'center' }}>🚫 Unauthorized access</p>;

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2 style={{
//         textAlign: 'center',
//         marginBottom: '1.5rem',
//         color: '#ff00ff',
//         textShadow: '0 0 15px #ff00ff, 0 0 25px #8e44ad'
//       }}>
//         🔮 Your Translation History
//       </h2>
//       <History userId={user._id} />
//     </div>
//   );
// };

// export default HistoryPage;
