// Этот файл содержит React-компонент Departments, который предоставляет функциональность для управления департаментами.
// Компонент позволяет:
// - Просматривать список департаментов.
// - Создавать новые департаменты (доступно только для администраторов).
// - Редактировать существующие департаменты (доступно только для администраторов).
// - Удалять департаменты (доступно только для администраторов).

import React, { useState, useEffect } from 'react'; // Импортируем React и хуки
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../api'; // Импортируем функции для работы с API
import '../css/style.css'; // Импортируем стили

const Departments = () => {
  const [departments, setDepartments] = useState([]); // Состояние для хранения списка департаментов
  const [newDepartmentName, setNewDepartmentName] = useState(''); // Состояние для названия нового департамента
  const [editDepartmentId, setEditDepartmentId] = useState(null); // Состояние для ID редактируемого департамента
  const [editDepartmentName, setEditDepartmentName] = useState(''); // Состояние для названия редактируемого департамента
  const [userRole, setUserRole] = useState(''); // Состояние для роли пользователя

  // Получаем роль пользователя из localStorage
  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  // Загружаем департаменты при монтировании компонента
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartments(); // Получаем список департаментов с сервера
        setDepartments(response.data); // Обновляем состояние списка департаментов
      } catch (error) {
        console.error('Ошибка при загрузке департаментов:', error);
      }
    };
    fetchDepartments();
  }, []);

  // Создание нового департамента
  const handleCreateDepartment = async () => {
    if (!newDepartmentName.trim()) {
      alert('Название департамента не может быть пустым'); // Проверка на пустое название
      return;
    }

    try {
      const response = await createDepartment({ name: newDepartmentName }); // Создаем новый департамент
      setDepartments([...departments, response.data]); // Добавляем новый департамент в список
      setNewDepartmentName(''); // Очищаем поле ввода
    } catch (error) {
      console.error('Ошибка при создании департамента:', error);
    }
  };

  // Обновление департамента
  const handleUpdateDepartment = async () => {
    if (!editDepartmentName.trim()) {
      alert('Название департамента не может быть пустым'); // Проверка на пустое название
      return;
    }

    try {
      const response = await updateDepartment(editDepartmentId, {
        name: editDepartmentName,
      }); // Обновляем департамент
      setDepartments(
        departments.map((department) =>
          department.id === editDepartmentId ? response.data : department // Обновляем список департаментов
        )
      );
      setEditDepartmentId(null); // Сбрасываем ID редактируемого департамента
      setEditDepartmentName(''); // Очищаем поле ввода
    } catch (error) {
      console.error('Ошибка при обновлении департамента:', error);
    }
  };

  // Удаление департамента
  const handleDeleteDepartment = async (id) => {
    try {
      await deleteDepartment(id); // Удаляем департамент
      setDepartments(departments.filter((department) => department.id !== id)); // Обновляем список департаментов
    } catch (error) {
      console.error('Ошибка при удалении департамента:', error);
    }
  };

  // Проверка разрешений
  const canCreateDepartment = userRole === 'Admin'; // Может ли пользователь создавать департаменты
  const canEditDepartment = userRole === 'Admin'; // Может ли пользователь редактировать департаменты
  const canDeleteDepartment = userRole === 'Admin'; // Может ли пользователь удалять департаменты

  return (
    <div className="container">
      <h1>Управление департаментами</h1> {/* Заголовок страницы */}

      {/* Форма для создания департамента */}
      {canCreateDepartment && (
        <div className="create-department">
          <input
            type="text"
            placeholder="Новый департамент"
            value={newDepartmentName}
            onChange={(e) => setNewDepartmentName(e.target.value)} // Обработчик изменения названия
          />
          <button onClick={handleCreateDepartment}>Создать</button> {/* Кнопка создания */}
        </div>
      )}

      {/* Список департаментов */}
      <ul className="department-list">
        {departments.map((department) => (
          <li key={department.id}>
            {department.id === editDepartmentId ? (
              // Форма редактирования департамента
              <>
                <input
                  type="text"
                  value={editDepartmentName}
                  onChange={(e) => setEditDepartmentName(e.target.value)} // Обработчик изменения названия
                />
                <button className="save" onClick={handleUpdateDepartment}>
                  Сохранить
                </button>
                <button className="cancel" onClick={() => setEditDepartmentId(null)}>
                  Отмена
                </button>
              </>
            ) : (
              // Отображение департамента
              <>
                {department.name}
                {canEditDepartment && (
                  <button
                    className="edit"
                    onClick={() => {
                      setEditDepartmentId(department.id); // Устанавливаем ID редактируемого департамента
                      setEditDepartmentName(department.name); // Устанавливаем название для редактирования
                    }}
                  >
                    Редактировать
                  </button>
                )}
                {canDeleteDepartment && (
                  <button
                    className="delete"
                    onClick={() => handleDeleteDepartment(department.id)} // Удаление департамента
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

export default Departments; // Экспортируем компонент