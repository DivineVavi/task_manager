// Этот файл содержит контроллеры для работы с задачами (Task).
// Контроллеры обрабатывают HTTP-запросы и взаимодействуют с моделями Task, Event, Kanban и Department для выполнения операций:
// - Получение списка всех задач с данными о связанных событиях, колонках и департаментах
// - Создание новой задачи
// - Обновление существующей задачи
// - Удаление задачи

const { Task, Event, Kanban, Department } = require('../models'); // Импортируем модели Task, Event, Kanban и Department

// Получение списка всех задач
const getTasks = async (req, res) => {
  try {
    // Получаем все задачи, включая данные о связанных событиях, колонках и департаментах
    const tasks = await Task.findAll({
      include: [
        { model: Event, as: 'event' }, // Включаем данные о событии с правильным алиасом
        { model: Kanban, as: 'kanban' }, // Включаем данные о колонке с правильным алиасом
        { model: Department, as: 'department' }, // Включаем данные о департаменте с правильным алиасом
      ],
    });
    res.json(tasks); // Отправляем список задач в ответе
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Создание новой задачи
const createTask = async (req, res) => {
  console.log(req.body);
  const { name, id_event, id_col, department_id } = req.body.name; // Извлекаем данные из тела запроса

  // Проверяем, что все обязательные поля заполнены
  if (!name || !id_col || !department_id) {
    return res.status(400).json({ error: 'Название задачи, ID колонки и ID департамента обязательны' });
  }

  try {
    // Создаем новую задачу в базе данных
    const task = await Task.create({ name, id_event, id_col, department_id });
    res.status(201).json(task); // Отправляем созданную задачу в ответе
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Обновление задачи
const updateTask = async (req, res) => {
  console.log(req.body);
  const { id } = req.params; // Извлекаем id задачи из параметров запроса
  const { name, id_event, id_col, department_id } = req.body; // Извлекаем данные из тела запроса

  // Проверяем, что все обязательные поля заполнены
  if (!name || !id_col || !department_id) {
    return res.status(400).json({ error: 'Название задачи, ID колонки и ID департамента обязательны' });
  }

  try {
    // Находим задачу по id
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Задача не найдена' }); // Если задача не найдена, возвращаем ошибку
    }

    // Обновляем данные задачи
    task.name = name;
    task.id_event = id_event;
    task.id_col = id_col;
    task.department_id = department_id;

    await task.save(); // Сохраняем изменения в базе данных

    res.json(task); // Отправляем обновленную задачу в ответе
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Удаление задачи
const deleteTask = async (req, res) => {
  const { id } = req.params; // Извлекаем id задачи из параметров запроса

  try {
    // Находим задачу по id
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Задача не найдена' }); // Если задача не найдена, возвращаем ошибку
    }

    // Удаляем задачу из базы данных
    await task.destroy();
    res.json({ message: 'Задача успешно удалена' }); // Отправляем сообщение об успешном удалении
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Экспортируем контроллеры для использования в маршрутах (routes)
module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};