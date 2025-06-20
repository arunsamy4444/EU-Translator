import React, { useState, useEffect } from "react";
import { euLanguages } from "./Languages";

export default function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nativeLang, setNativeLang] = useState("");
  const [alertMsg, setAlertMsg] = useState(null); // For success/error alert
  const [alertType, setAlertType] = useState("success"); // "success" or "error"

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedEmail = localStorage.getItem("authEmail");
    const savedPassword = localStorage.getItem("authPassword");
    const savedLang = localStorage.getItem("authLang");

    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
    if (savedLang) setNativeLang(savedLang);
  }, [setUser]);

  const handleAuth = async () => {
    const url = isLogin ? "/login" : "/signup";
    const body = isLogin ? { email, password } : { email, password, nativeLang };

    try {
      const res = await fetch("http://localhost:5000" + url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data);
        setAlertMsg(isLogin ? "✅ Login successful!" : "🎉 Signup successful!");
        setAlertType("success");

        localStorage.setItem("loggedInUser", JSON.stringify(data));
        localStorage.setItem("authEmail", email);
        localStorage.setItem("authPassword", password);
        if (!isLogin) localStorage.setItem("authLang", nativeLang);
      } else {
        setAlertMsg(data.message || "Auth failed");
        setAlertType("error");
      }

      setTimeout(() => setAlertMsg(null), 3000);
    } catch (err) {
      setAlertMsg("Server error. Try again later.");
      setAlertType("error");
      setTimeout(() => setAlertMsg(null), 3000);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{isLogin ? "Login" : "Signup"}</h2>

        {alertMsg && (
          <div className={`alert ${alertType}`}>
            {alertMsg}
          </div>
        )}

        <div className="form-group">
          <input
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            required
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {!isLogin && (
          <div className="form-group">
            <select
              value={nativeLang}
              onChange={(e) => setNativeLang(e.target.value)}
            >
              <option disabled value="">Select your native language</option>
              {euLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button className="auth-button" onClick={handleAuth}>
          {isLogin ? "Login" : "Signup"}
        </button>

        <p className="toggle-auth" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need to register?" : "Already have account?"}
        </p>
      </div>
    <style>{`
        body {
          background: linear-gradient(145deg, #1e3c72, #2a5298);
          margin: 0;
          font-family: 'Segoe UI', sans-serif;
        }

        .auth-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(to right, #232526, #414345);
          padding: 20px;
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.08);
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(12px);
          width: 100%;
          max-width: 400px;
          text-align: center;
          color: #fff;
          animation: fadeIn 0.8s ease;
        }

        .auth-title {
          font-size: 28px;
          margin-bottom: 24px;
          font-weight: bold;
          letter-spacing: 1px;
        }

        .form-group {
          margin-bottom: 18px;
          position: relative;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px 14px;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
          outline: none;
          transition: all 0.3s ease;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
        }

        .form-group input::placeholder {
          color: #ccc;
        }

        .form-group input:focus,
        .form-group select:focus {
          background: rgba(255, 255, 255, 0.2);
        }

        .auth-button {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #00b4db, #0083b0);
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: bold;
          color: #fff;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .auth-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 123, 255, 0.5);
        }

        .toggle-auth {
          margin-top: 18px;
          font-size: 14px;
          color: #aad4ff;
          cursor: pointer;
          transition: color 0.3s;
        }

        .toggle-auth:hover {
          color: #fff;
          text-decoration: underline;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 24px;
          }

          .auth-title {
            font-size: 22px;
          }

          .form-group input,
          .form-group select {
            font-size: 14px;
          }

          .auth-button {
            font-size: 15px;
          }
        }
      `}</style>
  
    </div>
  );
}



// import React, { useState, useEffect } from "react";
// import { euLanguages } from "./Languages";

// export default function Auth({ setUser }) {
//   const [isLogin, setIsLogin] = useState(true);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [nativeLang, setNativeLang] = useState("");

//   // Auto-login if saved
//   useEffect(() => {
//     const savedUser = localStorage.getItem("loggedInUser");
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }

//     // For display in form (optional)
//     const savedEmail = localStorage.getItem("authEmail");
//     const savedPassword = localStorage.getItem("authPassword");
//     const savedLang = localStorage.getItem("authLang");

//     if (savedEmail) setEmail(savedEmail);
//     if (savedPassword) setPassword(savedPassword);
//     if (savedLang) setNativeLang(savedLang);
//   }, [setUser]);

//   const handleAuth = async () => {
//     const url = isLogin ? "/login" : "/signup";
//     const body = isLogin ? { email, password } : { email, password, nativeLang };

//     const res = await fetch("http://localhost:5000" + url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       setUser(data);

//       // Save user & credentials for persistence
//       localStorage.setItem("loggedInUser", JSON.stringify(data));
//       localStorage.setItem("authEmail", email);
//       localStorage.setItem("authPassword", password);
//       if (!isLogin) localStorage.setItem("authLang", nativeLang);
//     } else {
//       alert(data.message || "Auth failed");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h2 className="auth-title">{isLogin ? "Login" : "Signup"}</h2>

//         <div className="form-group">
//           <input
//             required
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>

//         <div className="form-group">
//           <input
//             required
//             placeholder="Password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>

//         {!isLogin && (
//           <div className="form-group">
//             <select
//               value={nativeLang}
//               onChange={(e) => setNativeLang(e.target.value)}
//             >
//               <option disabled value="">Select your native language</option>
//               {euLanguages.map((lang) => (
//                 <option key={lang.code} value={lang.code}>
//                   {lang.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         <button className="auth-button" onClick={handleAuth}>
//           {isLogin ? "Login" : "Signup"}
//         </button>

//         <p className="toggle-auth" onClick={() => setIsLogin(!isLogin)}>
//           {isLogin ? "Need to register?" : "Already have account?"}
//         </p>
//       </div>
//       <style>{`
//         body {
//           background: linear-gradient(145deg, #1e3c72, #2a5298);
//           margin: 0;
//           font-family: 'Segoe UI', sans-serif;
//         }

//         .auth-container {
//           min-height: 100vh;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           background: linear-gradient(to right, #232526, #414345);
//           padding: 20px;
//         }

//         .auth-card {
//           background: rgba(255, 255, 255, 0.08);
//           padding: 40px;
//           border-radius: 16px;
//           box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
//           backdrop-filter: blur(12px);
//           width: 100%;
//           max-width: 400px;
//           text-align: center;
//           color: #fff;
//           animation: fadeIn 0.8s ease;
//         }

//         .auth-title {
//           font-size: 28px;
//           margin-bottom: 24px;
//           font-weight: bold;
//           letter-spacing: 1px;
//         }

//         .form-group {
//           margin-bottom: 18px;
//           position: relative;
//         }

//         .form-group input,
//         .form-group select {
//           width: 100%;
//           padding: 12px 14px;
//           border: none;
//           border-radius: 10px;
//           font-size: 15px;
//           background: rgba(255, 255, 255, 0.15);
//           color: #fff;
//           outline: none;
//           transition: all 0.3s ease;
//           box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
//         }

//         .form-group input::placeholder {
//           color: #ccc;
//         }

//         .form-group input:focus,
//         .form-group select:focus {
//           background: rgba(255, 255, 255, 0.2);
//         }

//         .auth-button {
//           width: 100%;
//           padding: 12px;
//           background: linear-gradient(135deg, #00b4db, #0083b0);
//           border: none;
//           border-radius: 12px;
//           font-size: 16px;
//           font-weight: bold;
//           color: #fff;
//           cursor: pointer;
//           transition: transform 0.3s ease, box-shadow 0.3s ease;
//         }

//         .auth-button:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 6px 16px rgba(0, 123, 255, 0.5);
//         }

//         .toggle-auth {
//           margin-top: 18px;
//           font-size: 14px;
//           color: #aad4ff;
//           cursor: pointer;
//           transition: color 0.3s;
//         }

//         .toggle-auth:hover {
//           color: #fff;
//           text-decoration: underline;
//         }

//         @keyframes fadeIn {
//           from { opacity: 0; transform: scale(0.95); }
//           to { opacity: 1; transform: scale(1); }
//         }

//         @media (max-width: 480px) {
//           .auth-card {
//             padding: 24px;
//           }

//           .auth-title {
//             font-size: 22px;
//           }

//           .form-group input,
//           .form-group select {
//             font-size: 14px;
//           }

//           .auth-button {
//             font-size: 15px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
