// Main function to initialize the chat interface
function initChat() {
    // Get all required DOM elements
    const chatToggle = document.getElementById('chatToggle');
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');
    const openIcon = document.querySelector('.open-icon');
    const closeIcon = document.querySelector('.close-icon');

    // Toggle chat visibility and swap icons
    chatToggle.addEventListener('click', function() {
        chatBox.classList.toggle('active');
        openIcon.style.display = chatBox.classList.contains('active') ? 'none' : 'block';
        closeIcon.style.display = chatBox.classList.contains('active') ? 'block' : 'none';
    });

    // Handle user input and process messages
    function handleUserInput(e) {
        e.preventDefault();
        const message = userInput.value.trim();
        if (message) {
            userInput.value = '';
            // Add logic to display user and bot messages
        }
    }

    // Listen for form submission
    document.getElementById('chatForm').addEventListener('submit', handleUserInput);
}

// Initialize the chat interface
initChat();
