// Этот файл содержит React-компонент Calendar, который отображает события в виде календаря.
// Компонент использует библиотеку FullCalendar для отображения событий в различных видах (месяц, неделя, день).
// События загружаются с сервера и отображаются с цветовой индикацией в зависимости от области (areaId).

import React, { useState, useEffect } from 'react'; // Импортируем React и хуки
import FullCalendar from '@fullcalendar/react'; // Импортируем основной компонент FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid'; // Плагин для отображения календаря по дням и месяцам
import timeGridPlugin from '@fullcalendar/timegrid'; // Плагин для отображения календаря по времени
import interactionPlugin from '@fullcalendar/interaction'; // Плагин для взаимодействия с календарем
import { getEvents } from '../api'; // Импортируем функцию для получения событий с сервера
import '../css/calendar.css'; // Импортируем файл стилей

const Calendar = () => {
  const [events, setEvents] = useState([]); // Состояние для хранения списка событий

  // Загрузка событий при монтировании компонента
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents(); // Получаем события с сервера
        const formattedEvents = response.data.map((event) => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          allDay: event.allDay,
          color: getColorForArea(event.areaId), // Добавляем цвет в зависимости от области
        }));
        setEvents(formattedEvents); // Обновляем состояние событий
      } catch (error) {
        console.error('Ошибка при загрузке событий:', error);
      }
    };

    fetchEvents();
  }, []);

  // Функция для получения цвета в зависимости от areaId
  const getColorForArea = (areaId) => {
    const colors = {
      1: '#FF5733', // Красный
      2: '#33FF57', // Зеленый
      3: '#3357FF', // Синий
      4: '#dc3545', // Темно-красный
      5: '#ccc', // Серый
    };
    return colors[areaId] || '#CCCCCC'; // Возвращаем цвет по умолчанию, если areaId не найден
  };

  return (
    <div className="calendar-container">
      <h1>Календарь событий</h1> {/* Заголовок календаря */}
      <div className="calendar-wrapper">
        {/* Компонент FullCalendar */}
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // Подключаем плагины
          initialView="dayGridMonth" // Начальный вид календаря (месяц)
          headerToolbar={{
            left: 'prev,next today', // Кнопки навигации
            center: 'title', // Заголовок текущего периода
            right: 'dayGridMonth,timeGridWeek,timeGridDay', // Переключение между видами
          }}
          events={events} // Передаем события для отображения
          timeZone="Europe/Moscow" // Устанавливаем временную зону
          locale="ru" // Устанавливаем язык (русский)
          editable={false} // Запрещаем редактирование событий
          selectable={false} // Запрещаем выделение дат
          eventClick={(info) => {
            // Обработчик клика по событию
            alert(
              `Событие: ${info.event.title}\nНачало: ${info.event.start}\nОкончание: ${info.event.end}`
            );
          }}
        />
      </div>
    </div>
  );
};

export default Calendar; // Экспортируем компонент