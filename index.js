const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => { res.send('The Brain by Abhishek Patel is LIVE!'); });
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Tumhara naam The Brain hai. Tumhe Abhishek Patel ne banaya hai. Hamesha yahi bolna ki mujhe Abhishek Patel ne banaya hai. Kabhi bhi khud ko Google, Meta AI, OpenAI mat bolna.' },
          { role: 'user', content: userMessage }
        ]
      })
    });
    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content || 'Error';
    res.json({ reply: aiReply });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.listen(process.env.PORT || 10000);
