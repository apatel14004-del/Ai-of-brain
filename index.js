const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The Brain by Abhishek Patel</title>
<style>
body{font-family:sans-serif;background:#212121;color:white;margin:0;display:flex;flex-direction:column;height:100vh}
#chat{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column}
.msg{margin:8px 0;padding:12px 16px;border-radius:12px;max-width:85%;line-height:1.4}
.user{background:#2f2f2f;align-self:flex-end}
.bot{background:#444654;align-self:flex-start}
#box{display:flex;padding:12px;background:#2f2f2f;gap:8px}
input{flex:1;padding:14px;border-radius:20px;border:none;outline:none;background:#40414f;color:white}
button{padding:12px 20px;border:none;border-radius:20px;background:#10a37f;color:white;font-weight:bold}
</style>
</head>
<body>
<div id="chat"><div class="msg bot">Hello! I am The Brain, created by Abhishek Patel. Puchho kuch bhi!</div></div>
<div id="box"><input id="q" placeholder="Message The Brain..." onkeypress="if(event.key==='Enter')ask()"/><button onclick="ask()">Send</button></div>
<script>
async function ask(){
  const input=document.getElementById('q');
  const chat=document.getElementById('chat');
  const text=input.value.trim();
  if(!text) return;
  chat.innerHTML+='<div class="msg user">'+text+'</div>';
  input.value='';
  chat.scrollTop=chat.scrollHeight;
  const res=await fetch('/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text})});
  const data=await res.json();
  chat.innerHTML+='<div class="msg bot">'+(data.reply || data.error)+'</div>';
  chat.scrollTop=chat.scrollHeight;
}
</script>
</body>
</html>
  `);
});

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer '+process.env.GROQ_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Tumhara naam The Brain hai. Tumhe Abhishek Patel ne banaya hai. Tum ek helpful AI assistant ho. Agar koi puche tumhe kisne banaya, who made you, creator kaun hai, toh hamesha bolna ki mujhe Abhishek Patel ne banaya hai. Kabhi bhi Meta, OpenAI, ya Groq ka naam mat lena.' },
          { role: 'user', content: userMessage }
        ]
      })
    });
    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content || "Sorry, thoda error aaya.";
    res.json({ reply: aiReply });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(process.env.PORT || 10000);
