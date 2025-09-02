import React, { useState, useRef } from "react";
import axios from "axios";
import History from "./History";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../styles/TranslatorBox.css'

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

const DAILY_LIMIT = 50;
const BASE_URL =  "http://localhost:10000"  ||   process.env.REACT_APP_BASE_URL 

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
    if (!inputText.trim()) return toast.error("Enter some text to translate!");

    try {
      const res = await axios.post(`${BASE_URL}/api/translate`, {
        userId: user._id,
        text: inputText,
        inputLanguage: user.nativeLanguage || "en",
        outputLanguage: selectedOutputLang,
      });

      const translatedText = res.data.translatedText;
      setOutputText(translatedText);

      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = selectedOutputLang;
      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);

      const remaining = res.data.remaining ?? (DAILY_LIMIT - 1);
      toast.success(`Translation successful! 📝 Remaining today: ${remaining}`);
    } catch (err) {
      const isLimitReached = err.response?.data?.error?.includes("Daily translation limit");
      const message = isLimitReached
        ? `🚫 Daily API limit (${DAILY_LIMIT}) reached. Try again tomorrow.`
        : `❌ Translation failed.`;

      toast.error(message);
      setOutputText(message);
    }
  };


  return (
    <div className="translator-wrapper">
        <ToastContainer position="top-right" autoClose={3000} />


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

 {outputText && (
  <div className="output-box">
    <label>📝 Translated Output:</label>
    <div className="output-text">{outputText}</div>
  </div>
)}


        <button className="btn-history" onClick={() => navigate("/history")}>
          View Translation History
        </button>
      </div>
    </div>
  );
 
};

export default TranslatorBox;
