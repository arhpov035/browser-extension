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

// Создаем MutationObserver для отслеживания появления элемента
const observer = new MutationObserver(() => {
  const editableDiv = document.querySelector(
    'div.ProseMirror[contenteditable="true"]'
  );
  if (editableDiv) {
    insertTextIntoPrompt();
    observer.disconnect(); // Отключаем наблюдателя после того, как элемент найден
  }
});

// Запускаем наблюдателя за изменениями в DOM
observer.observe(document.body, { childList: true, subtree: true });
