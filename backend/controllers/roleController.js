// Этот файл содержит контроллеры для работы с ролями (Role).
// Контроллеры обрабатывают HTTP-запросы и взаимодействуют с моделью Role для выполнения операций:
// - Получение списка всех ролей
// - Создание новой роли
// - Обновление существующей роли
// - Удаление роли

const { Role } = require('../models'); // Импортируем модель Role

// Получение списка всех ролей
const getRoles = async (req, res) => {
  try {
    // Получаем все роли из базы данных
    const roles = await Role.findAll();
    res.json(roles); // Отправляем список ролей в ответе
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Создание новой роли
const createRole = async (req, res) => {
  const { name } = req.body.name; // Извлекаем название роли из тела запроса

  try {
    // Проверяем, что название роли передано
    if (!name) {
      return res.status(400).json({ error: 'Название роли обязательно' });
    }

    // Создаем новую роль в базе данных
    const role = await Role.create({ name });
    res.status(201).json(role); // Отправляем созданную роль в ответе
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Обновление роли
const updateRole = async (req, res) => {
  const { id } = req.params; // Извлекаем id роли из параметров запроса
  const { name } = req.body.name; // Извлекаем новое название роли из тела запроса

  try {
    // Проверяем, что название роли передано
    if (!name) {
      return res.status(400).json({ error: 'Название роли обязательно' });
    }

    // Находим роль по id
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ error: 'Роль не найдена' }); // Если роль не найдена, возвращаем ошибку
    }

    // Обновляем название роли
    role.name = name;
    await role.save(); // Сохраняем изменения в базе данных

    res.json(role); // Отправляем обновленную роль в ответе
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Удаление роли
const deleteRole = async (req, res) => {
  const { id } = req.params; // Извлекаем id роли из параметров запроса

  try {
    // Находим роль по id
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ error: 'Роль не найдена' }); // Если роль не найдена, возвращаем ошибку
    }

    // Удаляем роль из базы данных
    await role.destroy();
    res.json({ message: 'Роль успешно удалена' }); // Отправляем сообщение об успешном удалении
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Экспортируем контроллеры для использования в маршрутах (routes)
module.exports = {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
};