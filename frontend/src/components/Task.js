// Этот файл содержит React-компонент Task, который отображает задачу и предоставляет функциональность для:
// - Перемещения задачи вперед или назад между колонками.
// - Удаления задачи.
// - Отображения информации о задаче (название, департамент, связанное событие).

import React from 'react'; // Импортируем React
import PropTypes from 'prop-types'; // Импортируем PropTypes для проверки типов пропсов
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Импортируем компонент для иконок
import {
  faArrowRightLong,
  faArrowLeftLong,
  faArrowDownLong,
  faArrowUpLong,
} from '@fortawesome/free-solid-svg-icons'; // Импортируем иконки
import '../css/task.css'; // Импортируем стили

function Task(props) {
  const task = props.item; // Получаем данные задачи из пропсов
  const { name, id_col, department_id, id_event, department, event } = task; // Деструктурируем данные задачи
  const { moveTask, moveBackTask, removeTask } = props; // Получаем функции для управления задачей

  // Проверяем, что id_col является допустимым числом
  const isValidColumnId = typeof id_col === 'number' && !isNaN(id_col);

  return (
    <div className="task">
      {/* Кнопка для удаления задачи */}
      <button onClick={() => removeTask(task)} className="task__delete">
        X
      </button>

      {/* Название задачи */}
      <h3>{name}</h3>

      {/* Информация о департаменте */}
      <p>Department: {department?.name || 'Unknown'}</p>

      {/* Информация о событии (если есть) */}
      {id_event && <p>Event: {event?.title || 'Unknown'}</p>}

      {/* Кнопки для перемещения задачи (десктопная версия) */}
      {isValidColumnId && id_col !== 1 && (
        <button
          onClick={() => moveBackTask(task)}
          className="button__left btn_desktop button"
        >
          <FontAwesomeIcon icon={faArrowLeftLong} /> {/* Иконка стрелки влево */}
        </button>
      )}
      {isValidColumnId && id_col !== 4 && (
        <button
          onClick={() => moveTask(task)}
          className="button__right btn_desktop button"
        >
          <FontAwesomeIcon icon={faArrowRightLong} /> {/* Иконка стрелки вправо */}
        </button>
      )}

      {/* Кнопки для перемещения задачи (мобильная версия) */}
      {isValidColumnId && id_col !== 1 && (
        <button
          onClick={() => moveBackTask(task)}
          className="button__left btn_mobile button"
        >
          <FontAwesomeIcon icon={faArrowUpLong} /> {/* Иконка стрелки вверх */}
        </button>
      )}
      {isValidColumnId && id_col !== 4 && (
        <button
          onClick={() => moveTask(task)}
          className="button__right btn_mobile button"
        >
          <FontAwesomeIcon icon={faArrowDownLong} /> {/* Иконка стрелки вниз */}
        </button>
      )}
    </div>
  );
}

// Проверка типов пропсов
Task.propTypes = {
  item: PropTypes.object.isRequired, // Данные задачи (объект, обязательный)
  moveTask: PropTypes.func.isRequired, // Функция для перемещения задачи вперед (функция, обязательная)
  moveBackTask: PropTypes.func.isRequired, // Функция для перемещения задачи назад (функция, обязательная)
  removeTask: PropTypes.func.isRequired, // Функция для удаления задачи (функция, обязательная)
};

export default Task; // Экспортируем компонент