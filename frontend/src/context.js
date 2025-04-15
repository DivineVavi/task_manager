// Этот файл создает и экспортирует контексты для задач (TaskContext) и колонок (ColumnContext).
// Контексты используются для передачи данных и функций между компонентами без необходимости явной передачи пропсов.

import React from 'react'; // Импортируем React

// Создаем контекст для задач
const TaskContext = React.createContext();

// Создаем контекст для колонок
const ColumnContext = React.createContext();

// Экспортируем контексты
export { TaskContext, ColumnContext };