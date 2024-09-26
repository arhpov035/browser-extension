// Подключаемся к WebSocket-серверу
const socket = new WebSocket('ws://127.0.0.1:8080');

let isAdditionalTextAdded = false; // Флаг для проверки, добавляли ли мы дополнительный текст

// Обрабатываем данные, полученные с сервера
socket.onmessage = function (event) {
  let fileContent = event.data; // Данные из файла
  const additionalText = `При получении каждого сообщения анализируй его, чтобы понять, является ли оно частью вопроса или утверждением.
Если сообщение не содержит вопроса, игнорируй его и переходи к следующему.
Если вопрос разбит на несколько сообщений, продолжай анализировать входящие сообщения до тех пор, пока не будет ясно, что вопрос завершён.`;

  // Если текст еще не добавлялся, добавляем его один раз
  if (!isAdditionalTextAdded) {
    fileContent = additionalText + fileContent;
    isAdditionalTextAdded = true; // Устанавливаем флаг, что текст уже добавлен
  }

  console.log(fileContent);

  // Вставляем данные в редактируемую область и после этого отправляем
  insertTextIntoPromptAndSend(fileContent);
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
function insertTextIntoPromptAndSend(text) {
  const editableDiv = document.querySelector(
    'div.ProseMirror[contenteditable="true"]'
  );

  if (editableDiv) {
    // Вставляем текст в редактируемую область
    editableDiv.innerHTML = text; // Используем полученные данные из файла
    console.log('Текст вставлен:', text);

    // Добавляем небольшую задержку, чтобы дать браузеру время обновить DOM
    setTimeout(() => {
      // Ищем кнопку отправки и кликаем на неё
      const sendButton = document.querySelector(
        'button[data-testid="send-button"]'
      );
      if (sendButton) {
        sendButton.click();
        console.log('Форма отправлена');
      } else {
        console.error('Кнопка отправки не найдена.');
      }
    }, 100); // Задержка 100 миллисекунд
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
    console.log('Редактируемое поле найдено, ожидание данных от WebSocket...');
    observer.disconnect(); // Отключаем наблюдателя после того, как элемент найден
  }
});

// Запускаем наблюдателя за изменениями в DOM
observer.observe(document.body, { childList: true, subtree: true });
