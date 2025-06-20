// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;
const MONGO_URL = "mongodb+srv://arunsamy2004:1234567890@translator.cgtxl2f.mongodb.net/?retryWrites=true&w=majority&appName=translator";

mongoose.connect(MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  nativeLang: String
});

const historySchema = new mongoose.Schema({
  userId: String,
  inputText: String,
  translatedText: String,
  targetLang: String,
  date: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
const History = mongoose.model("History", historySchema);

// ---------------------- Auth --------------------------
app.post("/signup", async (req, res) => {
  const { email, password, nativeLang } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) return res.status(400).json({ message: "User already exists" });

  const user = await User.create({ email, password, nativeLang });
  res.json(user);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Admin login
  if (email === "admin@gmail.com" && password === "admin12345") {
    return res.json({ role: "admin", email });
  }

  const user = await User.findOne({ email, password });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  res.json({ role: "user", user });
});

// -------------------- Translation History ---------------------
app.post("/translate", async (req, res) => {
  const { userId, inputText, translatedText, targetLang } = req.body;
  await History.create({ userId, inputText, translatedText, targetLang });
  res.json({ message: "Saved" });
});

app.get("/history/:userId", async (req, res) => {
  const history = await History.find({ userId: req.params.userId });
  res.json(history);
});

app.delete("/history/:id", async (req, res) => {
  await History.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ------------------- Admin Controls -----------------------
app.get("/admin/users", async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

app.delete("/admin/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  await History.deleteMany({ userId: req.params.id });
  res.json({ message: "User and history deleted" });
});

app.get("/admin/prompts/:userId", async (req, res) => {
  const prompts = await History.find({ userId: req.params.userId });
  res.json(prompts);
});

app.listen(PORT, () => console.log("Server running on PORT", PORT));
