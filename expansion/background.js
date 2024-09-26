chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fill_form') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let tabId = tabs[0].id;
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: insertTextIntoPrompt,
      });
    });
  }
});

function insertTextIntoPrompt() {
  const editableDiv = document.querySelector(
    'div.ProseMirror[contenteditable="true"]'
  );
  if (editableDiv) {
    // Вставляем текст в редактируемую область
    editableDiv.innerHTML = 'Привет';
    console.log('Пример');

    // Ищем кнопку отправки и кликаем на неё
    const sendButton = document.querySelector(
      'button[data-testid="send-button"]'
    );
    if (sendButton) {
      sendButton.click();
    } else {
      console.error('Кнопка отправки не найдена.');
    }
  } else {
    console.error('Редактируемое поле не найдено.');
  }
}
