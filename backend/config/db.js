// Этот файл настраивает подключение к базе данных PostgreSQL с использованием Sequelize.
// Он использует переменные окружения, определенные в файле .env, для настройки подключения:
// - DB_NAME: имя базы данных
// - DB_USER: имя пользователя базы данных
// - DB_PASSWORD: пароль пользователя базы данных
// - DB_HOST: хост базы данных

const { Sequelize } = require('sequelize'); // Импортируем Sequelize для работы с базой данных
require('dotenv').config(); // Импортируем dotenv для загрузки переменных окружения из файла .env

// Создаем экземпляр Sequelize для подключения к базе данных
const sequelize = new Sequelize(
  process.env.DB_NAME, // Имя базы данных (берется из переменной окружения DB_NAME)
  process.env.DB_USER, // Имя пользователя базы данных (берется из переменной окружения DB_USER)
  process.env.DB_PASSWORD, // Пароль пользователя базы данных (берется из переменной окружения DB_PASSWORD)
  {
    host: process.env.DB_HOST, // Хост базы данных (берется из переменной окружения DB_HOST)
    dialect: 'postgres', // Используемый диалект базы данных (PostgreSQL)
  }
);

// Экспортируем экземпляр Sequelize для использования в других частях приложения
module.exports = sequelize;