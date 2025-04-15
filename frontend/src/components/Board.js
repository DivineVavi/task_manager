// Этот файл содержит React-компонент Board, который представляет собой основную структуру канбан-доски.
// Компонент отображает заголовок и контейнер для колонок (ColumnContainer).

import React from 'react'; // Импортируем React
import ColumnContainer from './ColumnContainer'; // Импортируем компонент ColumnContainer

// Классовый компонент Board
export default class Board extends React.Component {
  render() {
    return (
      <section className="kanban">
        <h1>Kanban Board</h1> {/* Заголовок канбан-доски */}
        <ColumnContainer /> {/* Контейнер для колонок */}
      </section>
    );
  }
}