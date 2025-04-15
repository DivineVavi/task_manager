// Этот файл определяет модель "Department" (Департамент) для работы с базой данных.
// Модель описывает структуру таблицы "departments" в базе данных и включает поля:
// - id: уникальный идентификатор департамента
// - name: название департамента (обязательное поле)

const { DataTypes } = require('sequelize'); // Импортируем DataTypes из Sequelize для определения типов данных
const sequelize = require('../config/db'); // Импортируем экземпляр Sequelize, настроенный для подключения к базе данных

// Определяем модель "Department" с помощью sequelize.define
const Department = sequelize.define('Department', {
  id: {
    type: DataTypes.INTEGER, // Тип данных: целое число
    primaryKey: true, // Поле является первичным ключом
    autoIncrement: true, // Значение автоматически увеличивается при добавлении новой записи
  },
  name: {
    type: DataTypes.STRING(255), // Тип данных: строка с максимальной длиной 255 символов
    allowNull: false, // Поле не может быть пустым (обязательное)
  },
}, {
  tableName: 'departments', // Указываем имя таблицы в базе данных
  timestamps: false, // Отключаем автоматическое добавление полей createdAt и updatedAt
});

// Экспортируем модель для использования в других частях приложения
module.exports = Department;