// Этот файл запускает сервер приложения на указанном порту.
// Если порт не указан в переменных окружения, используется порт 5000 по умолчанию.

const app = require('./app'); // Импортируем приложение Express
const PORT = process.env.PORT || 5000; // Определяем порт из переменных окружения или используем порт 5000 по умолчанию

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`); // Выводим сообщение о запуске сервера
});