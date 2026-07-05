// ==================== DOM Elements ====================
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const messageForm = document.getElementById('messageForm');
const newChatBtn = document.getElementById('newChatBtn');
const settingsBtn = document.getElementById('settingsBtn');
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const themeSelect = document.getElementById('themeSelect');
const chatHistory = document.getElementById('chatHistory');
const greetingText = document.getElementById('greetingText');
const voiceBtn = document.getElementById('voiceBtn');

// ==================== API Configuration ====================
const API_URL = 'http://localhost:5000';

// ==================== State Management ====================
let conversationHistory = [];
let isLoading = false;
let currentTheme = localStorage.getItem('theme') || 'light';
let userName = localStorage.getItem('userName') || 'User';

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeEventListeners();
    loadChatHistory();
    updateGreeting();
    userInput.focus();
});

// ==================== Theme Management ====================
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    themeSelect.value = savedTheme;
}

function applyTheme(theme) {
    const html = document.documentElement;
    
    if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
        html.setAttribute('data-theme', theme);
    }
    
    localStorage.setItem('theme', theme);
    currentTheme = theme;
    updateThemeIcon();
}

function updateThemeIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// ==================== Greeting ====================
function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = 'How can I help you today?';
    
    if (hour < 12) {
        greeting = 'Good morning! How can I help?';
    } else if (hour < 18) {
        greeting = 'Good afternoon! How can I assist?';
    } else {
        greeting = 'Good evening! What can I do for you?';
    }
    
    if (greetingText) {
        greetingText.textContent = greeting;
    }
}

// ==================== Event Listeners ====================
function initializeEventListeners() {
    sendBtn.addEventListener('click', handleSendMessage);
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSendMessage();
    });
    
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    newChatBtn.addEventListener('click', handleNewChat);
    settingsBtn.addEventListener('click', () => settingsModal.classList.add('active'));
    closeSettings.addEventListener('click', () => settingsModal.classList.remove('active'));
    themeToggle.addEventListener('click', () => {
        const themes = ['light', 'dark'];
        const nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
        applyTheme(nextTheme);
    });

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
    });

    themeSelect.addEventListener('change', (e) => applyTheme(e.target.value));

    voiceBtn.addEventListener('click', initializeVoiceInput);

    // Close modal when clicking outside
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove('active');
        }
    });

    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!e.target.closest('.sidebar') && !e.target.closest('.menu-toggle')) {
                sidebar.classList.remove('mobile-open');
            }
        }
    });
}

// ==================== Voice Input ====================
function initializeVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        alert('Speech Recognition not supported in your browser');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    voiceBtn.style.color = '#10a37f';
    voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';

    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        userInput.value = transcript;
        voiceBtn.style.color = '';
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        voiceBtn.style.color = '';
    };

    recognition.onend = () => {
        voiceBtn.style.color = '';
    };
}

// ==================== Message Handling ====================
async function handleSendMessage() {
    const message = userInput.value.trim();

    if (!message || isLoading) return;

    // Clear input
    userInput.value = '';

    // Display user message
    displayMessage(message, 'user');

    // Update send button state
    sendBtn.disabled = true;
    isLoading = true;

    // Remove welcome container if it exists
    const welcomeContainer = document.querySelector('.welcome-container');
    if (welcomeContainer) {
        welcomeContainer.remove();
    }

    // Add typing indicator
    const typingElement = displayTypingIndicator();

    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();

        // Remove typing indicator
        typingElement.remove();

        if (response.ok && data.status === 'success') {
            displayMessage(data.response, 'assistant');
            conversationHistory.push({
                user: message,
                assistant: data.response,
                timestamp: new Date().toLocaleTimeString(),
            });
            saveChatToHistory();
        } else {
            displayMessage(
                `Error: ${data.error || 'Failed to get response from the server'}`,
                'error'
            );
        }
    } catch (error) {
        typingElement.remove();
        displayMessage(`Connection error: ${error.message}`, 'error');
        console.error('Error:', error);
    } finally {
        sendBtn.disabled = false;
        isLoading = false;
        userInput.focus();
    }
}

// ==================== Message Display ====================
function displayMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    
    if (sender === 'user') {
        avatarDiv.innerHTML = '<i class="fas fa-user"></i>';
    } else if (sender === 'assistant') {
        avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
    } else if (sender === 'error') {
        avatarDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    chatBox.appendChild(messageDiv);

    // Scroll to bottom
    setTimeout(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 0);

    return messageDiv;
}

function displayTypingIndicator() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content typing-indicator';
    contentDiv.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    chatBox.appendChild(messageDiv);

    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;

    return messageDiv;
}

// ==================== New Chat ====================
async function handleNewChat() {
    try {
        const response = await fetch(`${API_URL}/reset`, {
            method: 'POST',
        });

        const data = await response.json();

        if (data.status === 'success') {
            // Clear chat
            chatBox.innerHTML = `
                <div class="welcome-container">
                    <div class="welcome-greeting">
                        <div class="sparkle-icon">✨</div>
                        <h2 id="greetingText">How can I help you today?</h2>
                    </div>
                    
                    <div class="suggested-prompts">
                        <button class="prompt-btn" onclick="insertSuggestedPrompt('Explain quantum computing in simple terms')">
                            <div class="prompt-icon">
                                <i class="fas fa-lightbulb"></i>
                            </div>
                            <div class="prompt-text">
                                <span class="prompt-title">Explain something</span>
                                <span class="prompt-subtitle">Explain quantum computing</span>
                            </div>
                        </button>
                        <button class="prompt-btn" onclick="insertSuggestedPrompt('Write a Python function for sorting')">
                            <div class="prompt-icon">
                                <i class="fas fa-code"></i>
                            </div>
                            <div class="prompt-text">
                                <span class="prompt-title">Write code</span>
                                <span class="prompt-subtitle">Create a Python function</span>
                            </div>
                        </button>
                        <button class="prompt-btn" onclick="insertSuggestedPrompt('Tell me an interesting fact')">
                            <div class="prompt-icon">
                                <i class="fas fa-star"></i>
                            </div>
                            <div class="prompt-text">
                                <span class="prompt-title">Get inspired</span>
                                <span class="prompt-subtitle">Tell me something interesting</span>
                            </div>
                        </button>
                        <button class="prompt-btn" onclick="insertSuggestedPrompt('Plan a weekend trip')">
                            <div class="prompt-icon">
                                <i class="fas fa-map"></i>
                            </div>
                            <div class="prompt-text">
                                <span class="prompt-title">Plan something</span>
                                <span class="prompt-subtitle">Create a weekend itinerary</span>
                            </div>
                        </button>
                    </div>
                </div>
            `;
            
            // Re-attach the greeting text event listener
            const newGreetingText = document.getElementById('greetingText');
            if (newGreetingText) {
                updateGreeting();
            }
            
            conversationHistory = [];
            userInput.focus();

            // Close mobile sidebar
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-open');
            }
        }
    } catch (error) {
        console.error('Error resetting conversation:', error);
    }
}

// ==================== Suggested Prompts ====================
function insertSuggestedPrompt(prompt) {
    userInput.value = prompt;
    userInput.focus();
}

// ==================== Chat History ====================
function saveChatToHistory() {
    const summary = conversationHistory[0]?.user.substring(0, 30) || 'Chat';
    const chats = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    
    chats.unshift({
        id: Date.now(),
        summary: summary + '...',
        timestamp: new Date().toLocaleString(),
        messages: conversationHistory,
    });

    // Keep only last 15 chats
    if (chats.length > 15) {
        chats.pop();
    }

    localStorage.setItem('chatHistory', JSON.stringify(chats));
    loadChatHistory();
}

function loadChatHistory() {
    const chats = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    chatHistory.innerHTML = '';

    chats.forEach((chat) => {
        const chatItem = document.createElement('button');
        chatItem.className = 'chat-history-item';
        chatItem.innerHTML = `<i class="fas fa-message"></i> ${chat.summary}`;
        chatItem.title = chat.summary;
        chatItem.onclick = () => {
            loadChat(chat);
        };
        chatHistory.appendChild(chatItem);
    });
}

function loadChat(chat) {
    conversationHistory = chat.messages;
    chatBox.innerHTML = '';

    chat.messages.forEach((msg) => {
        displayMessage(msg.user, 'user');
        displayMessage(msg.assistant, 'assistant');
    });

    // Close mobile sidebar
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('mobile-open');
    }
}
