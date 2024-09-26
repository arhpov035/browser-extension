document.getElementById('fillForm').addEventListener('click', () => {
    console.log("клик");
    
  chrome.runtime.sendMessage({ action: 'fill_form' });
});
