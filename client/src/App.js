import React, { useState } from "react";
import TranslationTest from "./components/TranslationTest";
import Auth from "./components/Auth";
import AdminDashboard from "./components/AdminDashboard";
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  if (!user) return <Auth setUser={setUser} />;

  if (user.role === "admin") return <AdminDashboard />;

  return (
    <div>

      <TranslationTest user={user.user} setUser={setUser} />
    </div>
  );
}

export default App;



// import React, { useState } from "react";
// import TranslationTest from "./components/TranslationTest";
// import Auth from "./components/Auth";
// import History from "./components/History";
// import AdminDashboard from "./components/AdminDashboard";
// import './App.css';


// function App() {
//   const [user, setUser] = useState(null);

//   if (!user) return <Auth setUser={setUser} />;

//   if (user.role === "admin") return <AdminDashboard />;

//   return (
//     <div>
//       <h1>🌍 Translator App</h1>
//       <TranslationTest user={user.user} />
//       {/* <History user={user.user} /> */}
      
//     </div>
//   );
// }

// export default App;
