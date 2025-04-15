// Этот файл содержит React-компонент для управления областями (Area).
// Компонент предоставляет функциональность для:
// - Отображения списка областей.
// - Создания новых областей (доступно для ролей Manager и Admin).
// - Редактирования существующих областей (доступно для ролей Manager и Admin).
// - Удаления областей (доступно для ролей Manager и Admin).
// Компонент использует хуки useState и useEffect для управления состоянием и выполнения побочных эффектов,
// а также взаимодействует с API для выполнения CRUD-операций.

import React, { useState, useEffect } from 'react';
import { getAreas, createArea, updateArea, deleteArea } from '../api';
import '../css/style.css'; // Импорт стилей

const Areas = () => {
  const [areas, setAreas] = useState([]); // Состояние для хранения списка областей
  const [newAreaName, setNewAreaName] = useState(''); // Состояние для названия новой области
  const [newAreaCapacity, setNewAreaCapacity] = useState(''); // Состояние для вместимости новой области
  const [editAreaId, setEditAreaId] = useState(null); // Состояние для ID редактируемой области
  const [editAreaName, setEditAreaName] = useState(''); // Состояние для названия редактируемой области
  const [editAreaCapacity, setEditAreaCapacity] = useState(''); // Состояние для вместимости редактируемой области
  const [userRole, setUserRole] = useState(''); // Состояние для роли пользователя

  // Получаем роль пользователя из localStorage
  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  // Загружаем области при монтировании компонента
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await getAreas();
        setAreas(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке областей:', error);
      }
    };
    fetchAreas();
  }, []);

  // Создание новой области
  const handleCreateArea = async () => {
    if (!newAreaName.trim() || !newAreaCapacity) {
      alert('Название и вместимость обязательны');
      return;
    }

    try {
      const response = await createArea({
        name: newAreaName,
        capacity: parseInt(newAreaCapacity, 10),
      });
      setAreas([...areas, response.data]); // Добавляем новую область в список
      setNewAreaName(''); // Очищаем поле названия
      setNewAreaCapacity(''); // Очищаем поле вместимости
    } catch (error) {
      console.error('Ошибка при создании области:', error);
    }
  };

  // Обновление области
  const handleUpdateArea = async () => {
    if (!editAreaName.trim() || !editAreaCapacity) {
      alert('Название и вместимость обязательны');
      return;
    }

    try {
      const response = await updateArea(editAreaId, {
        name: editAreaName,
        capacity: parseInt(editAreaCapacity, 10),
      });
      setAreas(
        areas.map((area) =>
          area.id === editAreaId ? response.data : area // Обновляем область в списке
        )
      );
      setEditAreaId(null); // Сбрасываем ID редактируемой области
      setEditAreaName(''); // Очищаем поле названия
      setEditAreaCapacity(''); // Очищаем поле вместимости
    } catch (error) {
      console.error('Ошибка при обновлении области:', error);
    }
  };

  // Удаление области
  const handleDeleteArea = async (id) => {
    try {
      await deleteArea(id);
      setAreas(areas.filter((area) => area.id !== id)); // Удаляем область из списка
    } catch (error) {
      console.error('Ошибка при удалении области:', error);
    }
  };

  // Проверка разрешений
  const canCreateArea = userRole === 'Manager' || userRole === 'Admin'; // Может ли пользователь создавать области
  const canEditArea = userRole === 'Manager' || userRole === 'Admin'; // Может ли пользователь редактировать области
  const canDeleteArea = userRole === 'Manager' || userRole === 'Admin'; // Может ли пользователь удалять области

  return (
    <div className="container">
      <h1>Управление областями</h1>

      {/* Форма для создания области */}
      {canCreateArea && (
        <div className="create-area">
          <input
            type="text"
            placeholder="Название области"
            value={newAreaName}
            onChange={(e) => setNewAreaName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Вместимость"
            value={newAreaCapacity}
            onChange={(e) => setNewAreaCapacity(e.target.value)}
            min="1"
          />
          <button onClick={handleCreateArea}>Создать</button>
        </div>
      )}

      {/* Список областей */}
      <ul className="area-list">
        {areas.map((area) => (
          <li key={area.id}>
            {area.id === editAreaId ? (
              // Форма редактирования области
              <>
                <input
                  type="text"
                  value={editAreaName}
                  onChange={(e) => setEditAreaName(e.target.value)}
                />
                <input
                  type="number"
                  value={editAreaCapacity}
                  onChange={(e) => setEditAreaCapacity(e.target.value)}
                  min="1"
                />
                <button className="save" onClick={handleUpdateArea}>
                  Сохранить
                </button>
                <button className="cancel" onClick={() => setEditAreaId(null)}>
                  Отмена
                </button>
              </>
            ) : (
              // Отображение области
              <>
                {area.name} (Вместимость: {area.capacity})
                {canEditArea && (
                  <button
                    className="edit"
                    onClick={() => {
                      setEditAreaId(area.id);
                      setEditAreaName(area.name);
                      setEditAreaCapacity(area.capacity);
                    }}
                  >
                    Редактировать
                  </button>
                )}
                {canDeleteArea && (
                  <button
                    className="delete"
                    onClick={() => handleDeleteArea(area.id)}
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

export default Areas;