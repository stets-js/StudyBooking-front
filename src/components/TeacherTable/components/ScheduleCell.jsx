import React from 'react';
import {format, addMinutes} from 'date-fns';

import tableStyles from '../../../styles/table.module.scss';
import appointmentStyles from '../../../styles/appointment.module.scss';
import {HandleCellClick} from '../scripts/handleCellClick';

export default function ScheduleCell({
  user,
  slot,
  currentTime,
  date,
  dateIndex,
  timeIndex,
  startDates,
  setOpenSlotDetails,
  selectedAppointment,
  setSelectedSlotDetails,
  dispatch
}) {
  if (slot?.rowSpan === 0) return <></>;
  if ((slot?.subgroupId || slot?.ReplacementId) && !slot.rowSpan) {
    return <></>;
  }
  return (
    <td key={slot?.weekDay} rowSpan={slot?.rowSpan || 1}>
      {
        <button
          type="button"
          style={
            slot?.rowSpan
              ? {
                  height: `${58 * slot?.rowSpan}px`
                }
              : {}
          }
          className={`${tableStyles.cell} ${tableStyles.black_borders} ${
            timeIndex === 0 || timeIndex === 23 || dateIndex === 0 || dateIndex === 6
              ? tableStyles.cell__outer
              : tableStyles.cell__inner
          } ${
            !slot?.rowSpan && ![1, 2].includes(slot?.appointmentTypeId)
              ? appointmentStyles[`hover__${selectedAppointment?.name}`]
              : ''
          }  ${slot ? appointmentStyles[`type_selector__${slot?.AppointmentType?.name}`] : ''} `}
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
              user,
              dispatch
            });
          }}>
          <div className={tableStyles.cell__content__wrapper}>
            {slot?.rowSpan ? (
              <>
                <div>
                  {format(currentTime, 'HH:mm')}
                  <br />-<br />
                  {format(addMinutes(currentTime, 30 * slot?.rowSpan), 'HH:mm')}
                </div>
                <div className={tableStyles.tags__wrapper}>
                  <span className={tableStyles.tags__item}>
                    {!slot.ReplacementId
                      ? slot?.SubGroup?.Course?.shortening
                      : slot?.Replacement?.SubGroup?.Course?.shortening}
                  </span>
                  {!slot.Replacement && (
                    <span className={tableStyles.tags__item}>
                      {slot?.SubGroup?.SubgroupMentors &&
                      (slot?.SubGroup?.SubgroupMentors || [])[0]?.TeacherTypeId === 1
                        ? 'soft'
                        : 'tech'}
                    </span>
                  )}
                </div>
              </>
            ) : (
              format(currentTime, 'HH:mm')
            )}
          </div>
        </button>
      }
    </td>
  );
}
