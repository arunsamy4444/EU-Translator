import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../History.css";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:10000";


const History = ({ userId }) => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/prompts/${userId}`);
      setPrompts(res.data.reverse()); // latest first
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
    }
  };

  const deletePrompt = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/prompts/${userId}/${id}`);
      fetchHistory();
    } catch (err) {
      console.error('Failed to delete prompt', err);
    }
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
      {prompts.length === 0 ? (
        <p >No history yet.</p>
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
};

export default History;
