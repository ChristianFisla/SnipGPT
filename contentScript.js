// Listen for copy events
document.addEventListener('copy', (event) => {
  const clipboardData = event.clipboardData || window.clipboardData;
  let copiedData = '';

  // Check for text data
  if (clipboardData.types.includes('text/plain')) {
    copiedData = clipboardData.getData('text/plain');
  }

  // Check for image data (optional, advanced handling)
  const imageItem = Array.from(clipboardData.items).find(item => item.type.startsWith('image/'));
  if (imageItem) {
    const imageFile = imageItem.getAsFile();
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64Image = e.target.result; // Image as Base64
      sendCopiedData({ type: 'image', data: base64Image });
    };

    reader.readAsDataURL(imageFile);
  }

  // Send text data to the background script
  if (copiedData) {
    sendCopiedData({ type: 'text', data: copiedData });
  }
});

// Helper function to send data to the background script
function sendCopiedData(payload) {
  chrome.runtime.sendMessage({ action: 'copiedData', payload });
}
