// Этот файл определяет модель "Event" (Событие) для работы с базой данных.
// Модель описывает структуру таблицы "events" в базе данных и включает поля:
// - id: уникальный идентификатор события
// - title: название события (обязательное поле)
// - start: дата и время начала события (обязательное поле)
// - end: дата и время окончания события (необязательное поле)
// - allDay: флаг, указывающий, является ли событие полнодневным (по умолчанию false)
// - areaId: идентификатор области, к которой относится событие (связь с таблицей areas)
// - capacity: вместимость события (по умолчанию 1)

const { DataTypes } = require('sequelize'); // Импортируем DataTypes из Sequelize для определения типов данных
const sequelize = require('../config/db'); // Импортируем экземпляр Sequelize, настроенный для подключения к базе данных

// Определяем модель "Event" с помощью sequelize.define
const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER, // Тип данных: целое число
    primaryKey: true, // Поле является первичным ключом
    autoIncrement: true, // Значение автоматически увеличивается при добавлении новой записи
  },
  title: {
    type: DataTypes.STRING(255), // Тип данных: строка с максимальной длиной 255 символов
    allowNull: false, // Поле не может быть пустым (обязательное)
  },
  start: {
    type: DataTypes.DATE, // Тип данных: дата и время
    allowNull: false, // Поле не может быть пустым (обязательное)
  },
  end: {
    type: DataTypes.DATE, // Тип данных: дата и время
    allowNull: true, // Поле может быть пустым (необязательное)
  },
  allDay: {
    type: DataTypes.BOOLEAN, // Тип данных: булево значение (true/false)
    defaultValue: false, // Значение по умолчанию: false
  },
  areaId: {
    type: DataTypes.INTEGER, // Тип данных: целое число
    allowNull: false, // Поле не может быть пустым (обязательное)
    references: {
      model: 'areas', // Связь с таблицей areas
      key: 'id', // Поле, с которым устанавливается связь
    },
  },
  capacity: {
    type: DataTypes.INTEGER, // Тип данных: целое число
    defaultValue: 1, // Значение по умолчанию: 1
  },
}, {
  tableName: 'events', // Указываем имя таблицы в базе данных
  timestamps: false, // Отключаем автоматическое добавление полей createdAt и updatedAt
});

// Экспортируем модель для использования в других частях приложения
module.exports = Event;