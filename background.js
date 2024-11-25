// Listener for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'copiedData') {
    const { type, data } = message.payload;

    // Log the received data (for debugging)
    console.log(`Received ${type} data:`, data);

    // Process text data with ChatGPT API
    if (type === 'text') {
      sendToChatGPT(data, (response) => {
        // Send the ChatGPT response back to the popup
        chrome.runtime.sendMessage({ action: 'displayResponse', data: response });
      });
    }
  } else if (message.action === 'toggleActivation') {
    // Toggle activation state
    chrome.storage.local.set({ isActive: message.isActive }, () => {
      console.log(`Extension state set to: ${message.isActive ? 'Active' : 'Inactive'}`);
    });
  }
});

// Listener for shortcut commands
chrome.commands.onCommand.addListener((command) => {
  if (command === '_execute_action') {
    console.log('Ctrl+Shift+S shortcut pressed - executing custom action.');

    // Example: Toggle activation state
    chrome.storage.local.get('isActive', ({ isActive = false }) => {
      const newState = !isActive;
      chrome.storage.local.set({ isActive: newState }, () => {
        console.log(`Shortcut toggled extension state to: ${newState ? 'Active' : 'Inactive'}`);
      });
    });

    // Add any additional functionality here
  }
});

// Function to send data to ChatGPT API
function sendToChatGPT(inputText, callback) {
  const apiKey = 'YOUR_OPENAI_API_KEY'; // Replace with your OpenAI API key

  // Make the API request to ChatGPT
  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: inputText }]
    })
  })
    .then((response) => response.json())
    .then((result) => {
      const reply = result.choices[0].message.content;
      console.log('ChatGPT Reply:', reply);
      callback(reply); // Pass the reply back to the caller
    })
    .catch((error) => {
      console.error('Error communicating with ChatGPT:', error);
      callback('An error occurred while processing your request.');
    });
}
