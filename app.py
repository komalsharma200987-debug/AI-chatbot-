from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv
import os
import anthropic
import random

load_dotenv()

app = Flask(__name__)
CORS(app)

# Check if API key exists
API_KEY = os.getenv("CLAUDE_API_KEY")
DEMO_MODE = not API_KEY

# Initialize Anthropic client only if API key exists
if API_KEY:
    client = anthropic.Anthropic(api_key=API_KEY)
else:
    client = None

# Store conversation history
conversation_history = []

# Demo responses for testing without API key
DEMO_RESPONSES = [
    "That's interesting! I'm in demo mode right now, so I'm using mock responses. Add your Claude API key to .env to enable real AI responses.",
    "I'd love to help with that! Once you add your Claude API key, I'll be able to provide real, intelligent responses.",
    "Great question! Currently I'm in demo mode. Replace the API key in your .env file to unlock my full capabilities.",
    "I'm here to assist! To get started with real AI responses, add your API key from Anthropic Console to the .env file.",
    "Interesting point! Demo mode is active - add your API key to experience the real Claude AI.",
]

@app.route("/")
def index():
    """Serve the main page"""
    return render_template("index.html")

@app.route("/status")
def status():
    """Check if API is configured"""
    return jsonify({
        "api_configured": API_KEY is not None,
        "demo_mode": DEMO_MODE,
        "status": "API configured" if API_KEY else "Demo mode (add API key to enable)"
    })

@app.route("/chat", methods=["POST"])
def chat():
    """Handle chat requests from the client"""
    data = request.json
    user_message = data.get("message")
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400
    
    # Add user message to history
    conversation_history.append({
        "role": "user",
        "content": user_message
    })
    
    try:
        if DEMO_MODE:
            # Use demo response
            assistant_message = random.choice(DEMO_RESPONSES)
        else:
            # Call Claude API
            response = client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1024,
                system="You are a helpful AI assistant. Provide clear, concise, and helpful responses.",
                messages=conversation_history
            )
            assistant_message = response.content[0].text
        
        # Add assistant response to history
        conversation_history.append({
            "role": "assistant",
            "content": assistant_message
        })
        
        return jsonify({
            "response": assistant_message,
            "status": "success",
            "demo_mode": DEMO_MODE
        })
    
    except anthropic.APIError as e:
        return jsonify({
            "error": f"API Error: {str(e)}",
            "status": "error"
        }), 500

@app.route("/reset", methods=["POST"])
def reset_conversation():
    """Reset the conversation history"""
    global conversation_history
    conversation_history = []
    return jsonify({"status": "success", "message": "Conversation reset"})

@app.route("/history", methods=["GET"])
def get_history():
    """Get the conversation history"""
    return jsonify({
        "history": conversation_history,
        "status": "success"
    })

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "api_configured": API_KEY is not None,
        "demo_mode": DEMO_MODE
    })

if __name__ == "__main__":
    print("\n" + "="*50)
    print("🤖 Claude AI Chatbot")
    print("="*50)
    if DEMO_MODE:
        print("⚠️  DEMO MODE ACTIVE")
        print("Add CLAUDE_API_KEY to .env file to enable real AI")
    else:
        print("✅ API Configured - Ready to chat!")
    print("\n🌐 Open http://localhost:5000 in your browser")
    print("="*50 + "\n")
    
    app.run(debug=True, port=5000)