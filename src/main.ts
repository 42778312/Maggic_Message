import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <div class="header">
      <button class="close-button">X</button>
      <p class="magic-message">Magic Message</p>
    </div>
    <hr class="line">
    <div class="input-container">
      <input type="text" id="helloInput" placeholder="Hello World">
      <button id="actionButton">Generate</button>
    </div>
    <div id="response" class="response"></div>
  </div>
`;

function updateWindowSize() {
  const responseDiv = document.getElementById('response');
  if (responseDiv) {
    const contentHeight = responseDiv.scrollHeight + 
                         document.querySelector('.header')!.scrollHeight + 
                         document.querySelector('.input-container')!.scrollHeight;
    window.ipcRenderer.send('update-window-size', contentHeight);
  }
}

const input = document.getElementById('helloInput') as HTMLInputElement;
const actionButton = document.getElementById('actionButton');
const responseDiv = document.getElementById('response');

actionButton?.addEventListener('click', async () => {
  const userQuestion = input.value.trim();
  
  if (!userQuestion) {
    alert('Please enter a question');
    input.focus();
    return;
  }

  try {
    responseDiv!.innerHTML = 'Loading...';
    updateWindowSize(); 
    
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCdBOxGUNcLAwUwfhhHqIRrhnq-KvrPSNU',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: userQuestion
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      responseDiv!.innerHTML = `
        <div class="response-textfield">
          <p class="response-text">${data.candidates[0].content.parts[0].text}</p>
        </div>
      `;
      setTimeout(updateWindowSize, 100);
    } else {
      responseDiv!.innerHTML = '<p class="error">No response received</p>';
      updateWindowSize();
    }
  } catch (error) {
    console.error('Error:', error);
    responseDiv!.innerHTML = '<p class="error">Error getting response. Please try again.</p>';
    updateWindowSize();
  }
});

const closeButton = document.querySelector('.close-button');
closeButton?.addEventListener('click', () => {
  window.close();
});

// Listen for main process messages
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message);
});

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(updateWindowSize, 100);
});

window.addEventListener('resize', () => {
  updateWindowSize();
});
