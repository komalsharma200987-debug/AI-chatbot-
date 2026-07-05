# 🤖 Claude AI Chatbot

A modern AI chatbot powered by Claude AI. This project provides both a Flask web interface and a CLI interface for interacting with Claude.

## Features

✨ **Web Interface**: Beautiful, responsive chat UI
- Real-time messaging
- Conversation history
- Clear conversation button
- Modern gradient design

💻 **CLI Interface**: Command-line chatbot
- Easy-to-use terminal interface
- Persistent conversation history
- Clear commands

🔌 **REST API**: Flask backend
- `/chat` - Send messages
- `/history` - Get conversation history
- `/reset` - Reset conversation
- `/health` - Health check

## Installation

### Prerequisites
- Python 3.8+
- pip

### Setup

1. Clone the repository
```bash
git clone https://github.com/komalsharma200987-debug/AI-chatbot-.git
cd AI-chatbot-
```

2. Create a virtual environment
```bash
python -m venv venv

# Activate virtual environment
# On Windows
venv\\Scripts\\activate
# On macOS/Linux
source venv/bin/activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Set up environment variables
```bash
cp .env.example .env
# Edit .env and add your Claude API key
```

Get your API key from [Anthropic Console](https://console.anthropic.com/)

## Usage

### Web Interface

1. Start the Flask server
```bash
python app.py
```

2. Open your browser and navigate to
```
http://localhost:5000
```

### CLI Interface

```bash
python chatbot_cli.py
```

Commands:
- Type your message and press Enter to chat
- Type `exit` to quit
- Type `clear` to reset conversation

## Project Structure

```
AI-chatbot-/
├── app.py                 # Flask web server
├── chatbot_cli.py         # CLI interface
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── README.md             # This file
├── static/
│   ├── index.html        # Web UI
│   ├── styles.css        # Styling
│   └── script.js         # Frontend logic
```

## API Endpoints

### POST /chat
Send a message and get a response

**Request:**
```json
{
  "message": "Hello, how are you?"
}
```

**Response:**
```json
{
  "response": "I'm doing well, thank you for asking!",
  "status": "success"
}
```

### GET /history
Get the conversation history

**Response:**
```json
{
  "history": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi there!"}
  ],
  "status": "success"
}
```

### POST /reset
Reset the conversation

**Response:**
```json
{
  "status": "success",
  "message": "Conversation reset"
}
```

### GET /health
Health check

**Response:**
```json
{
  "status": "healthy"
}
```

## Configuration

Edit the system prompt in `app.py` or `chatbot_cli.py` to customize the AI behavior:

```python
system="You are a helpful AI assistant. Provide clear, concise, and helpful responses."
```

## Troubleshooting

### API Key Error
Make sure your `.env` file contains a valid Claude API key:
```
CLAUDE_API_KEY=sk-ant-...
```

### Connection Error (Web Interface)
Ensure the Flask server is running on `http://localhost:5000`

### CORS Issues
The Flask app has CORS enabled. If you still face issues, check your browser console.

## Technologies Used

- **Backend**: Flask, Python
- **Frontend**: HTML, CSS, JavaScript
- **AI**: Anthropic Claude API
- **Libraries**: anthropic, python-dotenv, flask-cors

## License

MIT License

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## Support

For issues and questions, please open an issue on GitHub.
