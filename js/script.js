// Main function to initialize the chat interface
function initChat() {
    // Get all required DOM elements
    const chatToggle = document.getElementById('chatToggle');
    const chatBox = document.getElementById('chatBox');
    const sendButton = document.getElementById('sendMessage');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');
    const openIcon = document.querySelector('.open-icon');
    const closeIcon = document.querySelector('.close-icon');

    // Toggle chat visibility and swap icons when chat button is clicked
    chatToggle.addEventListener('click', function() {
        chatBox.classList.toggle('active');
        // Show/hide appropriate icon based on chat state
        openIcon.style.display = chatBox.classList.contains('active') ? 'none' : 'block';
        closeIcon.style.display = chatBox.classList.contains('active') ? 'block' : 'none';
    });

    // Helper function to add messages to the chat window
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        // Add appropriate styling based on message sender (user/bot)
        messageDiv.classList.add(isUser ? 'user' : 'bot');
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        // Auto-scroll to the latest message
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Process user input and add message to chat
    function handleUserInput(e) {
        e.preventDefault(); // Prevent form submission
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';
        }
    }

    // Listen for form submission
    document.getElementById('chatForm').addEventListener('submit', handleUserInput);
}

initChat();
