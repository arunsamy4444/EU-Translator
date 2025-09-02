import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../AdminDashboard.css'

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:10000";


const AdminDashboard = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const adminHeaders = {
    'x-admin-email': user.email,
    'x-admin-password': 'admin',
  };

  // Fetch all users (admin)
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/users`, { headers: adminHeaders });
      setUsers(res.data);
    } catch (err) {
      console.error('Fetch users failed:', err.response?.data || err.message);
    }
  };

  // Delete a user (admin)
  const deleteUser = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/users/${id}`, { headers: adminHeaders });
      setUsers(prev => prev.filter(u => u._id !== id));

      if (selectedUser && selectedUser._id === id) {
        setSelectedUser(null);
        setPrompts([]);
      }
    } catch (err) {
      console.error('Delete user failed:', err.response?.data || err.message);
    }
  };

  // Fetch prompts of a user
const fetchPrompts = async (userId) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/admin/prompts`, { headers: adminHeaders });
    const userPrompts = res.data.filter(
      p => p.userId && p.userId._id.toString() === userId.toString()
    );
    setPrompts(userPrompts);

    const foundUser = users.find(u => u._id.toString() === userId.toString());
    setSelectedUser(foundUser || { email: 'Unknown', _id: userId });
  } catch (err) {
    console.error('Fetch prompts failed:', err.response?.data || err.message);
  }
};



  // Delete a prompt (admin)
  const deletePrompt = async (promptId) => {
    try {
      if (!selectedUser) return;
      await axios.delete(`${BASE_URL}/api/prompts/${selectedUser._id}/${promptId}`);
      setPrompts(prev => prev.filter(p => p._id !== promptId));
    } catch (err) {
      console.error('Delete prompt failed:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
  console.log('Users loaded:', users);
}, [users]);

  return (
    <div className="admin-dashboard">
      <h2>🛡️ Admin Dashboard</h2>
      <button className="btn-logout" onClick={onLogout}>Logout</button>

      {!selectedUser ? (
        <>
          <h3>👤 Total Users: {users.length}</h3>
          <div className="user-list">
            {users.map(u => (
              <div key={u._id} className="user-item">
                <strong>{u.email}</strong>
                <div className="user-actions">
                  <button className="btn-view" onClick={() => fetchPrompts(u._id)}>📂 View Prompts</button>
                  <button className="btn-delete" onClick={() => deleteUser(u._id)}>🗑️ Delete User</button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="prompts-view">
          <div className="prompts-header">
            <h3>📂 Prompts by: {selectedUser.email}</h3>
            <button className="btn-back" onClick={() => { setSelectedUser(null); setPrompts([]); }}>🔙 Back to Users</button>
          </div>
          {prompts.length === 0 ? (
            <p className="no-prompts">No prompts found.</p>
          ) : (
            prompts.map(p => (
              <div key={p._id} className="prompt-item">
                <p><strong>Input:</strong> {p.userInput}</p>
                <p><strong>Response:</strong> {p.aiResponse}</p>
                <div className="prompt-actions">
                  <button className="btn-delete" onClick={() => deletePrompt(p._id)}>🗑️ Delete Prompt</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
