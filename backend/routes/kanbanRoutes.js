// Этот файл содержит маршруты (routes) для работы с канбан-досками (Kanban).
// Маршруты обрабатывают HTTP-запросы и используют контроллеры для выполнения операций:
// - Получение списка всех канбан-досок
// - Создание новой канбан-доски
// - Обновление существующей канбан-доски
// - Удаление канбан-доски

const express = require('express'); // Импортируем Express для создания маршрутов
const router = express.Router(); // Создаем экземпляр маршрутизатора
const kanbanController = require('../controllers/kanbanController'); // Импортируем контроллеры для работы с канбан-досками
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware'); // Импортируем middleware для аутентификации и авторизации

// Маршрут для получения списка всех канбан-досок (доступен всем)
router.get('/', kanbanController.getKanbans);

// Маршрут для создания новой канбан-доски (доступен только администраторам)
router.post('/', [authMiddleware, adminMiddleware], kanbanController.createKanban);

// Маршрут для обновления канбан-доски по ID (доступен только администраторам)
router.put('/:id', [authMiddleware, adminMiddleware], kanbanController.updateKanban);

// Маршрут для удаления канбан-доски по ID (доступен только администраторам)
router.delete('/:id', [authMiddleware, adminMiddleware], kanbanController.deleteKanban);

// Экспортируем маршрутизатор для использования в приложении
module.exports = router;