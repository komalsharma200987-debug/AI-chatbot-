#!/usr/bin/env python3
"""Command-line interface for the AI Chatbot"""

import anthropic
import os
from dotenv import load_dotenv

load_dotenv()

def main():
    """Main CLI interface"""
    client = anthropic.Anthropic(api_key=os.getenv("CLAUDE_API_KEY"))
    
    print("🤖 Claude AI Chatbot")
    print("Type 'exit' to quit, 'clear' to reset conversation\n")
    
    conversation_history = []
    
    while True:
        user_input = input("You: ").strip()
        
        if user_input.lower() == "exit":
            print("Goodbye!")
            break
        
        if user_input.lower() == "clear":
            conversation_history = []
            print("Conversation history cleared.\n")
            continue
        
        if not user_input:
            continue
        
        # Add user message to history
        conversation_history.append({
            "role": "user",
            "content": user_input
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
            
            print(f"\nClaude: {assistant_message}\n")
        
        except anthropic.APIError as e:
            print(f"\n❌ Error: {str(e)}\n")

if __name__ == "__main__":
    main()