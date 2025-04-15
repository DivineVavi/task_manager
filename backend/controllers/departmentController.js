// Этот файл содержит контроллеры для работы с департаментами.
// Контроллеры обрабатывают HTTP-запросы и взаимодействуют с моделями Department и Kanban для выполнения операций:
// - Получение списка всех департаментов
// - Создание нового департамента
// - Обновление существующего департамента
// - Удаление департамента

const { Department, Kanban } = require('../models'); // Импортируем модели Department и Kanban

// Получение списка всех департаментов
const getDepartments = async (req, res) => {
  try {
    // Получаем все департаменты, включая связанные канбан-доски
    const departments = await Department.findAll({
      include: [{ model: Kanban, as: 'Kanbans' }], // Включаем данные о канбан-досках с алиасом 'Kanbans'
    });
    res.json(departments); // Отправляем список департаментов в ответе
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Создание нового департамента
const createDepartment = async (req, res) => {
  const { name } = req.body.name; // Извлекаем название департамента из тела запроса

  // Проверяем, что название передано
  if (!name) {
    return res.status(400).json({ error: 'Название департамента обязательно' });
  }

  try {
    // Создаем новый департамент в базе данных
    const department = await Department.create({ name });

    // Создаем стандартные колонки для канбан-доски нового департамента
    const columns = [
      { title: 'To do', ogr: 8, department_id: department.id }, // Колонка "To do"
      { title: 'In progress', ogr: 8, department_id: department.id }, // Колонка "In progress"
      { title: 'Review', ogr: 8, department_id: department.id }, // Колонка "Review"
      { title: 'Done', ogr: 8, department_id: department.id }, // Колонка "Done"
    ];
    await Kanban.bulkCreate(columns); // Создаем колонки в базе данных

    res.status(201).json(department); // Отправляем созданный департамент в ответе
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Обновление департамента
const updateDepartment = async (req, res) => {
  const { id } = req.params; // Извлекаем id департамента из параметров запроса
  const { name } = req.body.name; // Извлекаем новое название департамента из тела запроса

  // Проверяем, что название передано
  if (!name) {
    return res.status(400).json({ error: 'Название департамента обязательно' });
  }

  try {
    // Находим департамент по id
    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({ error: 'Департамент не найден' }); // Если департамент не найден, возвращаем ошибку
    }

    // Обновляем название департамента
    department.name = name;
    await department.save(); // Сохраняем изменения в базе данных

    res.json(department); // Отправляем обновленный департамент в ответе
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Удаление департамента
const deleteDepartment = async (req, res) => {
  const { id } = req.params; // Извлекаем id департамента из параметров запроса

  try {
    // Находим департамент по id
    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({ error: 'Департамент не найден' }); // Если департамент не найден, возвращаем ошибку
    }

    // Удаляем департамент (каскадное удаление удалит связанные канбан-доски и задачи)
    await department.destroy();
    res.json({ message: 'Департамент успешно удален' }); // Отправляем сообщение об успешном удалении
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Экспортируем контроллеры для использования в маршрутах (routes)
module.exports = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};