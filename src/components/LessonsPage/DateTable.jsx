import React, {useState, useEffect} from 'react';
import {format, addDays, startOfWeek, addMinutes} from 'date-fns';
import {useDispatch, useSelector} from 'react-redux';
import Switch from 'react-switch';

import tableStyles from '../../styles/table.module.scss';
import styles from './statistic.module.scss';
import classNames from 'classnames';

export default function DateTable({lessons, onClick}) {
  const [startingHour, setStartingHour] = useState(9);
  const [slotsAmount, setSlotsAmount] = useState(26);

  return (
    <div className={classNames(tableStyles.calendar, tableStyles.scroller, styles.table__wrapper)}>
      <table className={classNames(tableStyles.tableBody, tableStyles.teacher_calendar)}>
        <tbody>
          {Array.from({length: slotsAmount}, (_, timeIndex) => {
            // 24 - for making 20:30 last cell
            // 26 - for making 21:30
            const currentTime = addMinutes(new Date(1970, 0, 1, startingHour, 0), timeIndex * 30);
            const formattedTime = format(currentTime, 'HH:mm');
            return (
              <tr key={Math.random() * 100 - 1}>
                <td
                  className={styles.table__cell}
                  onClick={() => {
                    onClick(formattedTime);
                  }}>
                  {formattedTime} ({lessons ? lessons[formattedTime]?.length : 0})
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
