import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import HistoryPage from './components/HistoryPage';

import './App.css'; // global styling if needed

const App = () => {
  const [user, setUser] = useState(null);
  const [isSignup, setIsSignup] = useState(false);

  // Restore user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Clear user state on logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Store user and sync to localStorage
  const handleSetUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <Router>
      <Routes>
        {/* If not logged in */}
        {!user ? (
          <>
            <Route
              path="/signup"
              element={<Signup setUser={handleSetUser} setIsSignup={setIsSignup} />}
            />
            <Route
              path="*"
              element={<Login setUser={handleSetUser} setIsSignup={setIsSignup} />}
            />
          </>
        ) : user.isAdmin ? (
          // If admin
          <>
            <Route
              path="/admin"
              element={<AdminDashboard user={user} onLogout={handleLogout} />}
            />
            <Route
              path="*"
              element={<AdminDashboard user={user} onLogout={handleLogout} />}
            />
          </>
        ) : (
          // If normal user
          <>
            <Route
              path="/"
              element={<Dashboard user={user} onLogout={handleLogout} />}
            />
            <Route
              path="/history"
              element={<HistoryPage user={user} />}
            />
            <Route
              path="*"
              element={<Dashboard user={user} onLogout={handleLogout} />}
            />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;



// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
// import Login from './components/Login';
// import Signup from './components/Signup';
// import Dashboard from './components/Dashboard';
// import AdminDashboard from './components/AdminDashboard';
// import HistoryPage from './components/HistoryPage';
// import './App.css';

// const App = () => {
//   const [user, setUser] = useState(null);
//   const [isSignup, setIsSignup] = useState(false);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const handleLogout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//   };

//   const handleSetUser = (userData) => {
//     setUser(userData);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };

//   return (
//     <Router>
//       <Routes>
//         {!user ? (
//           <>
//             <Route path="/signup" element={<Signup setUser={handleSetUser} setIsSignup={setIsSignup} />} />
//             <Route path="*" element={<Login setUser={handleSetUser} setIsSignup={setIsSignup} />} />
//           </>
//         ) : user.isAdmin ? (
//           <>
//             <Route path="/admin" element={<AdminDashboard user={user} onLogout={handleLogout} />} />
//             <Route path="*" element={<AdminDashboard user={user} onLogout={handleLogout} />} />
//           </>
//         ) : (
//           <>
//             <Route path="/" element={<Dashboard user={user} onLogout={handleLogout} />} />
//             <Route path="/history" element={<HistoryPage user={user} />} />
//             <Route path="*" element={<Dashboard user={user} onLogout={handleLogout} />} />
//           </>
//         )}
//       </Routes>
//     </Router>
//   );
// };

// export default App;
