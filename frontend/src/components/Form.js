// Этот файл содержит React-компонент Form, который предоставляет форму для создания новой задачи.
// Компонент позволяет:
// - Вводить название задачи.
// - Выбирать связанное событие (если есть).
// - Отправлять данные на сервер для создания задачи.
// - Обновлять состояние родительского компонента с новой задачей.

import React, { useReducer } from 'react'; // Импортируем React и хук useReducer
import PropTypes from 'prop-types'; // Импортируем PropTypes для проверки типов пропсов
import { createTask } from '../api'; // Импортируем функцию для создания задачи

// Компонент Form
function Form({ selectedDepartment, columns, events, getNewTask }) {
  const init = { name: '', id_event: '' }; // Начальное состояние формы

  // Редуктор для управления состоянием формы
  const reducer = (state, action) => {
    switch (action.type) {
      case 'reset': // Сброс формы
        return init;
      case 'change': // Изменение значения поля
        const { name, value } = action.element;
        return { ...state, [name]: value };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, init); // Используем useReducer для управления состоянием
  const { name, id_event } = state; // Деструктурируем состояние

  // Валидация формы
  const formValidation = (errors) => {
    if (name.length < 2) errors.push('Task name is required'); // Проверка на длину названия задачи
  };

  // Обработчик добавления задачи
  const addTask = async (e) => {
    e.preventDefault();

    const errors = [];
    formValidation(errors); // Проверяем форму на ошибки

    if (errors.length === 0) {
      // Находим колонку "To do"
      const toDoColumn = columns.find((col) => col.title === 'To do');
      if (!toDoColumn) {
        alert('To do column not found'); // Если колонка не найдена, выводим ошибку
        return;
      }

      // Создаем объект новой задачи
      const newTask = {
        name,
        id_event: id_event || null, // Если событие не выбрано, устанавливаем null
        id_col: toDoColumn.id, // ID колонки "To do"
        department_id: selectedDepartment, // ID выбранного департамента
      };

      try {
        const response = await createTask(newTask); // Отправляем запрос на создание задачи
        console.log('Task created:', response.data);
        getNewTask(response.data); // Передаем новую задачу в родительский компонент
        dispatch({ type: 'reset' }); // Сбрасываем форму
      } catch (error) {
        console.error('Error creating task:', error);
        alert('Failed to create task'); // Обработка ошибки
      }
    } else {
      alert(errors.join(',\n ')); // Выводим ошибки, если они есть
    }
  };

  return (
    <form className="form" onSubmit={addTask}>
      <div className="form__container">
        {/* Поле для ввода названия задачи */}
        <label>
          <input
            name="name"
            value={name}
            type="text"
            onChange={(e) => dispatch({ type: 'change', element: e.target })} // Обработчик изменения названия
            placeholder="Task title..."
            required
          />
        </label>

        {/* Выпадающий список для выбора события */}
        <select
          name="id_event"
          value={id_event || ''}
          onChange={(e) => dispatch({ type: 'change', element: e.target })} // Обработчик изменения события
        >
          <option value="">Select Event</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>

        {/* Кнопка для добавления задачи */}
        <input type="submit" value="Add Task" className="form__submit" />
      </div>
    </form>
  );
}

// Проверка типов пропсов
Form.propTypes = {
  selectedDepartment: PropTypes.number.isRequired, // ID выбранного департамента (число, обязательный)
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired, // ID колонки (число, обязательный)
      title: PropTypes.string.isRequired, // Название колонки (строка, обязательный)
      ogr: PropTypes.number.isRequired, // Ограничение по количеству задач (число, обязательный)
      className: PropTypes.string.isRequired, // Класс для стилизации (строка, обязательный)
    })
  ).isRequired, // Список колонок (массив, обязательный)
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired, // ID события (число, обязательный)
      title: PropTypes.string.isRequired, // Название события (строка, обязательный)
    })
  ).isRequired, // Список событий (массив, обязательный)
  getNewTask: PropTypes.func.isRequired, // Функция для передачи новой задачи в родительский компонент (функция, обязательная)
};

export default Form; // Экспортируем компонент