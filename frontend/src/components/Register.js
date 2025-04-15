// Этот файл содержит React-компонент Register, который предоставляет форму для регистрации нового пользователя.
// Компонент позволяет:
// - Вводить имя пользователя, пароль, email, выбирать департамент и роль.
// - Отправлять данные на сервер для регистрации.
// - Перенаправлять пользователя на страницу входа после успешной регистрации.

import React, { useState, useEffect } from 'react'; // Импортируем React и хуки
import { register, getDepartments, getRoles } from '../api'; // Импортируем функции для регистрации и получения данных
import { useNavigate } from 'react-router-dom'; // Импортируем хук для навигации
import '../css/register.css'; // Импортируем стили

const Register = () => {
  const [username, setUsername] = useState(''); // Состояние для имени пользователя
  const [password, setPassword] = useState(''); // Состояние для пароля
  const [email, setEmail] = useState(''); // Состояние для email
  const [departmentId, setDepartmentId] = useState(''); // Состояние для ID департамента
  const [roleId, setRoleId] = useState(''); // Состояние для ID роли
  const [departments, setDepartments] = useState([]); // Состояние для списка департаментов
  const [roles, setRoles] = useState([]); // Состояние для списка ролей
  const navigate = useNavigate(); // Хук для навигации

  // Загружаем департаменты и роли при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        const departmentsResponse = await getDepartments(); // Получаем список департаментов
        const rolesResponse = await getRoles(); // Получаем список ролей
        setDepartments(departmentsResponse.data); // Обновляем состояние департаментов
        setRoles(rolesResponse.data); // Обновляем состояние ролей
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error); // Логируем ошибку
      }
    };
    fetchData();
  }, []);

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, password, email, departmentId, roleId); // Отправляем данные на сервер для регистрации
      alert('Пользователь успешно зарегистрирован'); // Уведомление об успешной регистрации
      navigate('/login'); // Перенаправляем пользователя на страницу входа
    } catch (error) {
      alert('Ошибка регистрации: ' + error.message); // Уведомление об ошибке
    }
  };

  return (
    <div className="register-form">
      <h1>Регистрация</h1> {/* Заголовок формы */}
      <form onSubmit={handleSubmit}>
        {/* Поле для ввода имени пользователя */}
        <div>
          <label>Имя пользователя:</label>
          <input
            type="text"
            placeholder="Введите имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Обработчик изменения имени пользователя
            required
          />
        </div>

        {/* Поле для ввода пароля */}
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Обработчик изменения пароля
            required
          />
        </div>

        {/* Поле для ввода email */}
        <div>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Обработчик изменения email
            required
          />
        </div>

        {/* Выпадающий список для выбора департамента */}
        <div>
          <label>Департамент:</label>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)} // Обработчик изменения департамента
            required
          >
            <option value="">Выберите департамент</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        {/* Выпадающий список для выбора роли */}
        <div>
          <label>Роль:</label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)} // Обработчик изменения роли
            required
          >
            <option value="">Выберите роль</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {/* Кнопка для отправки формы */}
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
};

export default Register; // Экспортируем компонент