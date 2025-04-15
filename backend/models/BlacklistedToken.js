// Этот файл определяет модель "BlacklistedToken" (Черный список токенов) для работы с базой данных.
// Модель описывает структуру таблицы "BlacklistedTokens" в базе данных и включает поле:
// - token: строка, представляющая токен, который был добавлен в черный список (уникальное значение)

const { DataTypes } = require('sequelize'); // Импортируем DataTypes из Sequelize для определения типов данных
const sequelize = require('../config/db'); // Импортируем экземпляр Sequelize, настроенный для подключения к базе данных

// Определяем модель "BlacklistedToken" с помощью sequelize.define
const BlacklistedToken = sequelize.define('BlacklistedToken', {
  token: {
    type: DataTypes.STRING, // Тип данных: строка
    allowNull: false, // Поле не может быть пустым (обязательное)
    unique: true, // Значение должно быть уникальным в таблице
  },
});

// Экспортируем модель для использования в других частях приложения
module.exports = BlacklistedToken;