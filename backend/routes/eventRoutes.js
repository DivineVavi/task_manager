// Этот файл содержит маршруты (routes) для работы с событиями (Event).
// Маршруты обрабатывают HTTP-запросы и используют контроллеры для выполнения операций:
// - Получение списка всех событий
// - Создание нового события
// - Обновление существующего события
// - Удаление события

const express = require('express'); // Импортируем Express для создания маршрутов
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController'); // Импортируем контроллеры для работы с событиями
const { authMiddleware, managerMiddleware } = require('../middlewares/authMiddleware'); // Импортируем middleware для аутентификации и авторизации

const router = express.Router(); // Создаем экземпляр маршрутизатора

// Маршрут для получения списка всех событий (доступен всем)
router.get('/', getEvents);

// Маршрут для создания нового события (доступен только менеджерам)
router.post('/', [authMiddleware, managerMiddleware], createEvent);

// Маршрут для обновления события по ID (доступен только менеджерам)
router.put('/:id', [authMiddleware, managerMiddleware], updateEvent);

// Маршрут для удаления события по ID (доступен только менеджерам)
router.delete('/:id', [authMiddleware, managerMiddleware], deleteEvent);

// Экспортируем маршрутизатор для использования в приложении
module.exports = router;