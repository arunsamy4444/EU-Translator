import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/users', {
          params: { email: user.email, password: 'admin' },
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    fetchUsers();
  }, [user]);

  const handleUserPrompts = async (userObj) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/prompts/${userObj._id}`);
      setSelectedUser(userObj);
      setPrompts(res.data);
    } catch (err) {
      console.error('Failed to fetch prompts:', err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        params: { email: user.email, password: 'admin' },
      });
      setUsers(prev => prev.filter(u => u._id !== id));
      if (selectedUser && selectedUser._id === id) {
        setSelectedUser(null);
        setPrompts([]);
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };


  return (
    <div className="signup-wrapper">
      <style>{`
        .signup-wrapper {
          min-height: 100vh;
          padding: 2rem;
          background: radial-gradient(circle at 30% 30%, #0f0c29, #302b63, #24243e);
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Poppins', sans-serif;
        }
        .signup-card {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(15px);
          padding: 2rem;
          border-radius: 20px;
          max-width: 900px;
          width: 100%;
          color: #fff;
          box-shadow: 0 0 25px #ec9aec;
          animation: fadeInCard 0.8s ease;
        }
        h2 {
          text-align: center;
          color: #ec9aec;
          margin-bottom: 1rem;
          text-shadow: 0 0 10px #fff, 0 0 20px #ec9aec;
        }
        h3 {
          margin-top: 1.5rem;
          color: #ffd6ff;
        }
        .box-card, .history-item {
          background: rgba(255, 255, 255, 0.08);
          padding: 1rem;
          border-radius: 14px;
          margin-bottom: 1rem;
          box-shadow: 0 0 10px #ec9aec40;
          transition: transform 0.2s ease;
        }
        .box-card:hover {
          transform: scale(1.02);
        }
        .box-card button, .logout-button {
          margin-left: 0.6rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #6c5ce7, #a29bfe);
          border: none;
          border-radius: 12px;
          color: #fff;
          cursor: pointer;
          font-weight: bold;
          transition: 0.3s;
        }
        .logout-button {
          display: block;
          margin: 1rem auto;
          background: linear-gradient(135deg, #ff7675, #e84393);
        }
        .box-card button:hover, .logout-button:hover {
          box-shadow: 0 0 12px #ec9aec;
        }
        .history-item p {
          margin: 0.3rem 0;
        }
        @keyframes fadeInCard {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="signup-card">
        <h2>🛡️ Admin Dashboard</h2>
        <button className="logout-button" onClick={onLogout}>Logout</button>

        {!selectedUser ? (
          <>
            <h3>👤 Total Users: {users.length}</h3>
            {users.map(u => (
              <div key={u._id} className="box-card">
                <strong>{u.email}</strong>
                <button onClick={() => handleUserPrompts(u)}>📂 View Prompts</button>
                <button onClick={() => deleteUser(u._id)}>🗑️ Delete</button>
              </div>
            ))}
          </>
        ) : (
          <>
            <h3>📂 Prompts by: {selectedUser.email}</h3>
            <button className="logout-button" onClick={() => {
              setSelectedUser(null);
              setPrompts([]);
            }}>🔙 Back to Users</button>
            {prompts.length === 0 ? (
              <p style={{ opacity: 0.6, marginTop: '1rem' }}>No prompts found for this user.</p>
            ) : (
              prompts.map(p => (
                <div key={p._id} className="history-item">
                  <p><strong>{p.userInput}</strong> → <em>{p.aiResponse}</em></p>
                  <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                    {p.inputLanguage} ➝ {p.outputLanguage} | {new Date(p.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
  // return (
  //   <div style={{ padding: '2rem', fontFamily: 'sans-serif', color: '#fff' }}>
  //     <h2 style={{ color: '#ff00ff', textShadow: '0 0 10px #ff00ff' }}>🛡️ Admin Dashboard</h2>
  //     <button onClick={onLogout} className="logout-button">Logout</button>

  //     {!selectedUser ? (
  //       <div style={{ marginTop: '2rem' }}>
  //         <h3>👤 Total Users: {users.length}</h3>
  //         {users.map(u => (
  //           <div key={u._id} className="box-card">
  //             <strong>{u.email}</strong>
  //             <button onClick={() => handleUserPrompts(u)} style={{ marginLeft: '1rem' }}>
  //               📂 View Prompts
  //             </button>
  //             <button onClick={() => deleteUser(u._id)} style={{ marginLeft: '1rem' }}>
  //               🗑️ Delete
  //             </button>
  //           </div>
  //         ))}
  //       </div>
  //     ) : (
  //       <div style={{ marginTop: '2rem' }}>
  //         <h3>📂 Prompts by: {selectedUser.email}</h3>
  //         <button onClick={() => {
  //           setSelectedUser(null);
  //           setPrompts([]);
  //         }}>🔙 Back to Users</button>

  //         {prompts.length === 0 ? (
  //           <p style={{ marginTop: '1rem' }}>No prompts found for this user.</p>
  //         ) : (
  //           prompts.map(p => (
  //             <div key={p._id} className="history-item">
  //               <p><strong>{p.userInput}</strong> → <em>{p.aiResponse}</em></p>
  //               <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>
  //                 {p.inputLanguage} ➝ {p.outputLanguage} | {new Date(p.createdAt).toLocaleString()}
  //               </p>
  //             </div>
  //           ))
  //         )}
  //       </div>
  //     )}
  //   </div>
  // );
};

export default AdminDashboard;
