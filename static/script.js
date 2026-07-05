const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const resetBtn = document.getElementById('resetBtn');

// API base URL
const API_URL = 'http://localhost:5000';

// Send message
async function sendMessage() {
    const message = userInput.value.trim();
    
    if (!message) return;
    
    // Clear input
    userInput.value = '';
    
    // Display user message
    displayMessage(message, 'user');
    
    // Disable send button
    sendBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            displayMessage(data.response, 'assistant');
        } else {
            displayMessage(`Error: ${data.error}`, 'error');
        }
    } catch (error) {
        displayMessage(`Connection error: ${error.message}`, 'error');
    } finally {
        sendBtn.disabled = false;
        userInput.focus();
    }
}

// Display message
function displayMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    chatBox.appendChild(messageDiv);
    
    // Remove welcome message if it exists
    const welcomeMsg = document.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
    
    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Reset conversation
async function resetConversation() {
    try {
        const response = await fetch(`${API_URL}/reset`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Clear chat box
            chatBox.innerHTML = `
                <div class="welcome-message">
                    <h2>Welcome to Claude AI Chatbot</h2>
                    <p>Start a conversation by typing your message below.</p>
                </div>
            `;
            userInput.focus();
        }
    } catch (error) {
        console.error('Error resetting conversation:', error);
    }
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
resetBtn.addEventListener('click', resetConversation);

// Focus on input
userInput.focus();