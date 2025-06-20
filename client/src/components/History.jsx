import React, { useEffect, useState } from "react";
import { euLanguages } from "./Languages";

export default function History({ user }) {
  const [data, setData] = useState([]);

  const getLangName = (code) => {
    const match = euLanguages.find((l) => l.code === code);
    return match ? match.name : code;
  };

  const loadHistory = async () => {
    const res = await fetch("http://localhost:5000/history/" + user._id);
    const json = await res.json();
    setData(json.reverse()); // latest first
  };

  const del = async (id) => {
    await fetch("http://localhost:5000/history/" + id, { method: "DELETE" });
    loadHistory();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="history-container">
      <h2 className="history-title">📜 Translation History</h2>
      {data.length === 0 ? (
        <p className="no-history">No history yet.</p>
      ) : (
        data.map((item) => (
          <div key={item._id} className="history-card">
            <p><strong>From:</strong> {getLangName(user.nativeLang)}</p>
            <p><strong>To:</strong> {getLangName(item.targetLang)}</p>
            <p><strong>Input:</strong> <span className="code-text">{item.inputText}</span></p>
            <p><strong>Output:</strong> <span className="code-text">{item.translatedText}</span></p>
            <p><strong>Date:</strong> {formatDate(item.date)}</p>
            <button onClick={() => del(item._id)} className="delete-btn">🗑️ Delete</button>
          </div>
        ))
      )}

      <style>{`
        .history-container {
          max-width: 800px;
          margin: 50px auto;
          padding: 30px;
          background: rgba(30, 30, 40, 0.75);
          border-radius: 18px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          color: #eee;
          font-family: 'Segoe UI', sans-serif;
          backdrop-filter: blur(12px);
          animation: fadeIn 0.6s ease;
        }

        .history-title {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 30px;
          background: linear-gradient(to right, #00f2fe, #4facfe);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .no-history {
          text-align: center;
          color: #ccc;
          font-style: italic;
        }

        .history-card {
          background: rgba(255, 255, 255, 0.05);
          border-left: 4px solid #00f2fe;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease;
        }

        .history-card:hover {
          transform: translateY(-3px);
        }

        .history-card p {
          margin: 6px 0;
        }

        .code-text {
          font-family: monospace;
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
          padding: 4px 8px;
          border-radius: 4px;
        }

        .delete-btn {
          margin-top: 10px;
          padding: 8px 14px;
          background: linear-gradient(to right, #ff416c, #ff4b2b);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s ease, background 0.3s ease;
        }

        .delete-btn:hover {
          transform: scale(1.05);
          opacity: 0.9;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .history-container {
            padding: 20px;
            margin: 20px;
          }
        }
      `}</style>
    </div>
  );
}
