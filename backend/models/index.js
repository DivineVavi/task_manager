// Этот файл устанавливает связи между моделями в базе данных.
// Связи определяют, как модели взаимодействуют друг с другом, например:
// - Пользователь (User) принадлежит департаменту (Department) и роли (Role).
// - Событие (Event) принадлежит области (Area).
// - Задача (Task) связана с событием (Event), колонкой (Kanban) и департаментом (Department).
// - Колонка (Kanban) принадлежит департаменту (Department).

const sequelize = require('../config/db'); // Импортируем экземпляр Sequelize для подключения к базе данных
const User = require('./User'); // Импортируем модель User
const Department = require('./Department'); // Импортируем модель Department
const Role = require('./Role'); // Импортируем модель Role
const Area = require('./Area'); // Импортируем модель Area
const Event = require('./Event'); // Импортируем модель Event
const Task = require('./Task'); // Импортируем модель Task
const Kanban = require('./Kanban'); // Импортируем модель Kanban

// Устанавливаем связи между моделями

// Связи для User
User.belongsTo(Department, { foreignKey: 'id_department' }); // Пользователь принадлежит департаменту (связь по внешнему ключу id_department)
User.belongsTo(Role, { foreignKey: 'id_role' }); // Пользователь принадлежит роли (связь по внешнему ключу id_role)
Department.hasMany(User, { foreignKey: 'id_department' }); // Департамент имеет много пользователей (связь по внешнему ключу id_department)
Role.hasMany(User, { foreignKey: 'id_role' }); // Роль имеет много пользователей (связь по внешнему ключу id_role)

// Связи для Event
Event.belongsTo(Area, { foreignKey: 'areaId' }); // Событие принадлежит области (связь по внешнему ключу areaId)
Area.hasMany(Event, { foreignKey: 'areaId' }); // Область имеет много событий (связь по внешнему ключу areaId)

// Связи для Task
Task.belongsTo(Event, { foreignKey: 'id_event', as: 'event' }); // Задача связана с событием (связь по внешнему ключу id_event, алиас 'event')
Task.belongsTo(Kanban, { foreignKey: 'id_col', as: 'kanban' }); // Задача связана с колонкой (связь по внешнему ключу id_col, алиас 'kanban')
Task.belongsTo(Department, { foreignKey: 'department_id', as: 'department' }); // Задача связана с департаментом (связь по внешнему ключу department_id, алиас 'department')

// Связи для Kanban
Kanban.belongsTo(Department, { foreignKey: 'department_id', as: 'department' }); // Колонка связана с департаментом (связь по внешнему ключу department_id, алиас 'department')
Department.hasMany(Kanban, { foreignKey: 'department_id', as: 'Kanbans' }); // Департамент имеет много колонок (связь по внешнему ключу department_id, алиас 'Kanbans')

// Экспортируем все модели для использования в других частях приложения
module.exports = {
  User,
  Department,
  Role,
  Area,
  Event,
  Task,
  Kanban,
};