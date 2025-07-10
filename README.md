# AI Chatbot

A modern, responsive AI chatbot built with HTML, CSS, and JavaScript. This chatbot features a beautiful user interface with smooth animations and intelligent conversation capabilities.

## 🚀 Features

### Core Features
- **Real-time Chat Interface**: Modern, responsive design with smooth animations
- **AI Responses**: Intelligent conversation handling with contextual responses
- **Quick Actions**: Pre-defined action buttons for common queries
- **Message History**: Automatic saving and loading of chat history
- **Typing Indicators**: Visual feedback when the bot is "thinking"

### Interactive Elements
- **File Attachments**: Support for image, PDF, and document uploads
- **Emoji Support**: Built-in emoji picker and display
- **Voice Messages**: Placeholder for future voice message functionality
- **Minimize/Close**: Collapsible chat interface with floating button

### User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: CSS animations and transitions for better UX
- **Auto-scroll**: Messages automatically scroll to the latest
- **Keyboard Support**: Send messages with Enter key
- **Local Storage**: Chat history persists between sessions

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox, Grid, and animations
- **JavaScript (ES6+)**: Object-oriented programming with classes
- **Font Awesome**: Icons for better visual appeal
- **Local Storage**: Client-side data persistence

## 📁 Project Structure

```
chatbot/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Stylesheet with modern design
├── js/
│   └── chatbot.js      # Main JavaScript functionality
└── README.md           # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required

### Installation

1. **Clone or Download** the project files
2. **Open** `index.html` in your web browser
3. **Start Chatting** with the AI assistant!

### Alternative Setup (Local Server)

For the best experience, you can run it on a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 💬 How to Use

### Basic Chat
1. Type your message in the input field
2. Press Enter or click the send button
3. The bot will respond with relevant information

### Quick Actions
Use the quick action buttons for instant responses:
- **Help**: Learn about bot capabilities
- **Weather**: Get weather information (placeholder)
- **Joke**: Hear a random joke
- **Time**: Get current time

### Advanced Features
- **File Upload**: Click the paperclip icon to attach files
- **Emojis**: Click the smile icon for emoji suggestions
- **Voice**: Click the microphone for voice message (coming soon)

### Chat Controls
- **Minimize**: Click the minus button to hide the chat
- **Close**: Click the X button to close and show floating button
- **Floating Button**: Click to reopen the chat interface

## 🎨 Customization

### Styling
The chatbot uses CSS custom properties for easy theming. You can modify colors in `css/style.css`:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --background-color: #f0f2f5;
    --text-color: #333;
}
```

### Adding New Responses
Extend the `generateResponse()` method in `js/chatbot.js` to add new conversation patterns:

```javascript
// Add new response patterns
if (this.containsAny(message, ['your_keyword'])) {
    return "Your custom response here!";
}
```

### Quick Actions
Add new quick actions by modifying the HTML and JavaScript:

```html
<!-- Add to HTML -->
<button class="quick-action-btn" data-action="newaction">New Action</button>
```

```javascript
// Add to handleQuickAction method
const actions = {
    // ... existing actions
    newaction: "Your new action response"
};
```

## 🔧 API Integration

This chatbot is designed to be easily integrated with external APIs. You can modify the `generateResponse()` method to:

- Connect to OpenAI API for more intelligent responses
- Integrate with weather APIs for real weather data
- Add translation services
- Connect to knowledge bases or databases

### Example API Integration

```javascript
async generateResponse(userMessage) {
    // Call external API
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
    });
    
    const data = await response.json();
    return data.response;
}
```

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Font Awesome for the beautiful icons
- Modern CSS techniques for responsive design
- ES6+ JavaScript features for clean code

## 📞 Support

If you have any questions or need help with the chatbot:

1. Check the documentation above
2. Review the code comments in the source files
3. Open an issue on the project repository

---

**Happy Chatting! 🤖💬** 