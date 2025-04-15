// Этот файл содержит контроллеры для работы с колонками канбан-доски (Kanban).
// Контроллеры обрабатывают HTTP-запросы и взаимодействуют с моделями Kanban и Department для выполнения операций:
// - Получение списка всех колонок
// - Создание новой колонки
// - Обновление существующей колонки
// - Удаление колонки

const { Kanban, Department } = require('../models'); // Импортируем модели Kanban и Department

// Получение списка всех колонок
const getKanbans = async (req, res) => {
  try {
    // Получаем все колонки, включая данные о департаменте (Department)
    const kanbans = await Kanban.findAll({
      include: [{ model: Department, as: 'department' }], // Включаем данные о департаменте с правильным алиасом
    });
    
    res.json(kanbans); // Отправляем список колонок в ответе
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Создание новой колонки
const createKanban = async (req, res) => {
  const { title, ogr, department_id } = req.body; // Извлекаем данные из тела запроса

  // Проверяем, что все обязательные поля заполнены
  if (!title || !ogr || !department_id) {
    return res.status(400).json({ error: 'Название колонки, ogr и ID департамента обязательны' });
  }

  try {
    // Создаем новую колонку в базе данных
    const kanban = await Kanban.create({ title, ogr, department_id });
    res.status(201).json(kanban); // Отправляем созданную колонку в ответе
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Обновление колонки
const updateKanban = async (req, res) => {
  const { id } = req.params; // Извлекаем id колонки из параметров запроса
  const { title, ogr, department_id } = req.body; // Извлекаем данные из тела запроса

  // Проверяем, что все обязательные поля заполнены
  if (!title || !ogr || !department_id) {
    return res.status(400).json({ error: 'Название колонки, ogr и ID департамента обязательны' });
  }

  try {
    // Находим колонку по id
    const kanban = await Kanban.findByPk(id);
    if (!kanban) {
      return res.status(404).json({ error: 'Колонка не найдена' }); // Если колонка не найдена, возвращаем ошибку
    }

    // Обновляем данные колонки
    kanban.title = title;
    kanban.ogr = ogr;
    kanban.department_id = department_id;

    await kanban.save(); // Сохраняем изменения в базе данных

    res.json(kanban); // Отправляем обновленную колонку в ответе
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Удаление колонки
const deleteKanban = async (req, res) => {
  const { id } = req.params; // Извлекаем id колонки из параметров запроса

  try {
    // Находим колонку по id
    const kanban = await Kanban.findByPk(id);
    if (!kanban) {
      return res.status(404).json({ error: 'Колонка не найдена' }); // Если колонка не найдена, возвращаем ошибку
    }

    // Удаляем колонку из базы данных
    await kanban.destroy();
    res.json({ message: 'Колонка успешно удалена' }); // Отправляем сообщение об успешном удалении
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Экспортируем контроллеры для использования в маршрутах (routes)
module.exports = {
  getKanbans,
  createKanban,
  updateKanban,
  deleteKanban,
};