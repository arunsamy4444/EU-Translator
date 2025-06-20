import React, { useState, useEffect } from "react";
import { euLanguages } from "./Languages";

export default function TranslationTest({ user, setUser }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [lang, setLang] = useState(user.nativeLang || "en");
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setLang(user.nativeLang || "en");
  }, [user]);

  const translate = async () => {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization:
          "Bearer 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",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "user", content: `Translate this to ${lang}: ${text}` },
        ],
      }),
    });

    const data = await res.json();
    const translated =
      data.choices?.[0]?.message?.content || "Translation failed.";
    setResult(translated);

    // Handle speech with voice load
    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(translated);
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("female") ||
          v.name.includes("Samantha") ||
          v.name.includes("Google")
      );
      if (femaleVoice) utterance.voice = femaleVoice;

      setSpeaking(true);
      utterance.onend = () => {
        setSpeaking(false);
        setText("");
      };

      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = speak;
    } else {
      speak();
    }

    await fetch("http://localhost:5000/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        inputText: text,
        translatedText: translated,
        targetLang: lang,
      }),
    });
  };

  const handleSpeech = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.interimResults = false;
    recog.maxAlternatives = 1;

    recog.onresult = (e) => {
      const spokenText = e.results[0][0].transcript;
      setText((prev) => prev + (prev ? " " : "") + spokenText);
    };

    recog.onerror = (e) => {
      console.error("Speech recognition error:", e.error);
      alert("Speech recognition failed: " + e.error);
    };

    recog.onend = () => {
      console.log("Speech recognition ended.");
    };

    recog.start();
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  const toggleHistory = async () => {
    if (!showHistory) {
      const res = await fetch("http://localhost:5000/history/" + user._id);
      const json = await res.json();
      setHistory(json.reverse());
    }
    setShowHistory((prev) => !prev);
  };

  return (
    <div className="translate-container">
      <div className="top-bar">
        <h2>🌍 Real-Time Translator</h2>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <div className="translate-box">
        <button className="speak-btn" onClick={handleSpeech}>
          🎙️ Speak
        </button>

        <textarea
          rows={5}
          placeholder="Type or speak your sentence here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ resize: "none" }}
        />

        <select onChange={(e) => setLang(e.target.value)} value={lang}>
          {euLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

        <button className="translate-btn" onClick={translate}>
          🔁 Translate
        </button>

        <button className="translate-btn" onClick={toggleHistory}>
          {showHistory ? "❌ Hide History" : "📜 Show History"}
        </button>

        {speaking && (
          <p style={{ color: "#0f0", marginTop: 8 }}>🔊 Speaking...</p>
        )}

        <p className="result">{result}</p>
      </div>

      {showHistory && (
        <div className="history-section">
          <h3>📘 Translation History</h3>
          {history.length === 0 ? (
            <p>No history yet.</p>
          ) : (
            history.map((item) => (
              <div key={item._id} className="history-item">
                <p>
                  <strong>From:</strong> {user.nativeLang}
                </p>
                <p>
                  <strong>To:</strong> {item.targetLang}
                </p>
                <p>
                  <strong>Input:</strong> {item.inputText}
                </p>
                <p>
                  <strong>Output:</strong> {item.translatedText}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(item.date).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      <style>{`
        body {
          background: linear-gradient(135deg, #1f1c2c, #928dab);
          font-family: 'Segoe UI', sans-serif;
          margin: 0;
          padding: 0;
        }

        .translate-container {
          max-width: 600px;
          margin: 60px auto;
          padding: 30px;
          background: rgba(30, 30, 40, 0.7);
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          animation: fadeIn 0.6s ease;
          color: #eee;
          backdrop-filter: blur(12px);
        }

      .top-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
  animation: dropFade 0.8s ease;
}

    h2 {
  margin: 0;
  font-size: 2rem;
  background: linear-gradient(to right, #4b90f7, #2575fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  text-align: center;
  animation: pulseGlow 1.8s ease-in-out infinite;
}
        .logout-btn {
  background: linear-gradient(45deg, #ff416c, #ff4b2b);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 100, 100, 0.3);
  transition: transform 0.3s ease;
}
.logout-btn:hover {
  transform: scale(1.05);
}

        .translate-box {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        input, select, textarea {
          padding: 12px;
          font-size: 1rem;
          border-radius: 6px;
          border: none;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          outline: none;
          transition: background 0.3s ease;
        }

        input::placeholder, textarea::placeholder {
          color: #bbb;
        }

        input:focus, textarea:focus, select:focus {
          background: rgba(255, 255, 255, 0.15);
        }

        select option {
          color: #000;
        }

        .speak-btn, .translate-btn {
          padding: 12px;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: white;
          background: linear-gradient(to right, #00c6ff, #0072ff);
          box-shadow: 0 6px 18px rgba(0, 128, 255, 0.3);
          transition: transform 0.2s ease;
        }

        .speak-btn:hover, .translate-btn:hover, .logout-btn:hover {
          transform: scale(1.05);
          opacity: 0.95;
        }

        .result {
          margin-top: 10px;
          font-size: 1.1rem;
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
          padding: 14px;
          border-radius: 10px;
          border-left: 5px solid #00c6ff;
          animation: fadeInResult 0.4s ease;
          word-break: break-word;
        }

        .history-section {
          margin-top: 30px;
          background: rgba(255, 255, 255, 0.05);
          padding: 20px;
          border-radius: 10px;
          color: #eee;
        }

        .history-item {
          margin-bottom: 15px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.07);
          border-radius: 8px;
        }

        /* Animation Keyframes */
@keyframes dropFade {
  from {
    opacity: 0;
    transform: translateY(-15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulseGlow {
  0%, 100% {
    text-shadow: 0 0 8px #6a11cb, 0 0 12px #2575fc;
  }
  50% {
    text-shadow: 0 0 16px #6a11cb, 0 0 20px #2575fc;
  }
}

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInResult {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .translate-container {
            padding: 20px;
            margin: 30px 16px;
          }
        }
      `}</style>
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import { euLanguages } from "./Languages";

// export default function TranslationTest({ user, setUser }) {
//   const [text, setText] = useState("");
//   const [result, setResult] = useState("");
//   const [lang, setLang] = useState(user.nativeLang || "en");
//   const [showHistory, setShowHistory] = useState(false);
//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     setLang(user.nativeLang || "en");
//   }, [user]);

//   const translate = async () => {
//     const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         Authorization:
//           "Bearer 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",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "openai/gpt-3.5-turbo",
//         messages: [{ role: "user", content: `Translate this to ${lang}: ${text}` }],
//       }),
//     });

//     const data = await res.json();
//     const translated = data.choices?.[0]?.message?.content || "Translation failed.";
//     setResult(translated);

//     // Use female voice
//     const utterance = new SpeechSynthesisUtterance(translated);
//     const voices = window.speechSynthesis.getVoices();
//     const femaleVoice = voices.find(v =>
//       v.name.toLowerCase().includes("female") ||
//       v.name.includes("Samantha") ||
//       v.name.includes("Google")
//     );
//     if (femaleVoice) utterance.voice = femaleVoice;
//     window.speechSynthesis.speak(utterance);

//     await fetch("http://localhost:5000/translate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId: user._id,
//         inputText: text,
//         translatedText: translated,
//         targetLang: lang,
//       }),
//     });
//   };

//  const handleSpeech = () => {
//   const SpeechRecognition =
//     window.SpeechRecognition || window.webkitSpeechRecognition;

//   if (!SpeechRecognition) {
//     alert("Speech recognition not supported in this browser.");
//     return;
//   }

//   const recog = new SpeechRecognition();
//   recog.lang = "en-US"; // or set to user.nativeLang
//   recog.interimResults = false;
//   recog.maxAlternatives = 1;

//   recog.onresult = (e) => {
//     const spokenText = e.results[0][0].transcript;
//     setText((prev) => prev + (prev ? " " : "") + spokenText);
//   };

//   recog.onerror = (e) => {
//     console.error("Speech recognition error:", e.error);
//     alert("Speech recognition failed: " + e.error);
//   };

//   recog.onend = () => {
//     console.log("Speech recognition ended.");
//   };

//   recog.start();
// };

//   const handleLogout = () => {
//     localStorage.clear();
//     setUser(null);
//   };

//   const toggleHistory = async () => {
//     if (!showHistory) {
//       const res = await fetch("http://localhost:5000/history/" + user._id);
//       const json = await res.json();
//       setHistory(json.reverse());
//     }
//     setShowHistory(prev => !prev);
//   };

//   return (
//     <div className="translate-container">
//       <div className="top-bar">
//         <h2>🌍 Real-Time Translator</h2>
//         <button className="logout-btn" onClick={handleLogout}>
//           🚪 Logout
//         </button>
//       </div>

//       <div className="translate-box">
//         <button className="speak-btn" onClick={handleSpeech}>
//           🎙️ Speak
//         </button>

//         {/* Bigger textarea input */}
//         <textarea
//           rows={5}
//           placeholder="Type or speak your sentence here..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           style={{ resize: "none" }}
//         />

//         <select onChange={(e) => setLang(e.target.value)} value={lang}>
//           {euLanguages.map((lang) => (
//             <option key={lang.code} value={lang.code}>
//               {lang.name}
//             </option>
//           ))}
//         </select>

//         <button className="translate-btn" onClick={translate}>
//           🔁 Translate
//         </button>

//         <button className="translate-btn" onClick={toggleHistory}>
//           {showHistory ? "❌ Hide History" : "📜 Show History"}
//         </button>

//         <p className="result">{result}</p>
//       </div>

//       {showHistory && (
//         <div className="history-section">
//           <h3>📘 Translation History</h3>
//           {history.length === 0 ? (
//             <p>No history yet.</p>
//           ) : (
//             history.map((item) => (
//               <div key={item._id} className="history-item">
//                 <p><strong>From:</strong> {user.nativeLang}</p>
//                 <p><strong>To:</strong> {item.targetLang}</p>
//                 <p><strong>Input:</strong> {item.inputText}</p>
//                 <p><strong>Output:</strong> {item.translatedText}</p>
//                 <p><strong>Date:</strong> {new Date(item.date).toLocaleString()}</p>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     <style>{`
//         body {
//           background: linear-gradient(135deg, #1f1c2c, #928dab);
//           font-family: 'Segoe UI', sans-serif;
//           margin: 0;
//           padding: 0;
//         }

//         .translate-container {
//           max-width: 600px;
//           margin: 60px auto;
//           padding: 30px;
//           background: rgba(30, 30, 40, 0.7);
//           border-radius: 20px;
//           box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
//           animation: fadeIn 0.6s ease;
//           color: #eee;
//           backdrop-filter: blur(12px);
//         }

//         .top-bar {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 25px;
//         }

//         h2 {
//           margin: 0;
//           font-size: 1.8rem;
//           background: linear-gradient(to right, #6a11cb, #2575fc);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           font-weight: bold;
//         }

//         .logout-btn {
//           background: linear-gradient(45deg, #ff416c, #ff4b2b);
//           color: white;
//           border: none;
//           padding: 8px 16px;
//           border-radius: 8px;
//           font-weight: bold;
//           cursor: pointer;
//           box-shadow: 0 4px 12px rgba(255, 100, 100, 0.3);
//         }

//         .translate-box {
//           display: flex;
//           flex-direction: column;
//           gap: 15px;
//         }

//         input, select {
//           padding: 12px;
//           font-size: 1rem;
//           border-radius: 6px;
//           border: none;
//           background: rgba(255, 255, 255, 0.1);
//           color: #fff;
//           outline: none;
//           transition: background 0.3s ease;
//         }

//         input::placeholder {
//           color: #bbb;
//         }

//         input:focus, select:focus {
//           background: rgba(255, 255, 255, 0.15);
//         }

//         select option {
//           color: #000;
//         }

//         .speak-btn, .translate-btn {
//           padding: 12px;
//           font-weight: bold;
//           border: none;
//           border-radius: 8px;
//           cursor: pointer;
//           color: white;
//           background: linear-gradient(to right, #00c6ff, #0072ff);
//           box-shadow: 0 6px 18px rgba(0, 128, 255, 0.3);
//           transition: transform 0.2s ease;
//         }

//         .speak-btn:hover, .translate-btn:hover, .logout-btn:hover {
//           transform: scale(1.05);
//           opacity: 0.95;
//         }

//         .result {
//           margin-top: 10px;
//           font-size: 1.1rem;
//           color: #fff;
//           background: rgba(255, 255, 255, 0.1);
//           padding: 14px;
//           border-radius: 10px;
//           border-left: 5px solid #00c6ff;
//           animation: fadeInResult 0.4s ease;
//           word-break: break-word;
//         }

//         .history-section {
//           margin-top: 30px;
//           background: rgba(255, 255, 255, 0.05);
//           padding: 20px;
//           border-radius: 10px;
//           color: #eee;
//         }

//         .history-item {
//           margin-bottom: 15px;
//           padding: 10px;
//           background: rgba(255, 255, 255, 0.07);
//           border-radius: 8px;
//         }

//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(15px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         @keyframes fadeInResult {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         @media (max-width: 600px) {
//           .translate-container {
//             padding: 20px;
//             margin: 30px 16px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
