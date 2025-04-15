// Этот файл содержит контроллеры для работы с событиями (Event).
// Контроллеры обрабатывают HTTP-запросы и взаимодействуют с моделями Event и Area для выполнения операций:
// - Получение списка всех событий
// - Создание нового события
// - Обновление существующего события
// - Удаление события

const { Op } = require('sequelize'); // Импортируем Op из Sequelize для использования операторов
const { Event, Area } = require('../models'); // Импортируем модели Event и Area

// Функция для проверки пересечения событий
const isEventOverlapping = async (start, end, areaId, excludeEventId = null) => {
  const startDate = new Date(start); // Преобразуем начало события в объект Date
  const endDate = end ? new Date(end) : new Date(start); // Преобразуем окончание события в объект Date (если оно есть)

  // Проверяем, что areaId имеет допустимое значение
  if (!areaId) {
    throw new Error('Параметр areaId обязателен.'); // Если areaId не передан, выбрасываем ошибку
  }

  // Ищем события, которые пересекаются с новым событием
  const overlappingEvents = await Event.findAll({
    where: {
      areaId, // Фильтруем по areaId
      [Op.or]: [
        {
          start: {
            [Op.between]: [startDate, endDate], // События, которые начинаются в промежутке
          },
        },
        {
          end: {
            [Op.between]: [startDate, endDate], // События, которые заканчиваются в промежутке
          },
        },
        {
          [Op.and]: [
            { start: { [Op.lte]: startDate } }, // События, которые начинаются до и заканчиваются после
            { end: { [Op.gte]: endDate } },
          ],
        },
      ],
    },
  });

  // Если есть события, которые пересекаются, и они не являются текущим редактируемым событием
  return overlappingEvents.some((event) => event.id !== excludeEventId);
};

// Получение списка всех событий
const getEvents = async (req, res) => {
  try {
    // Получаем все события, включая данные о площадке (Area)
    const events = await Event.findAll({ include: Area });
    res.json(events); // Отправляем список событий в ответе
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Создание нового события
const createEvent = async (req, res) => {
  const { title, start, end, allDay, areaId, capacity } = req.body.title; // Извлекаем данные из тела запроса

  try {
    // Проверяем, что areaId имеет допустимое значение
    if (!areaId) {
      return res.status(400).json({ error: 'Параметр areaId обязателен.' });
    }

    // Проверяем, что начало события раньше окончания
    if (end && new Date(start) >= new Date(end)) {
      return res.status(400).json({ error: 'Начало события должно быть раньше окончания.' });
    }

    // Проверяем, что событие не пересекается с другими событиями
    const isOverlapping = await isEventOverlapping(start, end, areaId);
    if (isOverlapping) {
      return res.status(400).json({ error: 'В выбранный промежуток времени уже есть мероприятие в этой площадке.' });
    }

    // Преобразуем время в UTC
    const startUTC = new Date(start).toISOString();
    const endUTC = end ? new Date(end).toISOString() : null;

    // Создаем новое событие в базе данных
    const event = await Event.create({
      title,
      start: startUTC,
      end: endUTC,
      allDay,
      areaId,
      capacity,
    });
    res.status(201).json(event); // Отправляем созданное событие в ответе
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Обновление существующего события
const updateEvent = async (req, res) => {
  const { id } = req.params; // Извлекаем id события из параметров запроса
  const { title, start, end, allDay, areaId, capacity } = req.body.title; // Извлекаем данные из тела запроса

  try {
    // Находим событие по id
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Событие не найдено' }); // Если событие не найдено, возвращаем ошибку
    }

    // Проверяем, что areaId имеет допустимое значение
    if (!areaId) {
      return res.status(400).json({ error: 'Параметр areaId обязателен.' });
    }

    // Проверяем, что начало события раньше окончания
    if (end && new Date(start) >= new Date(end)) {
      return res.status(400).json({ error: 'Начало события должно быть раньше окончания.' });
    }

    // Проверяем, что событие не пересекается с другими событиями (кроме текущего)
    const isOverlapping = await isEventOverlapping(start, end, areaId, id);
    if (isOverlapping) {
      return res.status(400).json({ error: 'В выбранный промежуток времени уже есть мероприятие в этой площадке.' });
    }

    // Преобразуем время в UTC
    const startUTC = new Date(start).toISOString();
    const endUTC = end ? new Date(end).toISOString() : null;

    // Обновляем данные события
    event.title = title;
    event.start = startUTC;
    event.end = endUTC;
    event.allDay = allDay;
    event.areaId = areaId;
    event.capacity = Number(capacity);
    await event.save(); // Сохраняем изменения в базе данных

    res.json(event); // Отправляем обновленное событие в ответе
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Удаление события
const deleteEvent = async (req, res) => {
  const { id } = req.params; // Извлекаем id события из параметров запроса

  try {
    // Находим событие по id
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Событие не найдено' }); // Если событие не найдено, возвращаем ошибку
    }

    // Удаляем событие из базы данных
    await event.destroy();
    res.json({ message: 'Событие успешно удалено' }); // Отправляем сообщение об успешном удалении
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Экспортируем контроллеры для использования в маршрутах (routes)
module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};