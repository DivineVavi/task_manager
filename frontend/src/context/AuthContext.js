// Этот файл содержит React-контекст AuthContext, который предоставляет функциональность для управления состоянием аутентификации пользователя.
// Контекст позволяет:
// - Хранить данные пользователя.
// - Входить в систему (логин).
// - Выходить из системы (логин).

import React, { createContext, useState, useContext } from 'react'; // Импортируем React и хуки

// Создаем контекст для аутентификации
const AuthContext = createContext();

// Провайдер для контекста аутентификации
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Состояние для хранения данных пользователя

  // Функция для входа в систему
  const login = (userData) => {
    setUser(userData); // Устанавливаем данные пользователя
  };

  // Функция для выхода из системы
  const logout = () => {
    setUser(null); // Сбрасываем данные пользователя
  };

  // Возвращаем провайдер с данными и функциями
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста аутентификации
export const useAuth = () => useContext(AuthContext);