// Этот файл содержит маршруты (routes) для аутентификации и управления профилем пользователя.
// Маршруты обрабатывают HTTP-запросы и используют контроллеры и middleware для выполнения операций:
// - Регистрация пользователя
// - Вход пользователя
// - Выход пользователя (добавление токена в черный список)
// - Получение профиля пользователя

const express = require('express'); // Импортируем Express для создания маршрутов
const { register, login } = require('../controllers/authController'); // Импортируем контроллеры для аутентификации
const { authMiddleware } = require('../middlewares/authMiddleware'); // Импортируем middleware для проверки аутентификации
const BlacklistedToken = require('../models/BlacklistedToken'); // Импортируем модель для черного списка токенов

const router = express.Router(); // Создаем экземпляр маршрутизатора

// Маршрут для регистрации пользователя
router.post('/register', register);

// Маршрут для входа пользователя
router.post('/login', login);

// Маршрут для выхода пользователя
router.post('/logout', authMiddleware, async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Извлекаем токен из заголовка Authorization
  if (token) {
    await BlacklistedToken.create({ token }); // Добавляем токен в черный список
  }
  res.json({ message: 'Вы успешно вышли' }); // Отправляем сообщение об успешном выходе
});

// Маршрут для получения профиля пользователя
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'Доступ разрешен', userId: req.userId }); // Отправляем ID пользователя в ответе
});

// Экспортируем маршрутизатор для использования в приложении
module.exports = router;