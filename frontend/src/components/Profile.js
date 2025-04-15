import React, { useEffect, useState } from 'react';
import { getProfile, logout } from '../api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getProfile(token)
        .then((response) => setProfile(response.data))
        .catch(() => alert('Ошибка загрузки профиля'));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout(); // Вызываем API для выхода
      localStorage.removeItem('token'); // Удаляем токен
      navigate('/login'); // Перенаправляем на страницу входа
    } catch (error) {
      alert('Ошибка при выходе');
    }
  };

  return (
    <div>
      <h1>Профиль</h1>
      {profile && <p>ID пользователя: {profile.userId}</p>}
      <button onClick={handleLogout}>Выйти</button>
    </div>
  );
};

export default Profile;