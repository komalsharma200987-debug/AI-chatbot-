# 🤖 Claude AI Chatbot - Working Website

A modern AI chatbot powered by Claude AI. This project provides both a Flask web interface and a CLI interface for interacting with Claude.

## ✨ Features

💬 **Web Interface**: Beautiful, responsive chat UI
- Real-time messaging
- Conversation history
- Clear conversation button
- Modern gradient design
- **✅ WORKS IMMEDIATELY IN DEMO MODE** (no API key needed!)

🖥️ **CLI Interface**: Command-line chatbot
- Easy-to-use terminal interface
- Persistent conversation history
- Clear commands

🔌 **REST API**: Flask backend
- `/chat` - Send messages
- `/history` - Get conversation history
- `/reset` - Reset conversation
- `/health` - Health check
- `/status` - Check API configuration

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install
```bash
git clone https://github.com/komalsharma200987-debug/AI-chatbot-.git
cd AI-chatbot-
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Step 2: Run
```bash
python app.py
```

### Step 3: Open Browser
```
http://localhost:5000
```

**That's it! ✅ Website is LIVE and working RIGHT NOW in DEMO MODE!**

---

## 📝 Add Your Claude API Key Later (Optional)

When you want to enable **REAL Claude AI** responses:

### 1. Get API Key
- Visit: https://console.anthropic.com/
- Create account and get your API key

### 2. Configure
```bash
cp .env.example .env
# Edit .env and add: CLAUDE_API_KEY=sk-ant-your-key-here
```

### 3. Restart
```bash
python app.py
```

You'll see: `✅ API Configured - Ready to chat!`

---

## 📊 Current Status

| Feature | Status |
|---------|--------|
| Website Running | ✅ **WORKING** |
| Demo Chat | ✅ **ACTIVE** |
| No API Key Needed | ✅ **YES** |
| Ready for Live | ✅ **YES** |
| Real Claude AI | ⏳ Add API key anytime |

---

## 🎮 Using the Website

1. **Open**: http://localhost:5000
2. **Type** your message in the chat box
3. **Press Enter** or click Send
4. **Get Response** immediately (demo mode)
5. **Clear History** button to start fresh

---

## 📁 Project Structure

```
AI-chatbot-/
├── app.py                 # Flask server (with demo mode)
├── chatbot_cli.py         # CLI interface
├── requirements.txt       # Dependencies
├── .env.example          # API key template
├── README.md             # This file
├── QUICKSTART.md         # Quick start guide
└── static/
    ├── index.html        # Website UI
    ├── styles.css        # Beautiful styling
    └── script.js         # Chat functionality
```

---

## 🔧 API Endpoints

### POST /chat
```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'
```

**Response:**
```json
{
  "response": "I'm in demo mode! Add your API key to enable real AI.",
  "status": "success",
  "demo_mode": true
}
```

### GET /status
```bash
curl http://localhost:5000/status
```

**Response:**
```json
{
  "api_configured": false,
  "demo_mode": true,
  "status": "Demo mode (add API key to enable)"
}
```

---

## 🎯 What's Included

✅ Full working website with beautiful UI
✅ Demo mode - responds without API key
✅ Ready for immediate deployment
✅ Easy API key setup whenever you want
✅ Clean, modern design
✅ Conversation history tracking
✅ REST API endpoints
✅ CLI interface
✅ Full documentation

---

## 🚀 Deploy to Live Server

The website is ready to deploy to:
- **Heroku** - Free tier available
- **Replit** - Direct from GitHub
- **DigitalOcean** - Affordable VPS
- **PythonAnywhere** - Python-friendly hosting
- **AWS** - Using EC2 or Lightsail

---

## 💡 Next Steps

1. ✅ **Test Website** - It's working now!
2. ⏳ **Add API Key** - When ready for real AI
3. 🌐 **Deploy** - Host on a live server
4. 🎨 **Customize** - Edit system prompts and styling

---

## 🐛 Troubleshooting

**Website won't open?**
```bash
# Make sure server is running
python app.py
# Then visit: http://localhost:5000
```

**Port 5000 in use?**
Edit `app.py`: Change `port=5000` to `port=5001`

**Missing dependencies?**
```bash
pip install -r requirements.txt
```

---

## 📞 Support

- Check README.md (this file)
- Review QUICKSTART.md
- Open an issue on GitHub

---

## 📄 License

MIT License - Feel free to use and modify!

---

## 🙏 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

**🎉 Your AI chatbot is LIVE and ready to use!**

**Open http://localhost:5000 now! 🚀**
