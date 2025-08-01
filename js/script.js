// Main function to initialize the chat interface
function initChat() {
    // Get all required DOM elements
    const chatToggle = document.getElementById('chatToggle');
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');
    const openIcon = document.querySelector('.open-icon');
    const closeIcon = document.querySelector('.close-icon');
    const chatForm = document.getElementById('chatForm');

    // Store the conversation as an array of messages
    let conversation = [
        { role: "assistant", content: "Hello! How can I help you find your perfect offbeat retreat?" }
    ];

    // Store rentals data from rentals.json
    let rentalsData = [];

    // Fetch rentals.json and store data for later use
    async function loadRentals() {
        try {
            const response = await fetch('./rentals.json');
            rentalsData = await response.json();
        } catch (error) {
            // If rentals.json can't be loaded, rentalsData stays empty
            rentalsData = [];
        }
    }

    // Toggle chat visibility and swap icons
    chatToggle.addEventListener('click', function() {
        chatBox.classList.toggle('active');
        openIcon.style.display = chatBox.classList.contains('active') ? 'none' : 'block';
        closeIcon.style.display = chatBox.classList.contains('active') ? 'block' : 'none';
    });

    // Function to display a message in the chat window
    function displayMessage(role, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', role);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to send conversation and rentals data to OpenAI and get a response
    async function getBotReply() {
        // Show a loading message while waiting for the API
        displayMessage('bot', 'Thinking...');
        // Get your OpenAI API key from secrets.js
        const OPENAI_API_KEY = apiKey;
        const url = 'https://api.openai.com/v1/chat/completions';

        // Add the rentals data as a system message so the AI can use it
        // The system prompt guides the AI to ask simple questions and recommend matches
        let messagesToSend = [
            {
                role: "system",
                content: `You are a friendly assistant helping users find a fun vacation rental. 
Ask 2–3 simple questions to learn about their preferences (like location, theme, or amenities) using the following rentals: ${JSON.stringify(rentalsData)}. 
After getting answers, recommend the top matches and explain why they fit. Keep questions and answers short and easy to understand.`
            },
            ...conversation
        ];

        const body = {
            model: "gpt-4o",
            messages: messagesToSend,
            max_tokens: 200
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            // Remove the loading message
            const loadingMsg = chatMessages.querySelector('.bot:last-child');
            if (loadingMsg && loadingMsg.textContent === 'Thinking...') {
                chatMessages.removeChild(loadingMsg);
            }
            // Get the bot's reply and display it
            if (data.choices && data.choices[0] && data.choices[0].message) {
                const botReply = data.choices[0].message.content;
                displayMessage('bot', botReply);
                // Add bot reply to conversation
                conversation.push({ role: "assistant", content: botReply });
            } else {
                displayMessage('bot', "Sorry, I couldn't get a response.");
            }
        } catch (error) {
            // Remove the loading message
            const loadingMsg = chatMessages.querySelector('.bot:last-child');
            if (loadingMsg && loadingMsg.textContent === 'Thinking...') {
                chatMessages.removeChild(loadingMsg);
            }
            displayMessage('bot', "Oops! Something went wrong.");
        }
    }

    // Handle user input and process messages
    async function handleUserInput(e) {
        e.preventDefault();
        const message = userInput.value.trim();
        if (message) {
            userInput.value = '';
            displayMessage('user', message);
            conversation.push({ role: "user", content: message });
            await getBotReply();
        }
    }

    // Listen for form submission
    chatForm.addEventListener('submit', handleUserInput);

    // Load rentals data before chat starts
    loadRentals();
}

// Initialize the chat interface
initChat();
