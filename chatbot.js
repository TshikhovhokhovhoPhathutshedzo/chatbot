// Chatbot JavaScript
class Chatbot {
    constructor() {
        this.messages = [];
        this.isTyping = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadChatHistory();
    }

    bindEvents() {
        // Send message on button click
        document.getElementById('sendBtn').addEventListener('click', () => {
            this.sendMessage();
        });

        // Send message on Enter key
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Header actions
        document.getElementById('minimizeBtn').addEventListener('click', () => {
            this.toggleMinimize();
        });

        document.getElementById('closeBtn').addEventListener('click', () => {
            this.closeChat();
        });

        // Floating chat button
        document.getElementById('floatingChatBtn').addEventListener('click', () => {
            this.openChat();
        });

        // Input action buttons
        document.getElementById('attachBtn').addEventListener('click', () => {
            this.handleFileAttachment();
        });

        document.getElementById('emojiBtn').addEventListener('click', () => {
            this.showEmojiPicker();
        });

        document.getElementById('voiceBtn').addEventListener('click', () => {
            this.handleVoiceMessage();
        });
    }

    sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();

        if (!message || this.isTyping) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Simulate AI response
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 1000 + Math.random() * 2000);
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        const messageText = document.createElement('p');
        messageText.textContent = content;

        const messageTime = document.createElement('span');
        messageTime.className = 'message-time';
        messageTime.textContent = this.getCurrentTime();

        messageContent.appendChild(messageText);
        messageContent.appendChild(messageTime);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);

        const chatMessages = document.getElementById('chatMessages');
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Store message
        this.messages.push({
            content,
            sender,
            timestamp: new Date().toISOString()
        });

        // Save to localStorage
        this.saveChatHistory();
    }

    showTypingIndicator() {
        this.isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator-container';
        typingDiv.id = 'typingIndicator';

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<i class="fas fa-robot"></i>';

        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;

        typingDiv.appendChild(avatar);
        typingDiv.appendChild(typingIndicator);

        const chatMessages = document.getElementById('chatMessages');
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Greeting responses
        if (this.containsAny(message, ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'])) {
            return this.getRandomResponse([
                "Hello! How can I help you today?",
                "Hi there! What can I assist you with?",
                "Hey! Nice to meet you. How may I help?",
                "Greetings! What would you like to know?"
            ]);
        }

        // Help responses
        if (this.containsAny(message, ['help', 'what can you do', 'capabilities'])) {
            return "I can help you with various tasks! I can tell jokes, provide weather information, tell you the time, answer questions, and have general conversations. Just ask me anything!";
        }

        // Weather responses
        if (this.containsAny(message, ['weather', 'temperature', 'forecast'])) {
            return "I'd love to help with weather information! However, I don't have access to real-time weather data. You might want to check a weather app or website for current conditions.";
        }

        // Time responses
        if (this.containsAny(message, ['time', 'what time', 'current time'])) {
            const now = new Date();
            return `The current time is ${now.toLocaleTimeString()}.`;
        }

        // Joke responses
        if (this.containsAny(message, ['joke', 'funny', 'humor'])) {
            return this.getRandomJoke();
        }

        // Thank you responses
        if (this.containsAny(message, ['thank', 'thanks', 'appreciate'])) {
            return this.getRandomResponse([
                "You're welcome! I'm happy to help.",
                "No problem at all! Let me know if you need anything else.",
                "Glad I could help! Feel free to ask more questions.",
                "Anytime! That's what I'm here for."
            ]);
        }

        // Goodbye responses
        if (this.containsAny(message, ['bye', 'goodbye', 'see you', 'farewell'])) {
            return this.getRandomResponse([
                "Goodbye! Have a great day!",
                "See you later! Come back anytime.",
                "Take care! I'll be here when you need me.",
                "Bye! It was nice chatting with you!"
            ]);
        }

        // Default responses
        return this.getRandomResponse([
            "That's interesting! Tell me more about that.",
            "I'm not sure I understand. Could you rephrase that?",
            "That's a great question! Let me think about it...",
            "I'm here to help! What would you like to know?",
            "Interesting point! What are your thoughts on that?",
            "I'm still learning, but I'd love to help you with that!",
            "That's something to think about! Do you have any other questions?"
        ]);
    }

    containsAny(str, keywords) {
        return keywords.some(keyword => str.includes(keyword));
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getRandomJoke() {
        const jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "Why did the scarecrow win an award? Because he was outstanding in his field!",
            "Why don't eggs tell jokes? They'd crack each other up!",
            "What do you call a fake noodle? An impasta!",
            "Why did the math book look so sad? Because it had too many problems!",
            "What do you call a bear with no teeth? A gummy bear!",
            "Why don't skeletons fight each other? They don't have the guts!",
            "What do you call a fish wearing a bowtie? So-fish-ticated!",
            "Why did the bicycle fall over? Because it was two-tired!",
            "What do you call a can opener that doesn't work? A can't opener!"
        ];
        return this.getRandomResponse(jokes);
    }

    handleQuickAction(action) {
        const actions = {
            help: "I can help you with various tasks! I can tell jokes, provide information, answer questions, and have conversations. Just ask me anything!",
            weather: "I'd love to help with weather information! However, I don't have access to real-time weather data. You might want to check a weather app or website for current conditions.",
            joke: this.getRandomJoke(),
            time: `The current time is ${new Date().toLocaleTimeString()}.`
        };

        if (actions[action]) {
            this.addMessage(actions[action], 'bot');
        }
    }

    getCurrentTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        return `${displayHours}:${displayMinutes} ${ampm}`;
    }

    toggleMinimize() {
        const container = document.querySelector('.chatbot-container');
        container.style.display = container.style.display === 'none' ? 'flex' : 'none';
    }

    closeChat() {
        const container = document.querySelector('.chatbot-container');
        container.style.display = 'none';
        document.getElementById('floatingChatBtn').style.display = 'flex';
    }

    openChat() {
        const container = document.querySelector('.chatbot-container');
        container.style.display = 'flex';
        document.getElementById('floatingChatBtn').style.display = 'none';
    }

    handleFileAttachment() {
        // Create file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*,.pdf,.doc,.docx,.txt';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.addMessage(`📎 Attached: ${file.name}`, 'user');
                this.addMessage("I can see you've attached a file. While I can't process files yet, I'm here to help with any questions you might have!", 'bot');
            }
        });

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    showEmojiPicker() {
        const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '💯', '😎', '🤔', '👏'];
        const emojiMessage = emojis.join(' ');
        this.addMessage(emojiMessage, 'user');
        this.addMessage("Here are some emojis for you! 😊 Feel free to use them in our conversation!", 'bot');
    }

    handleVoiceMessage() {
        this.addMessage("🎤 Voice message feature is coming soon! For now, you can type your messages.", 'user');
        this.addMessage("I can't process voice messages yet, but I'm working on it! Feel free to type your message instead.", 'bot');
    }

    saveChatHistory() {
        localStorage.setItem('chatbotHistory', JSON.stringify(this.messages));
    }

    loadChatHistory() {
        const history = localStorage.getItem('chatbotHistory');
        if (history) {
            this.messages = JSON.parse(history);
            // Optionally restore recent messages to UI
            const recentMessages = this.messages.slice(-5); // Last 5 messages
            recentMessages.forEach(msg => {
                this.addMessage(msg.content, msg.sender, false);
            });
        }
    }

    clearChatHistory() {
        this.messages = [];
        localStorage.removeItem('chatbotHistory');
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';
        
        // Add welcome message
        this.addMessage("Hello! I'm your AI assistant. How can I help you today?", 'bot');
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});

// Add some utility functions
window.ChatbotUtils = {
    // Export chat history
    exportChat: () => {
        const history = localStorage.getItem('chatbotHistory');
        if (history) {
            const blob = new Blob([history], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'chat-history.json';
            a.click();
            URL.revokeObjectURL(url);
        }
    },

    // Clear chat history
    clearChat: () => {
        localStorage.removeItem('chatbotHistory');
        location.reload();
    }
}; 