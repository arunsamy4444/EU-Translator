import React, { useState, useRef } from "react";
import axios from "axios";
import History from "./History";
import { useNavigate } from "react-router-dom";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "pl", name: "Polish" },
  { code: "ta", name: "Tamil" },
  { code: "fr", name: "French" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "nl", name: "Dutch" },
  { code: "sv", name: "Swedish" },
  { code: "fi", name: "Finnish" },
  { code: "da", name: "Danish" },
  { code: "no", name: "Norwegian" },
  { code: "hu", name: "Hungarian" },
  { code: "cs", name: "Czech" },
  { code: "ro", name: "Romanian" },
  { code: "el", name: "Greek" },
  { code: "bg", name: "Bulgarian" },
  { code: "hr", name: "Croatian" },
  { code: "sk", name: "Slovak" },
  { code: "sl", name: "Slovenian" },
  { code: "lt", name: "Lithuanian" },
  { code: "lv", name: "Latvian" },
  { code: "et", name: "Estonian" },
];



const TranslatorBox = ({ user }) => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedOutputLang, setSelectedOutputLang] = useState("en");
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);
  const navigate = useNavigate();

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = user.nativeLanguage || "en-US";
    recognition.interimResults = false;

    recognition.onresult = (e) => {
      setInputText(e.results[0][0].transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  };
  // 🎤 Stop Listening
  const stopVoice = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      setIsListening(false);
    }
    speechSynthesis.cancel();
  };

  // 🌍 Translate and Speak
  const handleTranslate = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/translate", {
        userId: user._id,
        text: inputText,
        inputLanguage: user.nativeLanguage || "en",
        outputLanguage: selectedOutputLang,
      });

      const translatedText = res.data.translatedText;
      setOutputText(translatedText);

      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = selectedOutputLang;

      // 🎯 After voice playback ends → clear input
      utterance.onend = () => {
        setInputText("");
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    } catch (err) {
      setOutputText("Translation failed");
      console.error(err);
    }
  };

  return (
    <div className="translator-wrapper">
      <style>{`
        .translator-wrapper {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          background: radial-gradient(circle at 30% 30%, #0f0c29, #302b63, #24243e);
          font-family: 'Poppins', sans-serif;
        }
        .translator-card {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(15px);
          padding: 2.5rem 2rem;
          border-radius: 20px;
          width: 100%;
          max-width: 600px;
          color: #fff;
          box-shadow: 0 0 25px #ec9aec;
          animation: fadeInCard 0.9s ease-out;
        }
        .translator-card h2 {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #ec9aec;
          font-size: 1.8rem;
          text-shadow: 0 0 10px #fff, 0 0 20px #ec9aec;
          animation: pulseTitle 2s infinite;
        }
        .translator-card textarea {
          width: 100%;
          height: 100px;
          padding: 1rem;
          margin-bottom: 1rem;
          border: none;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          font-size: 1rem;
          resize: none;
          backdrop-filter: blur(4px);
        }
        .translator-card textarea::placeholder {
          color: rgba(255,255,255,0.5);
        }
        .translator-card select,
        .translator-card button {
          width: 100%;
          padding: 0.9rem;
          margin-bottom: 1rem;
          border: none;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-speak,
        .btn-translate,
        .btn-stop,
        .btn-history {
          background: linear-gradient(135deg, #6c5ce7, #a29bfe);
          color: #fff;
          box-shadow: 0 0 15px #ec9aec;
          transition: 0.3s ease;
        }
        .btn-speak:hover,
        .btn-translate:hover,
        .btn-stop:hover,
        .btn-history:hover {
          transform: scale(1.04);
          box-shadow: 0 0 25px #ec9aec;
        }
        .translator-card .output {
          margin-top: 1rem;
          text-align: center;
          font-size: 1.1rem;
          font-weight: bold;
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
          .translator-card {
            padding: 2rem 1.5rem;
          }
          .translator-card h2 {
            font-size: 1.6rem;
          }
        }
      `}</style>

      <div className="translator-card">
        <h2>Translator</h2>
        <button className="btn-stop" onClick={stopVoice}>
          🛑 Stop Voice
        </button>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or speak..."
        />
        <button className="btn-speak" onClick={startListening}>
          {isListening ? "Listening..." : "🎤 Speak"}
        </button>
        <select
          value={selectedOutputLang}
          onChange={(e) => setSelectedOutputLang(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <button className="btn-translate" onClick={handleTranslate}>
          Translate
        </button>

        <div className="output">{outputText}</div>

        <button className="btn-history" onClick={() => navigate("/history")}>
          View Translation History
        </button>
      </div>
    </div>
  );
  // return (
  //   <div>
  //     <button className="btn-stop" onClick={stopVoice}>
  //       🛑 Stop Voice
  //     </button>

  //     <textarea
  //       value={inputText}
  //       onChange={(e) => setInputText(e.target.value)}
  //       placeholder="Type or speak..."
  //     />
  //     <button className="btn-speak" onClick={startListening}>
  //       {isListening ? "Listening..." : "🎤 Speak"}
  //     </button>
  //     <select
  //       value={selectedOutputLang}
  //       onChange={(e) => setSelectedOutputLang(e.target.value)}
  //     >
  //       {languages.map((lang) => (
  //         <option key={lang.code} value={lang.code}>
  //           {lang.name}
  //         </option>
  //       ))}
  //     </select>

  //     <button className="btn-translate" onClick={handleTranslate}>
  //       Translate
  //     </button>

  //     <div style={{ marginTop: "10px", fontWeight: "bold" }}>{outputText}</div>

  //     <button className="btn-history" onClick={() => navigate("/history")}>
  //       View Translation History
  //     </button>
      
  //   </div>
  // );
};

export default TranslatorBox;
