// Этот файл определяет модель "Task" (Задача) для работы с базой данных.
// Модель описывает структуру таблицы "tasks" в базе данных и включает поля:
// - id: уникальный идентификатор задачи
// - name: название задачи (обязательное поле)
// - id_event: идентификатор события, к которому относится задача (опциональное поле, связь с таблицей events)
// - id_col: идентификатор колонки, к которой относится задача (связь с таблицей kanban)
// - department_id: идентификатор департамента, к которому относится задача (связь с таблицей departments)

const { DataTypes } = require('sequelize'); // Импортируем DataTypes из Sequelize для определения типов данных
const sequelize = require('../config/db'); // Импортируем экземпляр Sequelize, настроенный для подключения к базе данных

// Определяем модель "Task" с помощью sequelize.define
const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER, // Тип данных: целое число
    primaryKey: true, // Поле является первичным ключом
    autoIncrement: true, // Значение автоматически увеличивается при добавлении новой записи
  },
  name: {
    type: DataTypes.STRING(255), // Тип данных: строка с максимальной длиной 255 символов
    allowNull: false, // Поле не может быть пустым (обязательное)
  },
  id_event: {
    type: DataTypes.INTEGER, // Тип данных: целое число
    allowNull: true, // Поле может быть пустым (опциональное)
    references: {
      model: 'events', // Связь с таблицей events
      key: 'id', // Поле, с которым устанавливается связь
    },
  },
  id_col: {
    type: DataTypes.INTEGER, // Тип данных: целое число
    allowNull: false, // Поле не может быть пустым (обязательное)
    references: {
      model: 'kanban', // Связь с таблицей kanban (колонки)
      key: 'id', // Поле, с которым устанавливается связь
    },
  },
  department_id: {
    type: DataTypes.INTEGER, // Тип данных: целое число
    allowNull: false, // Поле не может быть пустым (обязательное)
    references: {
      model: 'departments', // Связь с таблицей departments
      key: 'id', // Поле, с которым устанавливается связь
    },
  },
}, {
  tableName: 'tasks', // Указываем имя таблицы в базе данных
  timestamps: false, // Отключаем автоматическое добавление полей createdAt и updatedAt
});

// Экспортируем модель для использования в других частях приложения
module.exports = Task;