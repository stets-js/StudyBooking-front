import React, {useState} from 'react';
import {format, addDays, startOfWeek, addMinutes} from 'date-fns';
import styles from '../../styles/teacher.module.scss';
import classNames from 'classnames';

export default function TeacherPage() {
  const initialStartDate = startOfWeek(new Date(), {weekStartsOn: 1});
  const startingHour = 8;
  initialStartDate.setHours(startingHour, 0, 0, 0);

  const [selectedGroup, setSelectedGroup] = useState('Група');
  const [startDates, setStartDates] = useState(
    Array.from({length: 7}, (_, i) => addDays(initialStartDate, i))
  );
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleCellClick = (date, timeSlot) => {
    console.log(`Ви вибрали ${timeSlot}`);
    console.log(`Дата: ${format(date, 'dd.MM.yyyy')}`);
    console.log(`День тижня: ${format(date, 'EEEE')}`);
    console.log(`Вибрана група: ${selectedGroup}`);
    setSelectedSlot(timeSlot);
  };

  const handleGroupChange = group => {
    setSelectedGroup(group);
    setSelectedSlot(null); // Сбросить выбранный слот при смене группы
  };

  const handlePrevWeek = () => {
    setStartDates(startDates.map(startDate => addDays(startDate, -7)));
    setSelectedSlot(null); // Сбросить выбранный слот при смене недели
  };

  const handleNextWeek = () => {
    setStartDates(startDates.map(startDate => addDays(startDate, 7)));
    setSelectedSlot(null); // Сбросить выбранный слот при смене недели
  };

  return (
    <div>
      <div>
        <button onClick={handlePrevWeek} className={styles.type_selector}>
          Попередній тиждень
        </button>
        <button onClick={handleNextWeek} className={styles.type_selector}>
          Наступний тиждень
        </button>
      </div>

      <div>
        <button
          onClick={() => handleGroupChange('Група')}
          className={`${styles.type_selector} ${styles.type_selector__group}`}>
          Група
        </button>
        <button
          onClick={() => handleGroupChange('Індивідуальна')}
          className={`${styles.type_selector} ${styles.type_selector__indiv}`}>
          Індивідуальна
        </button>
        <button
          onClick={() => handleGroupChange('Вільна')}
          className={`${styles.type_selector} ${styles.type_selector__free}`}>
          Вільна
        </button>
        <button
          onClick={() => handleGroupChange('Заміна')}
          className={`${styles.type_selector} ${styles.type_selector__zamina}`}>
          Заміна
        </button>
      </div>

      <table className={styles.calendar}>
        <thead>
          <tr>
            {startDates.map((startDate, dateIndex) => (
              <th key={dateIndex}>
                <div>
                  <div>{format(startDate, 'dd.MM')}</div>
                  <div>{format(startDate, 'EEEE')}</div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({length: 29}, (_, timeIndex) => (
            <tr key={timeIndex} className={styles.calendar__column}>
              {startDates.map((date, dateIndex) => (
                <td key={dateIndex}>
                  {!(
                    addMinutes(date, timeIndex * 30).getHours() === 22 &&
                    addMinutes(date, timeIndex * 30).getMinutes() === 30
                  ) && (
                    <button
                      className={classNames(styles.slotButton, {
                        [styles.selectedSlot]:
                          selectedSlot &&
                          selectedSlot.getTime() === addMinutes(date, timeIndex * 30).getTime(),
                        [styles.validSlot]:
                          addMinutes(date, timeIndex * 30).getHours() >= startingHour
                      })}
                      onClick={() => handleCellClick(date, addMinutes(date, timeIndex * 30))}>
                      {addMinutes(date, timeIndex * 30).getHours() >= startingHour &&
                        addMinutes(date, timeIndex * 30).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                    </button>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
