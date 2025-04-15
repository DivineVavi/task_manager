// Этот файл содержит маршруты (routes) для работы с департаментами (Department).
// Маршруты обрабатывают HTTP-запросы и используют контроллеры для выполнения операций:
// - Получение списка всех департаментов
// - Создание нового департамента
// - Обновление существующего департамента
// - Удаление департамента

const express = require('express'); // Импортируем Express для создания маршрутов
const {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController'); // Импортируем контроллеры для работы с департаментами
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware'); // Импортируем middleware для аутентификации и авторизации

const router = express.Router(); // Создаем экземпляр маршрутизатора

// Маршрут для получения списка всех департаментов (доступен всем)
router.get('/', getDepartments);

// Маршрут для создания нового департамента (доступен только администраторам)
router.post('/', [authMiddleware, adminMiddleware], createDepartment);

// Маршрут для обновления департамента по ID (доступен только администраторам)
router.put('/:id', [authMiddleware, adminMiddleware], updateDepartment);

// Маршрут для удаления департамента по ID (доступен только администраторам)
router.delete('/:id', [authMiddleware, adminMiddleware], deleteDepartment);

// Экспортируем маршрутизатор для использования в приложении
module.exports = router;