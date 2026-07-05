from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import anthropic

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Anthropic client
client = anthropic.Anthropic(api_key=os.getenv("CLAUDE_API_KEY"))

# Store conversation history
conversation_history = []

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
            "status": "success"
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
    return jsonify({"status": "healthy"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)