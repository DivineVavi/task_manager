// Этот файл содержит middleware для аутентификации и авторизации пользователей.
// Middleware используются для проверки JWT-токена и определения роли пользователя,
// чтобы предоставить доступ к определенным ресурсам в зависимости от роли.

const jwt = require('jsonwebtoken'); // Импортируем библиотеку для работы с JWT
const BlacklistedToken = require('../models/BlacklistedToken'); // Импортируем модель для черного списка токенов

// Общий middleware для проверки токена
const authMiddleware = async (req, res, next) => {
  // Извлекаем токен из заголовка Authorization
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    console.error('Токен не предоставлен');
    return res.status(401).json({ error: 'Доступ запрещен' }); // Если токен отсутствует, возвращаем ошибку
  }

  try {
    // Проверяем, находится ли токен в черном списке
    const isBlacklisted = await BlacklistedToken.findOne({ where: { token } });
    if (isBlacklisted) {
      console.error('Токен добавлен в черный список');
      return res.status(401).json({ error: 'Токен недействителен' }); // Если токен в черном списке, возвращаем ошибку
    }

    // Декодируем токен и проверяем его валидность
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log('Декодированный токен:', decoded);

    // Проверяем, что роль пользователя указана в токене
    if (!decoded.role) {
      console.error('Роль пользователя не определена в токене');
      return res.status(403).json({ error: 'Роль пользователя не определена' }); // Если роль отсутствует, возвращаем ошибку
    }

    // Добавляем ID и роль пользователя в объект запроса для дальнейшего использования
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next(); // Передаем управление следующему middleware или контроллеру
  } catch (error) {
    console.error('Ошибка проверки токена:', error);
    res.status(400).json({ error: 'Неверный токен' }); // Обрабатываем ошибку, если токен недействителен
  }
};

// Middleware для администраторов
const adminMiddleware = (req, res, next) => {
  // Проверяем, что роль пользователя - Admin
  if (req.userRole === 'Admin') {
    next(); // Если роль Admin, передаем управление следующему middleware или контроллеру
  } else {
    res.status(403).json({ error: 'У вас нет доступа к этому ресурсу' }); // Если роль не Admin, возвращаем ошибку
  }
};

// Middleware для менеджеров
const managerMiddleware = (req, res, next) => {
  // Проверяем, что роль пользователя - Manager или Admin
  if (req.userRole === 'Manager' || req.userRole === 'Admin') {
    next(); // Если роль Manager или Admin, передаем управление следующему middleware или контроллеру
  } else {
    res.status(403).json({ error: 'У вас нет доступа к этому ресурсу' }); // Если роль не Manager или Admin, возвращаем ошибку
  }
};

// Middleware для рабочих
const workerMiddleware = (req, res, next) => {
  // Проверяем, что роль пользователя - Worker, Manager или Admin
  if (req.userRole === 'Worker' || req.userRole === 'Manager' || req.userRole === 'Admin') {
    next(); // Если роль Worker, Manager или Admin, передаем управление следующему middleware или контроллеру
  } else {
    res.status(403).json({ error: 'У вас нет доступа к этому ресурсу' }); // Если роль не Worker, Manager или Admin, возвращаем ошибку
  }
};

// Экспортируем middleware для использования в маршрутах (routes)
module.exports = {
  authMiddleware,
  adminMiddleware,
  managerMiddleware,
  workerMiddleware,
};