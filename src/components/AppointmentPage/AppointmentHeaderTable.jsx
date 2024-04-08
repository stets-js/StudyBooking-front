import React from 'react';
import { format } from 'date-fns';
import tableStyles from '../../styles/table.module.scss';

export default function AppointmentHeaderTable({ startDates }) {
 return (
  <table className={`${tableStyles.calendar} ${tableStyles.tableHeader}`}>
   <thead>
    <tr>
     {startDates.map((startDate, dateIndex) => (
      <th key={dateIndex} className={`${tableStyles.columns} ${tableStyles.sticky}`}>
       <div className={tableStyles.cell__header}>
        {format(startDate, 'EEEE').charAt(0).toUpperCase() + format(startDate, 'EEEE').slice(1, 3)}
       </div>
      </th>
     ))}
    </tr>
   </thead>
  </table>
 );
}
