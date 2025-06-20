import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [showPrompts, setShowPrompts] = useState(false);
  const [activeUserId, setActiveUserId] = useState(null);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/admin/users");
    const json = await res.json();
    setUsers(json);
  };

  const delUser = async (id) => {
    await fetch("http://localhost:5000/admin/users/" + id, { method: "DELETE" });
    fetchUsers();
    setPrompts([]);
    setShowPrompts(false);
  };

  const viewPrompts = async (userId) => {
    // Toggle same user (hide if already active)
    if (showPrompts && activeUserId === userId) {
      setShowPrompts(false);
      setPrompts([]);
      setActiveUserId(null);
      return;
    }

    const res = await fetch("http://localhost:5000/admin/prompts/" + userId);
    const json = await res.json();
    setPrompts(json);
    setShowPrompts(true);
    setActiveUserId(userId);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload(); // redirect to login
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2 className="admin-title">🛠️ Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </div>

      <div className="user-list">
        {users.map((u) => (
          <div key={u._id} className="user-card">
            <div className="user-info">
              <p><strong>📧 Email:</strong> {u.email}</p>
              <p><strong>🗣️ Native Lang:</strong> {u.nativeLang}</p>
            </div>
            <div className="btn-group">
              <button onClick={() => delUser(u._id)} className="btn danger">Delete</button>
              <button onClick={() => viewPrompts(u._id)} className="btn view">
                {showPrompts && activeUserId === u._id ? "Hide Prompts" : "View Prompts"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showPrompts && prompts.length > 0 && (
        <div className="prompt-section">
          <h3>📜 Prompt History</h3>
          <ul>
            {prompts.map((p) => (
              <li key={p._id}>
                <code>{p.inputText}</code> <b>→</b> <code>{p.translatedText}</code>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        .admin-container {
          max-width: 960px;
          margin: 60px auto;
          padding: 40px;
          border-radius: 20px;
          background: rgba(30, 30, 40, 0.85);
          backdrop-filter: blur(12px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          color: #eee;
          animation: fadeIn 0.6s ease;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .admin-title {
          font-size: 2.5rem;
          background: linear-gradient(to right, #00c6ff, #0072ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

   .logout-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(45deg, #f12711, #f5af19);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.logout-btn:hover {
  transform: scale(1.05);
  opacity: 0.9;
}


        .user-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .user-card {
          background: rgba(255,255,255,0.05);
          padding: 20px 25px;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.2);
          transition: transform 0.3s ease;
        }

        .user-card:hover {
          transform: translateY(-4px);
        }

        .user-info p {
          margin: 6px 0;
          font-size: 1rem;
        }

        .btn-group {
          display: flex;
          gap: 12px;
        }

        .btn {
          padding: 10px 18px;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .btn.view {
          background: linear-gradient(45deg, #06beb6, #48b1bf);
          color: white;
        }

        .btn.danger {
          background: linear-gradient(to right, #ff416c, #ff4b2b);
          color: white;
        }

        .btn:hover {
          transform: scale(1.05);
          opacity: 0.9;
        }

        .prompt-section {
          margin-top: 50px;
          padding: 20px;
          background: rgba(255,255,255,0.06);
          border-radius: 14px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        .prompt-section h3 {
          margin-bottom: 18px;
          color: #fff;
        }

        .prompt-section ul {
          list-style: none;
          padding-left: 0;
        }

        .prompt-section li {
          background: rgba(0, 0, 0, 0.2);
          margin-bottom: 10px;
          padding: 10px;
          border-left: 4px solid #0072ff;
          border-radius: 6px;
          font-family: monospace;
          font-size: 0.95rem;
          color: #e0f7fa;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            gap: 16px;
          }

          .user-card {
            flex-direction: column;
            align-items: flex-start;
          }

          .btn-group {
            width: 100%;
            justify-content: flex-start;
          }

          .btn {
            width: 100%;
          }
        }
     `}</style>
    </div>
  );
}


// import React, { useEffect, useState } from "react";

// export default function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [prompts, setPrompts] = useState([]);

//   const fetchUsers = async () => {
//     const res = await fetch("http://localhost:5000/admin/users");
//     const json = await res.json();
//     setUsers(json);
//   };

//   const delUser = async (id) => {
//     await fetch("http://localhost:5000/admin/users/" + id, { method: "DELETE" });
//     fetchUsers();
//     setPrompts([]);
//   };

//   const viewPrompts = async (userId) => {
//     const res = await fetch("http://localhost:5000/admin/prompts/" + userId);
//     const json = await res.json();
//     setPrompts(json);
//   };
//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.reload(); // redirect to login
//   };
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return (
//        <div className="admin-container">
//       <div className="admin-header">
//         <h2 className="admin-title">🛠️ Admin Dashboard</h2>
//         <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
//       </div>

//       <div className="user-list">
//         {users.map((u) => (
//           <div key={u._id} className="user-card">
//             <div className="user-info">
//               <p><strong>📧 Email:</strong> {u.email}</p>
//               <p><strong>🗣️ Native Lang:</strong> {u.nativeLang}</p>
//             </div>
//             <div className="btn-group">
//               <button onClick={() => delUser(u._id)} className="btn danger">Delete</button>
//               <button onClick={() => viewPrompts(u._id)} className="btn view">View Prompts</button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {prompts.length > 0 && (
//         <div className="prompt-section">
//           <h3>📜 Prompt History</h3>
//           <ul>
//             {prompts.map((p) => (
//               <li key={p._id}>
//                 <code>{p.inputText}</code> <b>→</b> <code>{p.translatedText}</code>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <style>{`
//         .admin-container {
//           max-width: 960px;
//           margin: 60px auto;
//           padding: 40px;
//           border-radius: 20px;
//           background: rgba(30, 30, 40, 0.85);
//           backdrop-filter: blur(12px);
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
//           color: #eee;
//           animation: fadeIn 0.6s ease;
//         }

//         .admin-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 30px;
//         }

//         .admin-title {
//           font-size: 2.5rem;
//           background: linear-gradient(to right, #00c6ff, #0072ff);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }

//         .logout-btn {
//           background: linear-gradient(45deg, #f12711, #f5af19);
//           color: white;
//           border: none;
//           padding: 10px 18px;
//           border-radius: 8px;
//           font-weight: bold;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         .logout-btn:hover {
//           transform: scale(1.05);
//           opacity: 0.9;
//         }

//         .user-list {
//           display: flex;
//           flex-direction: column;
//           gap: 20px;
//         }

//         .user-card {
//           background: rgba(255,255,255,0.05);
//           padding: 20px 25px;
//           border-radius: 12px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           box-shadow: 0 4px 14px rgba(0,0,0,0.2);
//           transition: transform 0.3s ease;
//         }

//         .user-card:hover {
//           transform: translateY(-4px);
//         }

//         .user-info p {
//           margin: 6px 0;
//           font-size: 1rem;
//         }

//         .btn-group {
//           display: flex;
//           gap: 12px;
//         }

//         .btn {
//           padding: 10px 18px;
//           font-weight: bold;
//           border: none;
//           border-radius: 8px;
//           cursor: pointer;
//           transition: transform 0.2s ease;
//         }

//         .btn.view {
//           background: linear-gradient(45deg, #06beb6, #48b1bf);
//           color: white;
//         }

//         .btn.danger {
//           background: linear-gradient(to right, #ff416c, #ff4b2b);
//           color: white;
//         }

//         .btn:hover {
//           transform: scale(1.05);
//           opacity: 0.9;
//         }

//         .prompt-section {
//           margin-top: 50px;
//           padding: 20px;
//           background: rgba(255,255,255,0.06);
//           border-radius: 14px;
//           box-shadow: 0 4px 20px rgba(0,0,0,0.15);
//         }

//         .prompt-section h3 {
//           margin-bottom: 18px;
//           color: #fff;
//         }

//         .prompt-section ul {
//           list-style: none;
//           padding-left: 0;
//         }

//         .prompt-section li {
//           background: rgba(0, 0, 0, 0.2);
//           margin-bottom: 10px;
//           padding: 10px;
//           border-left: 4px solid #0072ff;
//           border-radius: 6px;
//           font-family: monospace;
//           font-size: 0.95rem;
//           color: #e0f7fa;
//         }

//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(15px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         @media (max-width: 768px) {
//           .admin-header {
//             flex-direction: column;
//             gap: 16px;
//           }

//           .user-card {
//             flex-direction: column;
//             align-items: flex-start;
//           }

//           .btn-group {
//             width: 100%;
//             justify-content: flex-start;
//           }

//           .btn {
//             width: 100%;
//           }
//         }
//       `}</style>
//     </div>
//     // <div className="admin-container">
//     //   <h2 className="admin-title">🛠️ Admin Dashboard</h2>

//     //   <div className="user-list">
//     //     {users.map((u) => (
//     //       <div key={u._id} className="user-card">
//     //         <div className="user-info">
//     //           <p><strong>📧 Email:</strong> {u.email}</p>
//     //           <p><strong>🗣️ Native Lang:</strong> {u.nativeLang}</p>
//     //         </div>
//     //         <div className="btn-group">
//     //           <button onClick={() => delUser(u._id)} className="btn danger">Delete</button>
//     //           <button onClick={() => viewPrompts(u._id)} className="btn view">View Prompts</button>
//     //         </div>
//     //       </div>
//     //     ))}
//     //   </div>

//     //   {prompts.length > 0 && (
//     //     <div className="prompt-section">
//     //       <h3>📜 Prompt History</h3>
//     //       <ul>
//     //         {prompts.map((p) => (
//     //           <li key={p._id}>
//     //             <code>{p.inputText}</code> <b>→</b> <code>{p.translatedText}</code>
//     //           </li>
//     //         ))}
//     //       </ul>
//     //     </div>
//     //   )}

//     //   <style>{`
//     //     .admin-container {
//     //       max-width: 960px;
//     //       margin: 60px auto;
//     //       padding: 40px;
//     //       border-radius: 20px;
//     //       background: rgba(30, 30, 40, 0.85);
//     //       backdrop-filter: blur(12px);
//     //       box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
//     //       color: #eee;
//     //       animation: fadeIn 0.6s ease;
//     //     }

//     //     .admin-title {
//     //       text-align: center;
//     //       font-size: 2.8rem;
//     //       background: linear-gradient(to right, #00c6ff, #0072ff);
//     //       -webkit-background-clip: text;
//     //       -webkit-text-fill-color: transparent;
//     //       margin-bottom: 40px;
//     //     }

//     //     .user-list {
//     //       display: flex;
//     //       flex-direction: column;
//     //       gap: 20px;
//     //     }

//     //     .user-card {
//     //       background: rgba(255,255,255,0.05);
//     //       padding: 20px 25px;
//     //       border-radius: 12px;
//     //       display: flex;
//     //       justify-content: space-between;
//     //       align-items: center;
//     //       box-shadow: 0 4px 14px rgba(0,0,0,0.2);
//     //       transition: transform 0.3s ease;
//     //     }

//     //     .user-card:hover {
//     //       transform: translateY(-4px);
//     //     }

//     //     .user-info p {
//     //       margin: 6px 0;
//     //       font-size: 1rem;
//     //     }

//     //     .btn-group {
//     //       display: flex;
//     //       gap: 12px;
//     //     }

//     //     .btn {
//     //       padding: 10px 18px;
//     //       font-weight: bold;
//     //       border: none;
//     //       border-radius: 8px;
//     //       cursor: pointer;
//     //       transition: transform 0.2s ease;
//     //     }

//     //     .btn.view {
//     //       background: linear-gradient(45deg, #06beb6, #48b1bf);
//     //       color: white;
//     //     }

//     //     .btn.danger {
//     //       background: linear-gradient(to right, #ff416c, #ff4b2b);
//     //       color: white;
//     //     }

//     //     .btn:hover {
//     //       transform: scale(1.05);
//     //       opacity: 0.9;
//     //     }

//     //     .prompt-section {
//     //       margin-top: 50px;
//     //       padding: 20px;
//     //       background: rgba(255,255,255,0.06);
//     //       border-radius: 14px;
//     //       box-shadow: 0 4px 20px rgba(0,0,0,0.15);
//     //     }

//     //     .prompt-section h3 {
//     //       margin-bottom: 18px;
//     //       color: #fff;
//     //     }

//     //     .prompt-section ul {
//     //       list-style: none;
//     //       padding-left: 0;
//     //     }

//     //     .prompt-section li {
//     //       background: rgba(0, 0, 0, 0.2);
//     //       margin-bottom: 10px;
//     //       padding: 10px;
//     //       border-left: 4px solid #0072ff;
//     //       border-radius: 6px;
//     //       font-family: monospace;
//     //       font-size: 0.95rem;
//     //       color: #e0f7fa;
//     //     }

//     //     @keyframes fadeIn {
//     //       from { opacity: 0; transform: translateY(15px); }
//     //       to { opacity: 1; transform: translateY(0); }
//     //     }

//     //     @media (max-width: 768px) {
//     //       .user-card {
//     //         flex-direction: column;
//     //         align-items: flex-start;
//     //         gap: 12px;
//     //       }

//     //       .btn-group {
//     //         width: 100%;
//     //         justify-content: flex-start;
//     //       }

//     //       .btn {
//     //         width: 100%;
//     //       }
//     //     }
//     //   `}</style>
//     // </div>
//   );
// }
