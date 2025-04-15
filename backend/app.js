// Этот файл является точкой входа для приложения Express.
// Здесь подключаются все необходимые middleware и маршруты (routes) для работы с API.
// Основные функции:
// - Настройка CORS для разрешения кросс-доменных запросов.
// - Парсинг JSON-тела запросов.
// - Подключение маршрутов для различных модулей приложения.

const express = require('express'); // Импортируем Express для создания приложения
const cors = require('cors'); // Импортируем CORS для обработки кросс-доменных запросов

// Импортируем маршруты для различных модулей
const authRoutes = require('./routes/authRoutes'); // Маршруты для аутентификации
const roleRoutes = require('./routes/roleRoutes'); // Маршруты для ролей
const departmentRoutes = require('./routes/departmentRoutes'); // Маршруты для департаментов
const areaRoutes = require('./routes/areaRoutes'); // Маршруты для областей
const eventRoutes = require('./routes/eventRoutes'); // Маршруты для событий
const taskRoutes = require('./routes/taskRoutes'); // Маршруты для задач
const kanbanRoutes = require('./routes/kanbanRoutes'); // Маршруты для канбан-досок

const app = express(); // Создаем экземпляр приложения Express

// Middleware
app.use(cors()); // Разрешаем кросс-доменные запросы (CORS)
app.use(express.json()); // Парсим JSON-тела запросов

// Маршруты
app.use('/api/auth', authRoutes); // Подключаем маршруты для аутентификации
app.use('/api/roles', roleRoutes); // Подключаем маршруты для ролей
app.use('/api/departments', departmentRoutes); // Подключаем маршруты для департаментов
app.use('/api/areas', areaRoutes); // Подключаем маршруты для областей
app.use('/api/events', eventRoutes); // Подключаем маршруты для событий
app.use('/api/tasks', taskRoutes); // Подключаем маршруты для задач
app.use('/api/kanbans', kanbanRoutes); // Подключаем маршруты для канбан-досок

// Экспортируем приложение для использования в других частях проекта
module.exports = app;