require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'https://eu-translator-zdtn.vercel.app',
  credentials: true,
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

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin';

const isAdmin = (req, res, next) => {
  const email = req.query.email || req.body.email;
  const password = req.query.password || req.body.password;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) return next();
  res.status(403).json({ message: 'Forbidden: Admin only' });
};

app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, nativeLanguage } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, nativeLanguage });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
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

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Translate this text from ${inputLanguage} to ${outputLanguage}: "${text}"`
              }
            ]
          }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const translatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Translation failed';
    await new Prompt({ userId, userInput: text, aiResponse: translatedText, inputLanguage, outputLanguage }).save();
    res.json({ translatedText });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Translation failed', details: err.response?.data?.error?.message || err.message });
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

app.get('/api/admin/users', isAdmin, async (req, res) => {
  const users = await User.find({ email: { $ne: ADMIN_EMAIL } });
  res.json(users);
});

app.delete('/api/admin/users/:id', isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  await Prompt.deleteMany({ userId: req.params.id });
  res.json({ message: 'User deleted' });
});

app.get('/api/admin/prompts', isAdmin, async (req, res) => {
  const prompts = await Prompt.find().populate('userId', 'email').sort({ createdAt: -1 });
  res.json(prompts);
});

app.listen(process.env.PORT || 5000, () => console.log('Server started'));
