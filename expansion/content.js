// Подключаемся к WebSocket-серверу
const socket = new WebSocket('ws://127.0.0.1:8080');

// Обрабатываем данные, полученные с сервера
socket.onmessage = function (event) {
  const fileContent = event.data; // Данные из файла

  // Вставляем данные в редактируемую область
  insertTextIntoPrompt(fileContent);
};

socket.onopen = function () {
  console.log('Соединение с WebSocket установлено');
};

socket.onclose = function () {
  console.log('Соединение с WebSocket закрыто');
};

socket.onerror = function (error) {
  console.error('Ошибка WebSocket:', error);
};

// Функция для вставки текста в редактируемое поле и отправки
function insertTextIntoPrompt(text = 'Привет') {
  const editableDiv = document.querySelector(
    'div.ProseMirror[contenteditable="true"]'
  );

  if (editableDiv) {
    // Вставляем текст в редактируемую область
    editableDiv.innerHTML = text; // Используем полученные данные из файла
    console.log('Текст вставлен:', text);

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
