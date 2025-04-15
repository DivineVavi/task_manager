// Этот файл содержит React-компонент Roles, который предоставляет функциональность для управления ролями.
// Компонент позволяет:
// - Просматривать список ролей.
// - Создавать новые роли (доступно только для администраторов).
// - Редактировать существующие роли (доступно только для администраторов).
// - Удалять роли (доступно только для администраторов).

import React, { useState, useEffect } from 'react'; // Импортируем React и хуки
import { getRoles, createRole, updateRole, deleteRole } from '../api'; // Импортируем функции для работы с API
import '../css/style.css'; // Импортируем стили

const Roles = () => {
  const [roles, setRoles] = useState([]); // Состояние для хранения списка ролей
  const [newRoleName, setNewRoleName] = useState(''); // Состояние для названия новой роли
  const [editRoleId, setEditRoleId] = useState(null); // Состояние для ID редактируемой роли
  const [editRoleName, setEditRoleName] = useState(''); // Состояние для названия редактируемой роли
  const [userRole, setUserRole] = useState(''); // Состояние для роли пользователя

  // Получаем роль пользователя из localStorage
  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  // Загружаем роли при монтировании компонента
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoles(); // Получаем список ролей с сервера
        setRoles(response.data); // Обновляем состояние списка ролей
      } catch (error) {
        console.error('Ошибка при загрузке ролей:', error);
      }
    };
    fetchRoles();
  }, []);

  // Создание новой роли
  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      alert('Название роли не может быть пустым'); // Проверка на пустое название
      return;
    }

    try {
      const response = await createRole({ name: newRoleName }); // Создаем новую роль
      setRoles([...roles, response.data]); // Добавляем новую роль в список
      setNewRoleName(''); // Очищаем поле ввода
    } catch (error) {
      console.error('Ошибка при создании роли:', error);
    }
  };

  // Обновление роли
  const handleUpdateRole = async () => {
    if (!editRoleName.trim()) {
      alert('Название роли не может быть пустым'); // Проверка на пустое название
      return;
    }

    try {
      const response = await updateRole(editRoleId, { name: editRoleName }); // Обновляем роль
      setRoles(roles.map((role) => (role.id === editRoleId ? response.data : role))); // Обновляем список ролей
      setEditRoleId(null); // Сбрасываем ID редактируемой роли
      setEditRoleName(''); // Очищаем поле ввода
    } catch (error) {
      console.error('Ошибка при обновлении роли:', error);
    }
  };

  // Удаление роли
  const handleDeleteRole = async (id) => {
    try {
      await deleteRole(id); // Удаляем роль
      setRoles(roles.filter((role) => role.id !== id)); // Обновляем список ролей
    } catch (error) {
      console.error('Ошибка при удалении роли:', error);
    }
  };

  // Проверка разрешений
  const canCreateRole = userRole === 'Admin'; // Может ли пользователь создавать роли
  const canEditRole = userRole === 'Admin'; // Может ли пользователь редактировать роли
  const canDeleteRole = userRole === 'Admin'; // Может ли пользователь удалять роли

  return (
    <div className="container">
      <h1>Управление ролями</h1> {/* Заголовок страницы */}

      {/* Форма для создания роли */}
      {canCreateRole && (
        <div className="create-role">
          <input
            type="text"
            placeholder="Новая роль"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)} // Обработчик изменения названия
          />
          <button onClick={handleCreateRole}>Создать</button> {/* Кнопка создания */}
        </div>
      )}

      {/* Список ролей */}
      <ul className="role-list">
        {roles.map((role) => (
          <li key={role.id}>
            {role.id === editRoleId ? (
              // Форма редактирования роли
              <>
                <input
                  type="text"
                  value={editRoleName}
                  onChange={(e) => setEditRoleName(e.target.value)} // Обработчик изменения названия
                />
                <button className="save" onClick={handleUpdateRole}>
                  Сохранить
                </button>
                <button className="cancel" onClick={() => setEditRoleId(null)}>
                  Отмена
                </button>
              </>
            ) : (
              // Отображение роли
              <>
                {role.name}
                {canEditRole && (
                  <button
                    className="edit"
                    onClick={() => {
                      setEditRoleId(role.id); // Устанавливаем ID редактируемой роли
                      setEditRoleName(role.name); // Устанавливаем название для редактирования
                    }}
                  >
                    Редактировать
                  </button>
                )}
                {canDeleteRole && (
                  <button
                    className="delete"
                    onClick={() => handleDeleteRole(role.id)} // Удаление роли
                  >
                    Удалить
                  </button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Roles; // Экспортируем компонент