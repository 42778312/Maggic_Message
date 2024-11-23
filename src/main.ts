import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
  <div class="header">
 <button class="close-button">X</button>
    <p class="magic-message">Magic Message</p>
  </div>
   
    <hr class="line">
  </div>
`;

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message);
});
