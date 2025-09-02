require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const axios = require('axios');
const cors = require('cors');

const app = express();

const allowedOrigins = [
  "https://eu-translator.vercel.app", // production frontend - priority
  "http://localhost:3000",             // local testing
  "http://127.0.0.1:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, curl)
    if (!origin) return callback(null, true);

    // prioritize live URL
    if (origin === "https://eu-translator.vercel.app") return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true
}));




app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nativeLanguage: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const promptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userInput: { type: String, required: true },
  aiResponse: { type: String, required: true },
  inputLanguage: { type: String, required: true },
  outputLanguage: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Prompt = mongoose.model('Prompt', promptSchema);

// Admin credentials
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin';

const isAdmin = (req, res, next) => {
  const email = req.headers['x-admin-email'];
  const password = req.headers['x-admin-password'];
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) return next();
  res.status(403).json({ message: 'Forbidden: Admin only' });
};

app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, nativeLanguage } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, nativeLanguage });
    await user.save();
    console.log('User created:', email); // ✅ debug
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error('Signup error:', err.message); // ✅ log error
    res.status(400).json({ message: err.message });
  }
});


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) return res.json({ isAdmin: true, email });
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ isAdmin: false, _id: user._id, email: user.email, nativeLanguage: user.nativeLanguage });
});


app.post('/api/translate', async (req, res) => {
  try {
    const { userId, text, inputLanguage = 'en', outputLanguage } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });

    // 📅 Get start of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🧾 Count all translations today (global)
    const totalToday = await Prompt.countDocuments({
      createdAt: { $gte: today }
    });

    // 🚫 If 50 or more, block all users
    const GLOBAL_DAILY_LIMIT = 50;
    if (totalToday >= GLOBAL_DAILY_LIMIT) {
      return res.status(429).json({ error: `Daily translation limit (${GLOBAL_DAILY_LIMIT}) for all users reached. Try again tomorrow.` });
    }

    // ✅ Proceed with translation
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              { text: `Translate this text from ${inputLanguage} to ${outputLanguage}: "${text}"` }
            ]
          }
        ]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const translatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Translation failed';

    // 💾 Save the translation
    await new Prompt({
      userId,
      userInput: text,
      aiResponse: translatedText,
      inputLanguage,
      outputLanguage
    }).save();

    res.json({ translatedText, remaining: GLOBAL_DAILY_LIMIT - (totalToday + 1) });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      error: 'Translation failed',
      details: err.response?.data?.error?.message || err.message
    });
  }
});



app.get('/api/prompts/:userId', async (req, res) => {
  const prompts = await Prompt.find({ userId: req.params.userId }).sort({ createdAt: -1 });
  res.json(prompts);
});

app.delete('/api/prompts/:userId/:id', async (req, res) => {
  await Prompt.deleteOne({ _id: req.params.id, userId: req.params.userId });
  res.json({ message: 'Prompt deleted' });
});

// Fetch all users (non-admin)
app.get('/api/admin/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({ email: { $ne: ADMIN_EMAIL } }).select('-password'); // hide passwords
    res.json(users);
  } catch (err) {
    console.error('Admin fetch users error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// Delete user by ID (admin only)
app.delete('/api/admin/users/:id', isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Prompt.deleteMany({ userId: req.params.id });
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Admin delete user error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch all prompts (admin only)
app.get('/api/admin/prompts', isAdmin, async (req, res) => {
  try {
    const prompts = await Prompt.find()
      .populate('userId', 'email') // include user email only
      .sort({ createdAt: -1 });
    res.json(prompts);
  } catch (err) {
    console.error('Admin fetch prompts error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a specific prompt (admin only)
app.delete('/api/admin/prompts/:id', isAdmin, async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) return res.status(404).json({ message: 'Prompt not found' });

    await Prompt.findByIdAndDelete(req.params.id);
    res.json({ message: 'Prompt deleted' });
  } catch (err) {
    console.error('Admin delete prompt error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(process.env.PORT || 5000, () => console.log('Server started'));
