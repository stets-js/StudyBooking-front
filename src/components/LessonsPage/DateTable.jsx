import React, {useState} from 'react';
import {format, addMinutes} from 'date-fns';
import Switch from 'react-switch';
import tableStyles from '../../styles/table.module.scss';
import styles from './statistic.module.scss';
import classNames from 'classnames';

export default function DateTable({lessons, onClick, selectedTime, slotsData}) {
  return (
    <>
      <div
        className={classNames(tableStyles.calendar, tableStyles.scroller, styles.table__wrapper)}>
        <table className={classNames(tableStyles.tableBody, tableStyles.teacher_calendar)}>
          <tbody>
            {Array.from({length: slotsData.amount}, (_, timeIndex) => {
              // 24 - for making 20:30 last cell
              // 26 - for making 21:30
              const currentTime = addMinutes(
                new Date(1970, 0, 1, slotsData.startingTime, 0),
                timeIndex * 30
              );
              const formattedTime = format(currentTime, 'HH:mm');
              return (
                <tr key={Math.random() * 100 - 1}>
                  <td
                    className={classNames(
                      styles.table__cell,
                      selectedTime === formattedTime && styles.table__cell__selected
                    )}
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
    </>
  );
}
