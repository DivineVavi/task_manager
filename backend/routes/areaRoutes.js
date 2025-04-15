// Этот файл содержит маршруты (routes) для работы с областями (Area).
// Маршруты обрабатывают HTTP-запросы и используют контроллеры для выполнения операций:
// - Получение списка всех областей
// - Создание новой области
// - Обновление существующей области
// - Удаление области

const express = require('express'); // Импортируем Express для создания маршрутов
const {
  getAreas,
  createArea,
  updateArea,
  deleteArea,
} = require('../controllers/areaController'); // Импортируем контроллеры для работы с областями
const { authMiddleware, managerMiddleware } = require('../middlewares/authMiddleware'); // Импортируем middleware для аутентификации и авторизации

const router = express.Router(); // Создаем экземпляр маршрутизатора

// Маршрут для получения списка всех областей (доступен всем)
router.get('/', getAreas);

// Маршрут для создания новой области (доступен только менеджерам и администраторам)
router.post('/', [authMiddleware, managerMiddleware], createArea);

// Маршрут для обновления области (доступен только менеджерам и администраторам)
router.put('/:id', [authMiddleware, managerMiddleware], updateArea);

// Маршрут для удаления области (доступен только менеджерам и администраторам)
router.delete('/:id', [authMiddleware, managerMiddleware], deleteArea);

// Экспортируем маршрутизатор для использования в приложении
module.exports = router;