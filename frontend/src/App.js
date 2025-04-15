// Этот файл содержит основной компонент App, который является корневым компонентом приложения.
// Он настраивает маршрутизацию и отображает навигационное меню в зависимости от состояния аутентификации пользователя.

import React from 'react'; // Импортируем React
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Импортируем компоненты для маршрутизации
import Login from './components/Login'; // Импортируем компонент Login
import Register from './components/Register'; // Импортируем компонент Register
import Departments from './components/Departments'; // Импортируем компонент Departments
import Roles from './components/Roles'; // Импортируем компонент Roles
import Areas from './components/Areas'; // Импортируем компонент Areas
import Calendar from './components/Calendar'; // Импортируем компонент Calendar
import Clnd from './components/Clnd'; // Импортируем компонент Clnd
import Kanban from './components/Kanban'; // Импортируем компонент Kanban

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token'); // Проверяем, авторизован ли пользователь
  const username = localStorage.getItem('username'); // Получаем имя пользователя из localStorage

  return (
    <Router>
      {/* Навигационное меню */}
      <nav className="menu">
        {isAuthenticated ? (
          // Если пользователь авторизован, показываем ссылки на страницы и кнопку выхода
          <>
            <Link to="/">Главная</Link> {' '}
            <Link to="/departments">Департаменты</Link> {' '}
            <Link to="/roles">Роли</Link> {' '}
            <Link to="/areas">Области</Link> {' '}
            <Link to="/calendar">Календарь</Link> {' '}
            <Link to="/kanban">Канбан</Link> {' '}
            <span>Привет, {username}!</span> {' '} {/* Отображаем имя пользователя */}
            <button
              onClick={() => {
                localStorage.removeItem('token'); // Удаляем токен
                localStorage.removeItem('username'); // Удаляем имя пользователя
                window.location.href = '/login'; // Перенаправляем на страницу входа
              }}
            >
              Выйти
            </button>
          </>
        ) : (
          // Если пользователь не авторизован, показываем ссылки на вход и регистрацию
          <>
            <Link to="/login">Вход</Link> {' '}
            <Link to="/register">Регистрация</Link>
          </>
        )}
      </nav>

      {/* Маршруты приложения */}
      <Routes>
        <Route path="/" element={<Clnd />} /> {/* Главная страница */}
        <Route path="/login" element={<Login />} /> {/* Страница входа */}
        <Route path="/register" element={<Register />} /> {/* Страница регистрации */}
        <Route path="/departments" element={<Departments />} /> {/* Страница департаментов */}
        <Route path="/roles" element={<Roles />} /> {/* Страница ролей */}
        <Route path="/areas" element={<Areas />} /> {/* Страница областей */}
        <Route path="/calendar" element={<Calendar />} /> {/* Страница календаря */}
        <Route path="/kanban" element={<Kanban />} /> {/* Страница канбан-доски */}
      </Routes>
    </Router>
  );
};

export default App; // Экспортируем компонент