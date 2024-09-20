import React from 'react';
import {format} from 'date-fns';
import tableStyles from '../../styles/table.module.scss';
import {useTranslation} from 'react-i18next';

export default function AppointmentHeaderTable({startDates}) {
  const {t} = useTranslation('global');
  return (
    <table className={`${tableStyles.calendar} ${tableStyles.tableHeader}`}>
      <thead>
        <tr>
          {startDates.map((startDate, dateIndex) => (
            <th key={dateIndex} className={`${tableStyles.columns} ${tableStyles.sticky}`}>
              <div className={tableStyles.cell__header}>
                {t(`daysOfWeek.${format(startDate, 'EEEE').slice(0, 3).toLowerCase()}`)}
              </div>
            </th>
          ))}
        </tr>
      </thead>
    </table>
  );
}
