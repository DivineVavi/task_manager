// Этот файл содержит функции для взаимодействия с API бэкенда.
// Используется библиотека axios для выполнения HTTP-запросов.
// Все функции создают экземпляр axios с авторизационным заголовком, если токен доступен.

import axios from 'axios'; // Импортируем axios для выполнения HTTP-запросов

const API_URL = 'http://localhost:5000/api'; // Укажите URL вашего бэкенда

// Функция для создания экземпляра axios с авторизационным заголовком
const createAxiosInstance = () => {
  const token = localStorage.getItem('token'); // Получаем токен из localStorage
  return axios.create({
    baseURL: API_URL, // Базовый URL для всех запросов
    headers: token ? { Authorization: `Bearer ${token}` } : {}, // Добавляем токен в заголовок, если он есть
  });
};

// Аутентификация

/**
 * Регистрация нового пользователя.
 * @param {string} username - Имя пользователя.
 * @param {string} password - Пароль.
 * @param {string} email - Email.
 * @param {number} id_department - ID департамента.
 * @param {number} id_role - ID роли.
 */
export const register = async (username, password, email, id_department, id_role) => {
  return axios.post(`${API_URL}/auth/register`, {
    username,
    password,
    email,
    id_department,
    id_role,
  });
};

/**
 * Вход пользователя.
 * @param {string} username - Имя пользователя.
 * @param {string} password - Пароль.
 */
export const login = async (username, password) => {
  return axios.post(`${API_URL}/auth/login`, {
    username,
    password,
  });
};

/**
 * Выход пользователя.
 */
export const logout = async () => {
  const instance = createAxiosInstance();
  return instance.post('/auth/logout');
};

// Роли

/**
 * Получение списка ролей.
 */
export const getRoles = async () => {
  const instance = createAxiosInstance();
  return instance.get('/roles');
};

/**
 * Создание новой роли.
 * @param {string} name - Название роли.
 */
export const createRole = async (name) => {
  const instance = createAxiosInstance();
  return instance.post('/roles', { name });
};

/**
 * Обновление роли.
 * @param {number} id - ID роли.
 * @param {string} name - Новое название роли.
 */
export const updateRole = async (id, name) => {
  const instance = createAxiosInstance();
  return instance.put(`/roles/${id}`, { name });
};

/**
 * Удаление роли.
 * @param {number} id - ID роли.
 */
export const deleteRole = async (id) => {
  const instance = createAxiosInstance();
  return instance.delete(`/roles/${id}`);
};

// Департаменты

/**
 * Получение списка департаментов.
 */
export const getDepartments = async () => {
  const instance = createAxiosInstance();
  return instance.get('/departments');
};

/**
 * Создание нового департамента.
 * @param {string} name - Название департамента.
 */
export const createDepartment = async (name) => {
  const instance = createAxiosInstance();
  return instance.post('/departments', { name });
};

/**
 * Обновление департамента.
 * @param {number} id - ID департамента.
 * @param {string} name - Новое название департамента.
 */
export const updateDepartment = async (id, name) => {
  const instance = createAxiosInstance();
  return instance.put(`/departments/${id}`, { name });
};

/**
 * Удаление департамента.
 * @param {number} id - ID департамента.
 */
export const deleteDepartment = async (id) => {
  const instance = createAxiosInstance();
  return instance.delete(`/departments/${id}`);
};

// Области (Area)

/**
 * Получение списка областей.
 */
export const getAreas = async () => {
  const instance = createAxiosInstance();
  return instance.get('/areas');
};

/**
 * Создание новой области.
 * @param {string} name - Название области.
 * @param {number} capacity - Вместимость области.
 */
export const createArea = async (name, capacity) => {
  const instance = createAxiosInstance();
  return instance.post('/areas', { name, capacity });
};

/**
 * Обновление области.
 * @param {number} id - ID области.
 * @param {string} name - Новое название области.
 * @param {number} capacity - Новая вместимость области.
 */
export const updateArea = async (id, name, capacity) => {
  const instance = createAxiosInstance();
  return instance.put(`/areas/${id}`, { name, capacity });
};

/**
 * Удаление области.
 * @param {number} id - ID области.
 */
export const deleteArea = async (id) => {
  const instance = createAxiosInstance();
  return instance.delete(`/areas/${id}`);
};

// События (Events)

/**
 * Получение списка событий.
 */
export const getEvents = async () => {
  const instance = createAxiosInstance();
  return instance.get('/events');
};

/**
 * Создание нового события.
 * @param {string} title - Название события.
 * @param {string} start - Время начала события.
 * @param {string} end - Время окончания события.
 * @param {boolean} allDay - Флаг "весь день".
 * @param {number} areaId - ID области.
 */
export const createEvent = async (title, start, end, allDay, areaId) => {
  const instance = createAxiosInstance();
  return instance.post('/events', { title, start, end, allDay, areaId });
};

/**
 * Обновление события.
 * @param {number} id - ID события.
 * @param {string} title - Новое название события.
 * @param {string} start - Новое время начала события.
 * @param {string} end - Новое время окончания события.
 * @param {boolean} allDay - Новый флаг "весь день".
 * @param {number} areaId - Новый ID области.
 */
export const updateEvent = async (id, title, start, end, allDay, areaId) => {
  const instance = createAxiosInstance();
  return instance.put(`/events/${id}`, { title, start, end, allDay, areaId });
};

/**
 * Удаление события.
 * @param {number} id - ID события.
 */
export const deleteEvent = async (id) => {
  const instance = createAxiosInstance();
  return instance.delete(`/events/${id}`);
};

// Профиль пользователя

/**
 * Получение профиля пользователя (пример защищенного запроса).
 */
export const getProfile = async () => {
  const instance = createAxiosInstance();
  return instance.get('/auth/profile');
};

// Колонки Kanban

/**
 * Получение списка колонок Kanban.
 */
export const getKanbans = async () => {
  const instance = createAxiosInstance();
  return instance.get('/kanbans');
};

/**
 * Создание новой колонки Kanban.
 * @param {string} title - Название колонки.
 * @param {number} ogr - Ограничение по количеству задач.
 * @param {number} department_id - ID департамента.
 */
export const createKanban = async (title, ogr, department_id) => {
  const instance = createAxiosInstance();
  return instance.post('/kanbans', { title, ogr, department_id });
};

/**
 * Обновление колонки Kanban.
 * @param {number} id - ID колонки.
 * @param {string} title - Новое название колонки.
 * @param {number} ogr - Новое ограничение по количеству задач.
 * @param {number} department_id - Новый ID департамента.
 */
export const updateKanban = async (id, title, ogr, department_id) => {
  const instance = createAxiosInstance();
  return instance.put(`/kanbans/${id}`, { title, ogr, department_id });
};

/**
 * Удаление колонки Kanban.
 * @param {number} id - ID колонки.
 */
export const deleteKanban = async (id) => {
  const instance = createAxiosInstance();
  return instance.delete(`/kanbans/${id}`);
};

// Задачи (Tasks)

/**
 * Получение списка задач.
 */
export const getTasks = async () => {
  const instance = createAxiosInstance();
  return instance.get('/tasks');
};

/**
 * Создание новой задачи.
 * @param {string} name - Название задачи.
 * @param {number} id_event - ID события (опционально).
 * @param {number} id_col - ID колонки.
 * @param {number} department_id - ID департамента.
 */
export const createTask = async (name, id_event, id_col, department_id) => {
  const instance = createAxiosInstance();
  return instance.post('/tasks', { name, id_event, id_col, department_id });
};

/**
 * Обновление задачи.
 * @param {number} id - ID задачи.
 * @param {object} updates - Обновленные данные задачи.
 */
export const updateTask = async (id, updates) => {
  const instance = createAxiosInstance();
  return instance.put(`/tasks/${id}`, updates);
};

/**
 * Удаление задачи.
 * @param {number} id - ID задачи.
 */
export const deleteTask = async (id) => {
  const instance = createAxiosInstance();
  return instance.delete(`/tasks/${id}`);
};