// Этот файл содержит маршруты (routes) для работы с ролями (Role).
// Маршруты обрабатывают HTTP-запросы и используют контроллеры для выполнения операций:
// - Получение списка всех ролей
// - Создание новой роли
// - Обновление существующей роли
// - Удаление роли

const express = require('express'); // Импортируем Express для создания маршрутов
const {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} = require('../controllers/roleController'); // Импортируем контроллеры для работы с ролями
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware'); // Импортируем middleware для аутентификации и авторизации

const router = express.Router(); // Создаем экземпляр маршрутизатора

// Маршрут для получения списка всех ролей (доступен всем)
router.get('/', getRoles);

// Маршрут для создания новой роли (доступен только администраторам)
router.post('/', [authMiddleware, adminMiddleware], createRole);

// Маршрут для обновления роли по ID (доступен только администраторам)
router.put('/:id', [authMiddleware, adminMiddleware], updateRole);

// Маршрут для удаления роли по ID (доступен только администраторам)
router.delete('/:id', [authMiddleware, adminMiddleware], deleteRole);

// Экспортируем маршрутизатор для использования в приложении
module.exports = router;