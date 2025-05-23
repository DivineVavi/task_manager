// Этот файл определяет модель "User" (Пользователь) для работы с базой данных.
// Модель описывает структуру таблицы "users" в базе данных и включает поля:
// - id: уникальный идентификатор пользователя
// - login: логин пользователя (уникальное и обязательное поле)
// - password: пароль пользователя (обязательное поле)
// - email: электронная почта пользователя (уникальное и обязательное поле)
// - id_department: идентификатор департамента, к которому относится пользователь (связь с таблицей Departments)
// - id_role: идентификатор роли пользователя (связь с таблицей Roles)

const { DataTypes } = require('sequelize'); // Импортируем DataTypes из Sequelize для определения типов данных
const sequelize = require('../config/db'); // Импортируем экземпляр Sequelize, настроенный для подключения к базе данных

// Определяем модель "User" с помощью sequelize.define
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER, // Тип данных: целое число
    primaryKey: true, // Поле является первичным ключом
    autoIncrement: true, // Значение автоматически увеличивается при добавлении новой записи
  },
  login: {
    type: DataTypes.STRING(255), // Тип данных: строка с максимальной длиной 255 символов
    unique: true, // Значение должно быть уникальным
    allowNull: false, // Поле не может быть пустым (обязательное)
  },
  password: {
    type: DataTypes.STRING(255), // Тип данных: строка с максимальной длиной 255 символов
    allowNull: false, // Поле не может быть пустым (обязательное)
  },
  email: {
    type: DataTypes.STRING(255), // Тип данных: строка с максимальной длиной 255 символов
    unique: true, // Значение должно быть уникальным
    allowNull: false, // Поле не может быть пустым (обязательное)
  },
  id_department: {
    type: DataTypes.INTEGER, // Тип данных: целое число
    references: {
      model: 'Departments', // Связь с таблицей Departments
      key: 'id', // Поле, с которым устанавливается связь
    },
  },
  id_role: {
    type: DataTypes.INTEGER, // Тип данных: целое число
    references: {
      model: 'Roles', // Связь с таблицей Roles
      key: 'id', // Поле, с которым устанавливается связь
    },
  },
}, {
  tableName: 'users', // Указываем имя таблицы в базе данных
  timestamps: false, // Отключаем автоматическое добавление полей createdAt и updatedAt
});

// Экспортируем модель для использования в других частях приложения
module.exports = User;