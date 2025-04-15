// Этот файл содержит React-компонент Calendar, который предоставляет функциональность для управления событиями (Event).
// Компонент позволяет:
// - Просматривать список событий с пагинацией.
// - Создавать, редактировать и удалять события (доступно для ролей Manager и Admin).
// - Проверять пересечение событий и корректность введенных данных.
// - Отображать модальные окна для ошибок и уведомлений.

import React, { useState, useEffect } from 'react';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getAreas,
} from '../api';

// Стили для компонента
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  form: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  select: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  checkbox: {
    marginLeft: '10px',
  },
  eventList: {
    listStyle: 'none',
    padding: '0',
  },
  eventItem: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '10px',
  },
  eventActions: {
    marginTop: '10px',
  },
  actionButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
  },
  paginationButton: {
    margin: '0 10px',
  },
  paginationText: {
    margin: '0 10px',
    fontWeight: 'bold',
  },
};

// Компонент модального окна
const Modal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <p>{message}</p>
        <button style={styles.modalButton} onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
};

const Calendar = () => {
  const [events, setEvents] = useState([]); // Состояние для хранения списка событий
  const [areas, setAreas] = useState([]); // Состояние для хранения списка областей
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    start: '',
    end: '',
    allDay: false,
    areaId: '',
    capacity: 0,
  }); // Состояние для данных формы
  const [isFormVisible, setIsFormVisible] = useState(false); // Видимость формы
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Состояние ошибки
  const [isModalOpen, setIsModalOpen] = useState(false); // Видимость модального окна
  const [modalMessage, setModalMessage] = useState(''); // Сообщение в модальном окне
  const [userRole, setUserRole] = useState(''); // Роль пользователя

  // Состояние для пагинации
  const [currentPage, setCurrentPage] = useState(1); // Текущая страница
  const [itemsPerPage] = useState(5); // Количество событий на странице

  // Получаем роль пользователя из localStorage
  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  // Загрузка событий и областей
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsResponse = await getEvents();
        const areasResponse = await getAreas();
        setEvents(eventsResponse.data || []);
        setAreas(areasResponse.data || []);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        setError('Ошибка при загрузке данных');
        setModalMessage('Ошибка при загрузке данных');
        setIsModalOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Функция для проверки пересечения событий
  const isEventOverlapping = (newEvent, existingEvents, excludeEventId = null) => {
    const newStart = new Date(newEvent.start);
    const newEnd = new Date(newEvent.end || newEvent.start);

    return existingEvents.some((event) => {
      if (excludeEventId && event.id === excludeEventId) return false;

      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end || event.start);

      return (
        newEvent.areaId === event.areaId &&
        ((newStart >= eventStart && newStart < eventEnd) ||
          (newEnd > eventStart && newEnd <= eventEnd) ||
          (newStart <= eventStart && newEnd >= eventEnd))
      );
    });
  };

  // Функция для проверки, что начало раньше окончания
  const isStartBeforeEnd = (start, end) => {
    if (!start || !end) return true;
    return new Date(start) < new Date(end);
  };

  // Обработчик отправки формы
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedArea = areas.find((area) => area.id === parseInt(formData.areaId, 10));

      // Проверка на превышение максимальной вместимости
      if (selectedArea && formData.capacity > selectedArea.capacity) {
        setModalMessage(`Вместимость не может превышать ${selectedArea.capacity}`);
        setIsModalOpen(true);
        return;
      }

      // Проверка, что начало раньше окончания
      if (!isStartBeforeEnd(formData.start, formData.end)) {
        setModalMessage('Начало события должно быть раньше окончания.');
        setIsModalOpen(true);
        return;
      }

      // Проверка на пересечение событий
      const isOverlapping = isEventOverlapping(formData, events, formData.id);
      if (isOverlapping) {
        setModalMessage('В выбранный промежуток времени уже есть мероприятие в этой площадке.');
        setIsModalOpen(true);
        return;
      }

      if (formData.id) {
        // Редактирование события
        const response = await updateEvent(formData.id, formData);
        setEvents(events.map((event) => (event.id === formData.id ? response.data : event)));
      } else {
        // Создание события
        const response = await createEvent(formData);
        setEvents([...events, response.data]);
      }
      setIsFormVisible(false);
      setFormData({ id: null, title: '', start: '', end: '', allDay: false, areaId: '', capacity: 0 });
      setError(null);
    } catch (error) {
      setModalMessage(error.response?.data?.error || 'Ошибка при сохранении события');
      setIsModalOpen(true);
    }
  };

  // Обработчик удаления события
  const handleDeleteEvent = async (id) => {
    try {
      await deleteEvent(id);
      setEvents(events.filter((event) => event.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении события:', error);
      setError('Ошибка при удаления события');
      setModalMessage('Ошибка при удалении события');
      setIsModalOpen(true);
    }
  };

  // Обработчик редактирования события
  const handleEditEvent = (event) => {
    setFormData({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      areaId: event.areaId,
      capacity: event.capacity,
    });
    setIsFormVisible(true);
  };

  // Логика для пагинации
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = events.slice(indexOfFirstItem, indexOfLastItem);

  // Переход на следующую страницу
  const nextPage = () => {
    if (currentPage < Math.ceil(events.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Переход на предыдущую страницу
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Проверка разрешений
  const canCreateEvent = userRole === 'Manager' || userRole === 'Admin';
  const canEditEvent = userRole === 'Manager' || userRole === 'Admin';
  const canDeleteEvent = userRole === 'Manager' || userRole === 'Admin';

  // Если данные загружаются
  if (loading) {
    return <div style={styles.container}>Загрузка...</div>;
  }

  // Если произошла ошибка
  if (error) {
    return <div style={styles.container}>Ошибка: {error}</div>;
  }

  // Форматирование даты для input[type="datetime-local"]
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const pad = (num) => (num < 10 ? `0${num}` : num);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Календарь</h1>

      {/* Кнопка для добавления нового события */}
      {canCreateEvent && (
        <button style={styles.button} onClick={() => setIsFormVisible(true)}>
          Добавить событие
        </button>
      )}

      {/* Форма для создания/редактирования события */}
      {isFormVisible && (
        <form style={styles.form} onSubmit={handleFormSubmit}>
          <h2>{formData.id ? 'Редактирование события' : 'Создание события'}</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Название:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Начало:</label>
            <input
              type="datetime-local"
              name="start"
              value={formatDateForInput(formData.start)}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Окончание:</label>
            <input
              type="datetime-local"
              name="end"
              value={formatDateForInput(formData.end)}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Весь день:
              <input
                type="checkbox"
                name="allDay"
                checked={formData.allDay}
                onChange={handleInputChange}
                style={styles.checkbox}
              />
            </label>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Область:</label>
            <select
              name="areaId"
              value={formData.areaId}
              onChange={handleInputChange}
              required
              style={styles.select}
            >
              <option value="">Выберите область</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name} (Макс. вместимость: {area.capacity})
                </option>
              ))}
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Вместимость:</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              required
              min="1"
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Сохранить
          </button>
          <button
            type="button"
            style={{ ...styles.button, backgroundColor: '#6c757d' }}
            onClick={() => setIsFormVisible(false)}
          >
            Отмена
          </button>
        </form>
      )}

      {/* Модальное окно для ошибок */}
      <Modal
        isOpen={isModalOpen}
        message={modalMessage}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Список событий */}
      <h2>Список событий</h2>
      {events.length === 0 ? (
        <p>Событий пока нет.</p>
      ) : (
        <>
          <ul style={styles.eventList}>
            {currentEvents.map((event) => {
              const area = areas.find((area) => area.id === event.areaId);
              return (
                <li key={event.id} style={styles.eventItem}>
                  <strong>{event.title}</strong> (Область: {area ? area.name : 'Не указана'})
                  <br />
                  Вместимость: {event.capacity}
                  <br />
                  Начало: {new Date(event.start).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}
                  <br />
                  Окончание: {event.end ? new Date(event.end).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }) : 'Не указано'}
                  <br />
                  <div style={styles.eventActions}>
                    {canEditEvent && (
                      <button
                        style={styles.actionButton}
                        onClick={() => handleEditEvent(event)}
                      >
                        Редактировать
                      </button>
                    )}
                    {canDeleteEvent && (
                      <button
                        style={{ ...styles.actionButton, ...styles.deleteButton }}
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Пагинация */}
          <div style={styles.pagination}>
            <button
              style={styles.paginationButton}
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Назад
            </button>
            <span style={styles.paginationText}>Страница {currentPage}</span>
            <button
              style={styles.paginationButton}
              onClick={nextPage}
              disabled={currentPage === Math.ceil(events.length / itemsPerPage)}
            >
              Вперед
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Calendar;