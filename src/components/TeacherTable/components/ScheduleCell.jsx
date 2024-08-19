import React, {useEffect, useState} from 'react';
import {format, addMinutes} from 'date-fns';

import tableStyles from '../../../styles/table.module.scss';
import appointmentStyles from '../../../styles/appointment.module.scss';
import {HandleCellClick} from '../scripts/handleCellClick';
import classNames from 'classnames';

export default function ScheduleCell({
  user,
  slotsAmount,
  slotHeight,
  MIC_flag,
  slots,
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
  const slot = slots[0];
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
                  height: `${slotHeight * slot?.rowSpan}px`
                }
              : {}
          }
          className={classNames(
            tableStyles.cell,
            slotsAmount === 48 ? tableStyles.cell__small : '',
            tableStyles.black_borders,
            timeIndex === 0 || timeIndex === slotsAmount - 1 || dateIndex === 0 || dateIndex === 6
              ? tableStyles.cell__outer
              : tableStyles.cell__inner,
            !slot?.rowSpan && ![1, 2].includes(slot?.appointmentTypeId) && !MIC_flag
              ? appointmentStyles[`hover__${selectedAppointment?.name}`]
              : '',
            slot ? appointmentStyles[`type_selector__${slot?.AppointmentType?.name}`] : ''
          )}
          onClick={() => {
            HandleCellClick({
              slot,
              slots,
              MIC_flag,
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
                  {slot?.LessonSchedule
                    ? slot.LessonSchedule.startTime
                    : format(currentTime, 'HH:mm')}
                  <br /> - <br />
                  {slot?.LessonSchedule
                    ? slot.LessonSchedule.endTime
                    : format(
                        addMinutes(
                          currentTime,
                          30 * (slot?.appointmentTypeId === 1 ? 3 : 2) || slot?.rowSpan
                        ),
                        'HH:mm'
                      )}
                </div>
                <div className={tableStyles.tags__wrapper}>
                  {slot.rowSpan >= 2 && (
                    <span className={tableStyles.tags__item}>
                      {!slot.ReplacementId
                        ? slot?.SubGroup?.Course?.shortening
                        : slot?.Replacement?.SubGroup?.Course?.shortening}
                    </span>
                  )}
                  {!slot.Replacement && slot.rowSpan >= 2 && (
                    <span className={tableStyles.tags__item}>
                      {slot?.SubGroup?.SubgroupMentors &&
                      (slot?.SubGroup?.SubgroupMentors || [])[0]?.TeacherTypeId === 1
                        ? 'soft'
                        : 'tech'}
                    </span>
                  )}
                  {slots.length > 1 && (
                    <span className={tableStyles.tags__item}>x{slots.length}</span>
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
