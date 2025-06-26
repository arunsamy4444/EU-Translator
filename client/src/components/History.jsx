import React, { useEffect, useState } from 'react';
import axios from 'axios';

const History = ({ userId }) => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
 const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/prompts/${userId}`);
      setPrompts(res.data.reverse()); // latest first
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
    }
  };

  const deletePrompt = async (id) => {
await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/prompts/${userId}/${id}`);
    fetchHistory();
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return <p style={{ textAlign: 'center', color: '#bbb' }}>Loading history...</p>;
  }
return (
    <div className="history-wrapper">
      <style>{`
        .history-wrapper {
          min-height: 100vh;
          padding: 2rem;
          font-family: 'Poppins', sans-serif;
          background: radial-gradient(circle at 30% 30%, #0f0c29, #302b63, #24243e);
          color: #fff;
        }
        .history-item {
          background: rgba(255, 255, 255, 0.06);
          padding: 1rem;
          margin-bottom: 1.5rem;
          border-radius: 16px;
          box-shadow: 0 0 15px #ec9aec;
          animation: fadeInItem 0.5s ease;
        }
        .history-item p {
          margin: 0.5rem 0;
        }
        .history-item strong {
          color: #ec9aec;
        }
        .btn-delete {
          background: linear-gradient(135deg, #ff6b81, #ff4757);
          border: none;
          border-radius: 14px;
          padding: 0.5rem 1rem;
          color: white;
          font-weight: bold;
          cursor: pointer;
          margin-top: 0.5rem;
          box-shadow: 0 0 10px #ff6b81;
          transition: 0.3s ease;
        }
        .btn-delete:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px #ff6b81;
        }
        @keyframes fadeInItem {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 480px) {
          .history-wrapper {
            padding: 1rem;
          }
          .btn-delete {
            width: 100%;
          }
        }
      `}</style>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#bbb' }}>Loading history...</p>
      ) : prompts.length === 0 ? (
        <p style={{ textAlign: 'center', opacity: 0.6 }}>No history yet.</p>
      ) : (
        prompts.map((p) => (
          <div key={p._id} className="history-item">
            <p><strong>{p.userInput}</strong> → {p.aiResponse}</p>
            <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
              From: <strong>{p.inputLanguage}</strong> ➝ To: <strong>{p.outputLanguage}</strong> | {formatDate(p.createdAt)}
            </p>
            <button className="btn-delete" onClick={() => deletePrompt(p._id)}>🗑️ Delete</button>
          </div>
        ))
      )}
    </div>
  );

  // return (
  //   <div className="history-wrapper" style={{ marginTop: '2rem' }}>
  //     {prompts.length === 0 ? (
  //       <p style={{ textAlign: 'center', opacity: 0.6 }}>No history yet.</p>
  //     ) : (
  //       prompts.map((p) => (
  //         <div key={p._id} className="history-item" style={{
  //           background: 'rgba(255, 255, 255, 0.05)',
  //           marginBottom: '1rem',
  //           padding: '1rem',
  //           borderRadius: '14px',
  //           boxShadow: '0 0 10px rgba(255, 0, 255, 0.2)',
  //           transition: 'all 0.3s',
  //           animation: 'fadeIn 0.5s ease'
  //         }}>
  //           <p style={{ marginBottom: '0.5rem' }}>
  //             <strong>{p.userInput}</strong> → <span>{p.aiResponse}</span>
  //           </p>
  //           <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
  //             From: <strong>{p.inputLanguage}</strong> ➝ To: <strong>{p.outputLanguage}</strong> | {formatDate(p.createdAt)}
  //           </p>
  //        <button className="btn-delete" onClick={() => deletePrompt(p._id)}>🗑️ Delete</button>

  //         </div>
  //       ))
  //     )}
  //   </div>
  // );
};

export default History;
