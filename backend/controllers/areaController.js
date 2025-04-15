// Этот файл содержит контроллеры для работы с площадками (Area).
// Контроллеры обрабатывают HTTP-запросы и взаимодействуют с моделью Area для выполнения операций:
// - Получение списка всех площадок
// - Создание новой площадки
// - Обновление существующей площадки
// - Удаление площадки

const { Area } = require('../models'); // Импортируем модель Area для работы с базой данных

// Получение списка всех площадок
const getAreas = async (req, res) => {
  try {
    const areas = await Area.findAll(); // Получаем все записи из таблицы areas
    res.json(areas); // Отправляем список площадок в ответе
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Создание новой площадки
const createArea = async (req, res) => {
  const { name, capacity } = req.body.name; // Извлекаем name и capacity из тела запроса

  // Проверяем, что name и capacity переданы
  if (!name || !capacity) {
    return res.status(400).json({ error: 'Название и вместимость обязательны' });
  }

  try {
    // Создаем новую площадку в базе данных
    const area = await Area.create({ name, capacity });
    res.status(201).json(area); // Отправляем созданную площадку в ответе
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Обновление существующей площадки
const updateArea = async (req, res) => {
  const { id } = req.params; // Извлекаем id площадки из параметров запроса
  const { name, capacity } = req.body.name; // Извлекаем name и capacity из тела запроса

  // Проверяем, что name и capacity переданы
  if (!name || !capacity) {
    return res.status(400).json({ error: 'Название и вместимость обязательны' });
  }

  try {
    // Находим площадку по id
    const area = await Area.findByPk(id);
    if (!area) {
      return res.status(404).json({ error: 'Площадка не найдена' }); // Если площадка не найдена, возвращаем ошибку
    }

    // Обновляем данные площадки
    area.name = name;
    area.capacity = capacity;
    await area.save(); // Сохраняем изменения в базе данных

    res.json(area); // Отправляем обновленную площадку в ответе
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Удаление площадки
const deleteArea = async (req, res) => {
  const { id } = req.params; // Извлекаем id площадки из параметров запроса

  try {
    // Находим площадку по id
    const area = await Area.findByPk(id);
    if (!area) {
      return res.status(404).json({ error: 'Площадка не найдена' }); // Если площадка не найдена, возвращаем ошибку
    }

    // Удаляем площадку из базы данных
    await area.destroy();
    res.json({ message: 'Площадка успешно удалена' }); // Отправляем сообщение об успешном удалении
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Экспортируем контроллеры для использования в маршрутах (routes)
module.exports = {
  getAreas,
  createArea,
  updateArea,
  deleteArea,
};