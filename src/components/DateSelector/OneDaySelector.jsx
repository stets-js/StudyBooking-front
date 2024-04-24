import React from 'react';
import {addDays, format} from 'date-fns';

import styles from '../../styles/teacher.module.scss';

export default function OneDaySelector({setCurrentDate, currentDate}) {
  const handleDateChange = daysToAdd => {
    const newDate = addDays(currentDate, daysToAdd);
    setCurrentDate(newDate);
  };
  const formatDate = date => {
    return format(date, 'iiii, dd.MM');
  };
  return (
    <div className={`${styles.date_selector}`}>
      <button onClick={() => handleDateChange(-1)} className={styles.week_selector}>
        {'<'}
      </button>
      <span>{formatDate(currentDate)}</span>
      <button onClick={() => handleDateChange(1)} className={styles.week_selector}>
        {'>'}
      </button>
    </div>
  );
}
