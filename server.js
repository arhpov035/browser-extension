const chokidar = require('chokidar');
const WebSocket = require('ws');
const fs = require('fs');

// Создаем WebSocket сервер на порту 8080
const wss = new WebSocket.Server({ port: 8080 });

// Отправка данных всем подключенным клиентам (браузерным расширениям)
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// Отслеживание изменений файла
const fileToWatch = './file.txt'; // путь к вашему файлу

chokidar.watch(fileToWatch).on('change', (path) => {
  console.log(`Файл ${path} изменен!`);

  // Чтение содержимого файла и отправка клиентам
  fs.readFile(fileToWatch, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка при чтении файла:', err);
      return;
    }

    // Отправляем содержимое файла всем подключенным клиентам (расширениям)
    broadcast(data);
  });
});

console.log('WebSocket сервер запущен на порту 8080, отслеживание файла...');
