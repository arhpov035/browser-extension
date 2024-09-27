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

// Функция для проверки и скрытия <article> с <h5>
function checkAndHideArticle(article) {
  const h5 = article.querySelector('h5');
  if (h5 && article.style.display !== 'none') {
    article.style.display = 'none';
    console.log('Скрываем article, так как внутри найден h5');
  }
}

// Создаем MutationObserver для отслеживания изменений в DOM
const observer = new MutationObserver((mutations) => {
  let editableDivFound = false;

  mutations.forEach((mutation) => {
    // Обрабатываем добавленные узлы
    mutation.addedNodes.forEach((node) => {
      // Проверяем наличие редактируемого поля
      if (!editableDivFound && node.nodeType === Node.ELEMENT_NODE) {
        const editableDiv = node.querySelector(
          'div.ProseMirror[contenteditable="true"]'
        );

        if (editableDiv) {
          console.log('Редактируемое поле найдено, ожидание данных от WebSocket...');
          editableDivFound = true;
          // Если больше не нужно отслеживать редактируемое поле, можно отключить наблюдатель
          // observer.disconnect(); // Раскомментируйте, если наблюдение больше не требуется
        }
      }

      // Проверяем и скрываем новые элементы <article> с <h5>
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.matches('article')) {
          checkAndHideArticle(node);
        } else {
          node.querySelectorAll('article').forEach(checkAndHideArticle);
        }
      }
    });
  });
});

// Запускаем наблюдателя за изменениями в DOM
observer.observe(document.body, {
  childList: true, // Отслеживать добавление/удаление дочерних узлов
  subtree: true    // Следить за всеми потомками
});

// Проверка и скрытие существующих <article> с <h5> при загрузке страницы
document.querySelectorAll('article').forEach(checkAndHideArticle);
