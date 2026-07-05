# Quick Start Guide

## 5-Minute Setup

### 1. Get Your API Key
- Go to [Anthropic Console](https://console.anthropic.com/)
- Create an account and get your API key

### 2. Clone and Setup
```bash
git clone https://github.com/komalsharma200987-debug/AI-chatbot-.git
cd AI-chatbot-
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
```

### 3. Configure
```bash
cp .env.example .env
# Edit .env with your API key
```

### 4. Run (Choose One)

**Option A: Web Interface**
```bash
python app.py
# Open http://localhost:5000 in your browser
```

**Option B: CLI Interface**
```bash
python chatbot_cli.py
```

## That's It! 🎉

You now have a working AI chatbot powered by Claude!

## Next Steps

- Customize the system prompt in `app.py` or `chatbot_cli.py`
- Deploy to a cloud platform (Heroku, Replit, etc.)
- Add more features (file uploads, conversations storage, etc.)
- Integrate with other APIs

## Help

If you encounter issues:
1. Check that your API key is valid
2. Ensure you're using Python 3.8+
3. Verify all dependencies are installed: `pip install -r requirements.txt`
4. Check the `.env` file is in the root directory
