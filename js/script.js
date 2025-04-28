// Main function to initialize the chat interface
function initChat() {
    // Get all required DOM elements
    const chatToggle = document.getElementById('chatToggle');
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');
    const openIcon = document.querySelector('.open-icon');
    const closeIcon = document.querySelector('.close-icon');

    // Store the conversation history
    let conversation = [];

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

            // Display the user's message
            const userMessage = document.createElement('div');
            userMessage.classList.add('message', 'user');
            userMessage.textContent = message;
            chatMessages.appendChild(userMessage);

            // Add user's message to the conversation history
            conversation.push({ role: 'user', content: message });

            // Call the OpenAI API to get the bot's response
            getBotResponse();
        }
    }

    // Function to fetch the bot's response from OpenAI API
    async function getBotResponse() {
        // Display a loading message while waiting for the response
        const botMessage = document.createElement('div');
        botMessage.classList.add('message', 'bot');
        botMessage.textContent = 'Typing...';
        chatMessages.appendChild(botMessage);

        // Scroll to the latest message
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            // Fetch rentals data from rentals.json
            const rentalsResponse = await fetch('./rentals.json'); // Ensure the path is correct
            const rentals = await rentalsResponse.json();

            // Send the conversation and rentals data to OpenAI API
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}` // Use the API key from secrets.js
                },
                body: JSON.stringify({
                    model: 'gpt-4o', // Use the GPT-4o model
                    messages: [
                        ...conversation,
                        { role: 'system', content: `Here is the vacation rental data: ${JSON.stringify(rentals.rentals)}` }
                    ],
                    max_completion_tokens: 800
                })
            });

            const data = await response.json();

            // Format the AI's response with HTML line breaks for clarity
            const formattedResponse = data.choices[0].message.content
                .split('\n')
                .map(line => line.trim())
                .filter(line => line) // Remove empty lines
                .join('<br><br>'); // Add HTML line breaks for better readability

            // Update the bot's message with the formatted response
            botMessage.innerHTML = `Here’s what I found for you:<br><br>${formattedResponse}`;

            // Add bot's response to the conversation history
            conversation.push({ role: 'assistant', content: botMessage.innerHTML });

            // Scroll to the latest message
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch (error) {
            botMessage.textContent = 'Sorry, something went wrong. Please try again.';
            console.error('Error fetching bot response:', error);
        }
    }

    // Listen for form submission
    document.getElementById('chatForm').addEventListener('submit', handleUserInput);
}

// Initialize the chat interface
initChat();
