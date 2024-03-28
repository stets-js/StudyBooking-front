import React from 'react';
import {format, addMinutes} from 'date-fns';

import tableStyles from '../../../styles/table.module.scss';
import {HandleCellClick} from '../scripts/handleCellClick';

export default function ScheduleCell({
  userId,
  slot,
  currentTime,
  date,
  dateIndex,
  startDates,
  setOpenSlotDetails,
  selectedAppointment,
  setSelectedSlotDetails,
  dispatch
}) {
  if ((slot?.SubGroupId || slot?.ReplacementId) && !slot.rowSpan) {
    return <></>;
  }
  return (
    <td key={slot?.weekDay} rowSpan={slot?.rowSpan || 1}>
      {
        <input
          type="button"
          style={
            slot?.rowSpan
              ? {
                  height: `${35 * slot?.rowSpan + (slot?.rowSpan === 3 ? 3 : 2) * slot?.rowSpan}px`
                }
              : {}
          }
          className={`${tableStyles.cell} ${
            // key can be generated only for appointed
            !slot?.rowSpan ? tableStyles[`hover__${selectedAppointment.name}`] : ''
          }  ${
            slot && slot.AppointmentType
              ? tableStyles[`type_selector__${slot.AppointmentType.name}`]
              : ''
          } `}
          onClick={() => {
            HandleCellClick({
              slot,
              selectedAppointment,
              date,
              currentTime,
              dateIndex,
              setOpenSlotDetails,
              setSelectedSlotDetails,
              startDates,
              userId,
              dispatch
            });
          }}
          value={
            slot?.rowSpan
              ? `${format(currentTime, 'HH:mm')} - ${format(
                  addMinutes(currentTime, 30 * slot?.rowSpan),
                  'HH:mm'
                )} `
              : format(currentTime, 'HH:mm')
          }
        />
      }
    </td>
  );
}
