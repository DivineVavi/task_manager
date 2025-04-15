// Этот файл является точкой входа для рендеринга React-приложения.
// Он создает корневой элемент и рендерит в него основной компонент App.

import React from 'react'; // Импортируем React
import ReactDOM from 'react-dom/client'; // Импортируем ReactDOM для рендеринга
import './index.css'; // Импортируем глобальные стили
import App from './App'; // Импортируем основной компонент App
import reportWebVitals from './reportWebVitals'; // Импортируем функцию для измерения производительности

// Создаем корневой элемент и рендерим в него приложение
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Обертываем App в StrictMode для выявления потенциальных проблем */}
    <App />
  </React.StrictMode>
);

// Измерение производительности (опционально)
// Передайте функцию для логирования результатов (например, reportWebVitals(console.log))
// или отправьте данные на аналитический сервер. Подробнее: https://bit.ly/CRA-vitals
reportWebVitals();