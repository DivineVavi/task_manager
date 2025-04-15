// Этот файл содержит контроллеры для регистрации и входа пользователей.
// Контроллеры обрабатывают HTTP-запросы и взаимодействуют с моделями User, Department и Role для выполнения операций:
// - Регистрация нового пользователя
// - Вход пользователя в систему

const bcrypt = require('bcryptjs'); // Импортируем bcrypt для хеширования паролей
const jwt = require('jsonwebtoken'); // Импортируем jwt для создания токенов
const { User, Department, Role } = require('../models'); // Импортируем модели User, Department и Role

// Регистрация пользователя
const register = async (req, res) => {
  const { username, password, email, id_department, id_role } = req.body; // Извлекаем данные из тела запроса

  try {
    // Проверяем, существует ли департамент
    const department = await Department.findByPk(id_department);
    if (!department) {
      return res.status(400).json({ error: 'Департамент не найден' }); // Если департамент не найден, возвращаем ошибку
    }

    // Проверяем, существует ли роль
    const role = await Role.findByPk(id_role);
    if (!role) {
      return res.status(400).json({ error: 'Роль не найдена' }); // Если роль не найдена, возвращаем ошибку
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем пользователя в базе данных
    const user = await User.create({
      login: username,
      password: hashedPassword,
      email,
      id_department,
      id_role,
    });

    // Отправляем успешный ответ с сообщением и данными пользователя
    res.status(201).json({ message: 'Пользователь успешно зарегистрирован', user });
  } catch (error) {
    console.log(error); // Логируем ошибку для отладки
    res.status(500).json({ error: error.message }); // Отправляем ошибку в ответе
  }
};

// Вход пользователя
const login = async (req, res) => {
  const { username, password } = req.body; // Извлекаем логин и пароль из тела запроса

  try {
    // Ищем пользователя по логину
    const user = await User.findOne({ where: { login: username } });
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' }); // Если пользователь не найден, возвращаем ошибку
    }

    // Проверяем пароль
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Неверный пароль' }); // Если пароль неверный, возвращаем ошибку
    }

    // Получаем роль пользователя
    const role = await Role.findByPk(user.id_role);
    if (!role) {
      return res.status(500).json({ error: 'Роль пользователя не найдена' }); // Если роль не найдена, возвращаем ошибку
    }

    // Получаем департамент пользователя
    const department = await Department.findByPk(user.id_department);
    if (!department) {
      return res.status(500).json({ error: 'Департамент пользователя не найден' }); // Если департамент не найден, возвращаем ошибку
    }

    // Генерируем JWT токен
    const token = jwt.sign(
      {
        id: user.id, // ID пользователя
        role: role.name, // Название роли пользователя
        departmentId: department.id, // ID департамента пользователя
      },
      process.env.JWT_SECRET, // Секретный ключ для подписи токена
      {
        expiresIn: '1h', // Время жизни токена
      }
    );

    // Отправляем токен в ответе
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message }); // Обрабатываем ошибку, если что-то пошло не так
  }
};

// Экспортируем контроллеры для использования в маршрутах (routes)
module.exports = { register, login };