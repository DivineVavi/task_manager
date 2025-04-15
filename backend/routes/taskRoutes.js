// Этот файл содержит маршруты (routes) для работы с задачами (Task).
// Маршруты обрабатывают HTTP-запросы и используют контроллеры для выполнения операций:
// - Получение списка всех задач
// - Создание новой задачи
// - Обновление существующей задачи
// - Удаление задачи

const express = require('express'); // Импортируем Express для создания маршрутов
const router = express.Router(); // Создаем экземпляр маршрутизатора
const taskController = require('../controllers/taskController'); // Импортируем контроллеры для работы с задачами
const { authMiddleware, managerMiddleware, workerMiddleware } = require('../middlewares/authMiddleware'); // Импортируем middleware для аутентификации и авторизации

// Маршрут для получения списка всех задач (доступен всем)
router.get('/', taskController.getTasks);

// Маршрут для создания новой задачи (доступен только менеджерам)
router.post('/', [authMiddleware, managerMiddleware], taskController.createTask);

// Маршрут для обновления задачи по ID (доступен менеджерам и рабочим)
router.put('/:id', [authMiddleware, managerMiddleware, workerMiddleware], taskController.updateTask);

// Маршрут для удаления задачи по ID (доступен только менеджерам)
router.delete('/:id', [authMiddleware, managerMiddleware], taskController.deleteTask);

// Экспортируем маршрутизатор для использования в приложении
module.exports = router;