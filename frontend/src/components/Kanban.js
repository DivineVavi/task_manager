// Этот файл содержит React-компонент Kanban, который представляет собой канбан-доску.
// Компонент позволяет:
// - Управлять задачами (создание, перемещение, удаление).
// - Отображать задачи в колонках.
// - Выбирать департамент (для администраторов).
// - Интегрироваться с API для получения и обновления данных.

import React, { useState, useEffect } from 'react'; // Импортируем React и хуки
import '../App.css'; // Импортируем глобальные стили
import Board from './Board.js'; // Импортируем компонент Board
import Form from './Form.js'; // Импортируем компонент Form для создания задач
import { TaskContext, ColumnContext } from '../context.js'; // Импортируем контексты для задач и колонок
import {
  getDepartments,
  getKanbans,
  getTasks,
  getEvents,
  updateTask,
  deleteTask,
} from '../api.js'; // Импортируем функции для работы с API
import '../css/kanban.css'; // Импортируем стили для канбан-доски

function Kanban() {
  // Состояния для хранения данных
  const [departments, setDepartments] = useState([]); // Список департаментов
  const [selectedDepartment, setSelectedDepartment] = useState(null); // Выбранный департамент
  const [columns, setColumns] = useState([]); // Список колонок
  const [tasks, setTasks] = useState([]); // Список задач
  const [events, setEvents] = useState([]); // Список событий
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Состояние ошибки
  const [userRole, setUserRole] = useState(''); // Роль пользователя
  const [userDepartmentId, setUserDepartmentId] = useState(null); // ID департамента пользователя

  // Получаем роль пользователя и ID департамента из localStorage
  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserDepartmentId = localStorage.getItem('userDepartmentId');

    if (storedUserRole) {
      setUserRole(storedUserRole);
    } else {
      console.warn('User role not found in localStorage');
    }

    if (storedUserDepartmentId) {
      setUserDepartmentId(Number(storedUserDepartmentId));
    } else {
      console.warn('User department ID not found in localStorage');
    }
  }, []);

  // Получение данных о департаментах
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartments(); // Получаем список департаментов
        setDepartments(response.data);
        if (response.data.length > 0) {
          if (userRole === 'Admin') {
            setSelectedDepartment(response.data[0].id); // Устанавливаем первый департамент для администратора
          } else {
            setSelectedDepartment(userDepartmentId); // Устанавливаем департамент пользователя
          }
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [userRole, userDepartmentId]);

  // Получение данных о канбан-досках и задачах при изменении выбранного департамента
  useEffect(() => {
    const fetchKanbansAndTasks = async () => {
      if (selectedDepartment) {
        try {
          const kanbanResponse = await getKanbans(); // Получаем канбан-доски
          const taskResponse = await getTasks(); // Получаем задачи

          // Фильтруем колонки для выбранного департамента
          const filteredColumns = kanbanResponse.data.filter(
            (col) => col.department_id === selectedDepartment
          );
          // Назначаем классы для колонок на основе их id
          const columnsWithClasses = filteredColumns.map((col, index) => ({
            ...col,
            className: `column col_${index + 1}`,
          }));
          setColumns(columnsWithClasses);

          // Фильтруем задачи для выбранного департамента
          const filteredTasks = taskResponse.data.filter(
            (task) => task.department_id === selectedDepartment
          );
          setTasks(filteredTasks);
        } catch (error) {
          console.error('Error fetching kanbans or tasks:', error);
          setError(error.message);
        }
      }
    };

    fetchKanbansAndTasks();
  }, [selectedDepartment]);

  // Получение событий
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents(); // Получаем список событий
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(error.message);
      }
    };

    fetchEvents();
  }, []);

  // Создание новой задачи
  const getNewTask = (newTask) => {
    if (!canCreateTask) {
      alert('У вас нет прав на создание задач');
      return;
    }

    const toDoColumn = columns.find((col) => col.title === 'To do');
    if (!toDoColumn) {
      alert('To do column not found');
      return;
    }

    const toDoTasks = tasks.filter((task) => task.id_col === toDoColumn.id).length;

    // Проверяем лимит задач в колонке "To do"
    if (toDoTasks < toDoColumn.ogr) {
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
    } else {
      alert('Task limit (4) cannot be exceeded');
    }
  };

  // Перемещение задачи вперед
  const moveTask = (task) => {
    if (!canEditTask) {
      alert('У вас нет прав на перемещение задач');
      return;
    }

    if (typeof task.id_col !== 'number' || isNaN(task.id_col)) {
      console.error('Invalid columnId:', task.id_col);
      console.log('Task data:', task);
      return;
    }

    if (task.id_col === 4) return;

    const nextCol = task.id_col + 1;
    const nextColumn = columns.find((col) => col.id === nextCol);
    if (!nextColumn) {
      console.error('Column not found for id:', nextCol);
      console.log('Available columns:', columns);
      return;
    }

    const taskQty = tasks.filter((t) => t.id_col === nextCol).length;
    if (taskQty < nextColumn.ogr) {
      const updatedTasks = tasks.map((oldElement) => {
        if (oldElement.id === task.id) {
          return { ...oldElement, id_col: nextCol };
        }
        return oldElement;
      });
      setTasks(updatedTasks);
      // Обновляем задачу в базе данных
      updateTaskInDatabase(task.id, nextCol, task.name, task.department_id, task.id_event);
    } else {
      alert('The task limit in the column cannot be exceeded');
    }
  };

  // Перемещение задачи назад
  const moveBackTask = (task) => {
    if (!canEditTask) {
      alert('У вас нет прав на перемещение задач');
      return;
    }

    if (typeof task.id_col !== 'number' || isNaN(task.id_col)) {
      console.error('Invalid columnId:', task.id_col);
      console.log('Task data:', task);
      return;
    }

    if (task.id_col === 1) return;

    const prevCol = task.id_col - 1;
    const prevColumn = columns.find((col) => col.id === prevCol);
    if (!prevColumn) {
      console.error('Column not found for id:', prevCol);
      console.log('Available columns:', columns);
      return;
    }

    const taskQty = tasks.filter((t) => t.id_col === prevCol).length;
    if (taskQty < prevColumn.ogr) {
      const updatedTasks = tasks.map((oldElement) => {
        if (oldElement.id === task.id) {
          return { ...oldElement, id_col: prevCol };
        }
        return oldElement;
      });
      setTasks(updatedTasks);
      // Обновляем задачу в базе данных
      updateTaskInDatabase(task.id, prevCol, task.name, task.department_id, task.id_event);
    } else {
      alert('The task limit in the column cannot be exceeded');
    }
  };

  // Удаление задачи
  const removeTask = (task) => {
    if (!canDeleteTask) {
      alert('У вас нет прав на удаление задач');
      return;
    }

    if (window.confirm('Are you sure you want to delete the task?')) {
      const updatedTasks = tasks.filter((t) => t.id !== task.id);
      setTasks(updatedTasks);
      // Удаляем задачу из базы данных
      deleteTaskFromDatabase(task.id);
    } else {
      window.alert('Deletion has been cancelled');
    }
  };

  // Обновление задачи в базе данных
  const updateTaskInDatabase = async (taskId, newColumnId, name, department_id, id_event) => {
    try {
      const response = await updateTask(taskId, {
        id_col: newColumnId,
        name,
        department_id,
        id_event,
      });
      console.log('Task updated:', response.data);
    } catch (error) {
      console.error('Error updating task in database:', error);
      alert('Failed to update task');
    }
  };

  // Удаление задачи из базы данных
  const deleteTaskFromDatabase = async (taskId) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task from database:', error);
      alert('Failed to delete task');
    }
  };

  // Проверка разрешений
  const canCreateTask = userRole === 'Admin' || userRole === 'Manager';
  const canEditTask = userRole === 'Admin' || userRole === 'Manager' || userRole === 'Worker';
  const canDeleteTask = userRole === 'Admin' || userRole === 'Manager';

  // Получаем провайдеры контекста
  const { Provider: TaskProvider } = TaskContext;
  const { Provider: ColumnProvider } = ColumnContext;

  if (loading) {
    return <div>Loading...</div>;
  }

  

  if (error) {
    return <div>Error: {error}</div>;
  }

  

  return (
    <>
      {/* Форма для добавления новой задачи */}
      {canCreateTask && (
        <Form
          getNewTask={getNewTask}
          selectedDepartment={selectedDepartment}
          columns={columns}
          events={events}
        />
      )}

      {/* Выбор департамента только для администратора */}
      {userRole === 'Admin' && (
        <select
          value={selectedDepartment || ''}
          onChange={(e) => setSelectedDepartment(Number(e.target.value))}
        >
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      )}

      {/* Провайдеры контекста для колонок и задач */}
      <ColumnProvider value={{ columns }}>
        <TaskProvider value={{ tasks, moveTask, moveBackTask, removeTask }}>
          {/* Отображение доски */}
          <Board />
        </TaskProvider>
      </ColumnProvider>
    </>
  );
}

export default Kanban; // Экспортируем компонент