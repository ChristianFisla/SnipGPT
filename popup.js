// Runs when the popup is loaded
document.addEventListener('DOMContentLoaded', () => {
    const activateButton = document.getElementById('activate-button');
    const responseContainer = document.getElementById('response-container');
  
    // Function to update the button's text based on the activation state
    const updateButtonState = (isActive) => {
      activateButton.textContent = isActive ? 'Deactivate' : 'Activate';
    };
  
    // Fetch and update the activation state when the popup loads
    chrome.storage.local.get('isActive', ({ isActive = false }) => {
      updateButtonState(isActive);
    });
  
    // Toggle the activation state when the button is clicked
    activateButton.addEventListener('click', () => {
      chrome.storage.local.get('isActive', ({ isActive = false }) => {
        const newState = !isActive;
        chrome.storage.local.set({ isActive: newState }, () => {
          updateButtonState(newState);
  
          // Notify the background script of the state change
          chrome.runtime.sendMessage({ action: 'toggleActivation', isActive: newState });
        });
      });
    });
  
    // Listen for ChatGPT responses from the background script
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === 'displayResponse') {
        // Update the response container with the received data
        responseContainer.textContent = message.data || 'No response received.';
      }
    });
  });
    