import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'de', name: 'German' },
  { code: 'pl', name: 'Polish' },
  { code: 'ta', name: 'Tamil' },
  { code: 'fr', name: 'French' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'fi', name: 'Finnish' },
  { code: 'da', name: 'Danish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'cs', name: 'Czech' },
  { code: 'ro', name: 'Romanian' },
  { code: 'el', name: 'Greek' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'hr', name: 'Croatian' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'lv', name: 'Latvian' },
  { code: 'et', name: 'Estonian' }
];

const Signup = ({ setUser, setIsSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState('ta');
  const [error, setError] = useState('');
    const navigate = useNavigate(); // ✅ this line

  const handleSignup = async () => {
    try {
await axios.post(`${process.env.REACT_APP_BASE_URL}/api/signup`, {
        email,
        password,
        nativeLanguage
      });
const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/login`, {
        email,
        password
      });
      setUser(res.data);
      navigate('/'); // ✅ Add this line so user goes straight to dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

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
          max-width: 400px;
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
        .signup-card input,
        .signup-card select {
          width: 100%;
          padding: 1rem;
          margin-bottom: 1rem;
          border: none;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          font-size: 1rem;
          backdrop-filter: blur(4px);
        }
        .signup-card input::placeholder {
          color: rgba(255,255,255,0.5);
        }
        .signup-card select {
          cursor: pointer;
        }
        .signup-card button {
          width: 100%;
          padding: 0.9rem;
          background: linear-gradient(135deg, #6c5ce7, #a29bfe);
          border: none;
          border-radius: 16px;
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s ease;
          box-shadow: 0 0 15px #ec9aec;
        }
        .signup-card button:hover {
          transform: scale(1.04);
          box-shadow: 0 0 25px #ec9aec;
        }
        .signup-card p {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.9rem;
        }
        .signup-card p button {
          background: none;
          border: none;
          color: #ec9aec;
          font-weight: bold;
          cursor: pointer;
          margin-left: 0.4rem;
        }
        .signup-card p button:hover {
          text-decoration: underline;
        }
        .signup-card .error {
          background: rgba(255, 0, 0, 0.1);
          color: #ff7675;
          padding: 0.75rem;
          border-radius: 12px;
          margin-bottom: 1rem;
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

        @media (max-width: 480px) {
          .signup-card {
            padding: 2rem 1.5rem;
          }
          .signup-card h2 {
            font-size: 1.6rem;
          }
        }
          .signup-card select:focus {
  outline: none;
  background-color: rgba(255, 255, 255, 0.08);
}

.signup-card select option {
  background-color: #000; /* ✅ black dropdown list */
  color: #fff;             /* ✅ white text in list */
}

      `}</style>

      <div className="signup-card">
        <h2>Signup</h2>
        {error && <div className="error">{error}</div>}
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <select
          value={nativeLanguage}
          onChange={e => setNativeLanguage(e.target.value)}
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <button onClick={handleSignup}>Signup</button>
      <p>
  Already have an account?
  <button onClick={() => navigate('/')}>Log in</button>
</p>
      </div>
    </div>
  );
};

export default Signup;




// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const languages = [
//   { code: 'en', name: 'English' },
//   { code: 'es', name: 'Spanish' },
//   { code: 'de', name: 'German' },
//   { code: 'pl', name: 'Polish' },
//   { code: 'ta', name: 'Tamil' },
//   { code: 'fr', name: 'French' },
//   { code: 'it', name: 'Italian' },
//   { code: 'pt', name: 'Portuguese' },
//   { code: 'nl', name: 'Dutch' },
//   { code: 'sv', name: 'Swedish' },
//   { code: 'fi', name: 'Finnish' },
//   { code: 'da', name: 'Danish' },
//   { code: 'no', name: 'Norwegian' },
//   { code: 'hu', name: 'Hungarian' },
//   { code: 'cs', name: 'Czech' },
//   { code: 'ro', name: 'Romanian' },
//   { code: 'el', name: 'Greek' },
//   { code: 'bg', name: 'Bulgarian' },
//   { code: 'hr', name: 'Croatian' },
//   { code: 'sk', name: 'Slovak' },
//   { code: 'sl', name: 'Slovenian' },
//   { code: 'lt', name: 'Lithuanian' },
//   { code: 'lv', name: 'Latvian' },
//   { code: 'et', name: 'Estonian' }
// ];

// const Signup = ({ setUser, setIsSignup }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [nativeLanguage, setNativeLanguage] = useState('ta');
//   const [error, setError] = useState('');
//     const navigate = useNavigate(); // ✅ this line

//   const handleSignup = async () => {
//     try {
// await axios.post(`${process.env.REACT_APP_BASE_URL}/api/signup`, {
//         email,
//         password,
//         nativeLanguage
//       });
// const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/login`, {
//         email,
//         password
//       });
//       setUser(res.data);
//       navigate('/'); // ✅ Add this line so user goes straight to dashboard
//     } catch (err) {
//       setError(err.response?.data?.message || 'Signup failed');
//     }
//   };

//   return (
//     <div className="signup-wrapper">
//       <style>{`
//         .signup-wrapper {
//           min-height: 100vh;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           padding: 2rem;
//           background: radial-gradient(circle at 30% 30%, #0f0c29, #302b63, #24243e);
//           font-family: 'Poppins', sans-serif;
//         }
//         .signup-card {
//           background: rgba(255, 255, 255, 0.06);
//           backdrop-filter: blur(15px);
//           padding: 2.5rem 2rem;
//           border-radius: 20px;
//           width: 100%;
//           max-width: 400px;
//           color: #fff;
//           box-shadow: 0 0 25px #ec9aec;
//           animation: fadeInCard 0.9s ease-out;
//         }
//         .signup-card h2 {
//           text-align: center;
//           margin-bottom: 1.5rem;
//           color: #ec9aec;
//           font-size: 1.8rem;
//           text-shadow: 0 0 10px #fff, 0 0 20px #ec9aec;
//           animation: pulseTitle 2s infinite;
//         }
//         .signup-card input,
//         .signup-card select {
//           width: 100%;
//           padding: 1rem;
//           margin-bottom: 1rem;
//           border: none;
//           border-radius: 14px;
//           background: rgba(255, 255, 255, 0.08);
//           color: #fff;
//           font-size: 1rem;
//           backdrop-filter: blur(4px);
//         }
//         .signup-card input::placeholder {
//           color: rgba(255,255,255,0.5);
//         }
//         .signup-card select {
//           cursor: pointer;
//         }
//         .signup-card button {
//           width: 100%;
//           padding: 0.9rem;
//           background: linear-gradient(135deg, #6c5ce7, #a29bfe);
//           border: none;
//           border-radius: 16px;
//           color: #fff;
//           font-size: 1rem;
//           font-weight: 600;
//           cursor: pointer;
//           transition: 0.3s ease;
//           box-shadow: 0 0 15px #ec9aec;
//         }
//         .signup-card button:hover {
//           transform: scale(1.04);
//           box-shadow: 0 0 25px #ec9aec;
//         }
//         .signup-card p {
//           text-align: center;
//           margin-top: 1rem;
//           font-size: 0.9rem;
//         }
//         .signup-card p button {
//           background: none;
//           border: none;
//           color: #ec9aec;
//           font-weight: bold;
//           cursor: pointer;
//           margin-left: 0.4rem;
//         }
//         .signup-card p button:hover {
//           text-decoration: underline;
//         }
//         .signup-card .error {
//           background: rgba(255, 0, 0, 0.1);
//           color: #ff7675;
//           padding: 0.75rem;
//           border-radius: 12px;
//           margin-bottom: 1rem;
//           text-align: center;
//         }

//         @keyframes fadeInCard {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         @keyframes pulseTitle {
//           0% { text-shadow: 0 0 10px #fff, 0 0 20px #ec9aec; }
//           50% { text-shadow: 0 0 25px #ec9aec; }
//           100% { text-shadow: 0 0 10px #fff, 0 0 20px #ec9aec; }
//         }

//         @media (max-width: 480px) {
//           .signup-card {
//             padding: 2rem 1.5rem;
//           }
//           .signup-card h2 {
//             font-size: 1.6rem;
//           }
//         }
//       `}</style>

//       <div className="signup-card">
//         <h2>Signup</h2>
//         {error && <div className="error">{error}</div>}
//         <input
//           placeholder="Email"
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//         />
//         <select
//           value={nativeLanguage}
//           onChange={e => setNativeLanguage(e.target.value)}
//         >
//           {languages.map(lang => (
//             <option key={lang.code} value={lang.code}>
//               {lang.name}
//             </option>
//           ))}
//         </select>
//         <button onClick={handleSignup}>Signup</button>
//       <p>
//   Already have an account?
//   <button onClick={() => navigate('/')}>Log in</button>
// </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;


