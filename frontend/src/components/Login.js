// Этот файл содержит React-компонент Login, который предоставляет форму для входа пользователя.
// Компонент позволяет:
// - Вводить имя пользователя и пароль.
// - Отправлять данные на сервер для аутентификации.
// - Сохранять токен, роль пользователя и ID департамента в localStorage.
// - Перенаправлять пользователя на главную страницу после успешного входа.

import React, { useState } from 'react'; // Импортируем React и хук useState
import { login } from '../api'; // Импортируем функцию для входа
import { useNavigate } from 'react-router-dom'; // Импортируем хук для навигации
import { jwtDecode } from 'jwt-decode'; // Импортируем функцию для декодирования JWT
import '../css/login.css'; // Импортируем стили

const Login = () => {
  const [username, setUsername] = useState(''); // Состояние для имени пользователя
  const [password, setPassword] = useState(''); // Состояние для пароля
  const [error, setError] = useState(''); // Состояние для ошибки
  const navigate = useNavigate(); // Хук для навигации

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Сбрасываем ошибку

    try {
      const response = await login(username, password); // Отправляем запрос на вход
      const token = response.data.token; // Получаем токен из ответа
      console.log('Received token:', token); // Логируем токен для отладки

      let decodedToken;
      try {
        decodedToken = jwtDecode(token); // Декодируем токен
      } catch (decodeError) {
        console.error('Error decoding token:', decodeError);
        setError('Ошибка при обработке токена');
        return;
      }
      console.log('Decoded token:', decodedToken); // Логируем декодированный токен для отладки

      const userRole = decodedToken.role; // Получаем роль пользователя из токена
      if (!userRole) {
        console.error('Role not found in token');
        setError('Роль пользователя не найдена в токене');
        return;
      }
      console.log('User Role:', userRole); // Логируем роль пользователя для отладки

      const userDepartmentId = decodedToken.departmentId; // Получаем ID департамента из токена
      if (!userDepartmentId) {
        console.error('Department ID not found in token');
        setError('ID департамента пользователя не найдено в токене');
        return;
      }
      console.log('User Department ID:', userDepartmentId); // Логируем ID департамента для отладки

      // Сохраняем данные в localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userDepartmentId', userDepartmentId);
      localStorage.setItem('username', username);

      // Перенаправляем пользователя на главную страницу
      window.location.href = '/';
    } catch (error) {
      setError('Ошибка входа'); // Устанавливаем сообщение об ошибке
      console.error('Login error:', error); // Логируем ошибку для отладки
    }
  };

  return (
    <div className="login-form">
      <h2>Вход</h2> {/* Заголовок формы */}
      <form onSubmit={handleSubmit}>
        {/* Поле для ввода имени пользователя */}
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Обработчик изменения имени пользователя
        />
        {/* Поле для ввода пароля */}
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Обработчик изменения пароля
        />
        {/* Кнопка для отправки формы */}
        <button type="submit">Войти</button>
        {/* Отображение ошибки, если она есть */}
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Login; // Экспортируем компонент