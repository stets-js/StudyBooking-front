import React, {useState} from 'react';
import {format, addDays} from 'date-fns';
import classNames from 'classnames';

import Switch from 'react-switch';
import styles from '../../../styles/teacher.module.scss';

export default function WeekChanger({startDates, setStartDates, userName, handleCalendarChange}) {
  const handlePrevWeek = () => {
    setStartDates(startDates.map(startDate => addDays(startDate, -7)));
  };

  const handleNextWeek = () => {
    setStartDates(startDates.map(startDate => addDays(startDate, 7)));
  };
  const [calendarType, setCalendarType] = useState(false);
  return (
    <div>
      <div className={classNames(styles.dates_wrapper, styles.date_selector)}>
        <label>
          <span>9-22</span>
          <Switch
            uncheckedIcon={false}
            checkedIcon={false}
            onChange={() => {
              setCalendarType(!calendarType);
              handleCalendarChange(!calendarType);
            }}
            checked={calendarType}
          />
          <span>00-24</span>
        </label>

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
