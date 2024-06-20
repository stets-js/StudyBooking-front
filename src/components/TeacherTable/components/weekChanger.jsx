import React from 'react';
import {format, addDays} from 'date-fns';

import styles from '../../../styles/teacher.module.scss';

export default function WeekChanger({startDates, setStartDates, userName}) {
  const handlePrevWeek = () => {
    setStartDates(startDates.map(startDate => addDays(startDate, -7)));
  };

  const handleNextWeek = () => {
    setStartDates(startDates.map(startDate => addDays(startDate, 7)));
  };

  return (
    <div>
      <div className={`${styles.dates_wrapper} ${styles.date_selector}`}>
        <div className={styles.flex}>
          <button onClick={handlePrevWeek} className={styles.week_selector}>
            {`<`}
          </button>
          <div className={styles.week_selector__date}>
            {format(startDates[0], 'dd.MM')} - {format(startDates[6], 'dd.MM')}
          </div>
          <button onClick={handleNextWeek} className={styles.week_selector}>
            {`>`}
          </button>
        </div>

        <div className={styles.mentor_name}>Mentor: {userName}</div>
      </div>
    </div>
  );
}
