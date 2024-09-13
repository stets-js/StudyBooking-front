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
  const multiSlot =
    slots &&
    slots.length === 2 &&
    slots.every(slot => !slot.subgroupId) &&
    slots[0].appointmentTypeId !== slots[1].appointmentTypeId;
  if (multiSlot) {
    slots.sort((a, b) => a.appointmentTypeId - b.appointmentTypeId);
    console.log(slots);
  }
  return (
    <td key={`${slot?.weekDay} ${format(currentTime, 'HH:mm')}`} rowSpan={slot?.rowSpan || 1}>
      {!slot?.rowSpan && (
        <span
          className={tableStyles.cell__time}
          key={`${slot?.weekDay} ${format(currentTime, 'HH:mm')} span`}>
          {format(currentTime, 'HH:mm')}
        </span>
      )}
      <div
        className={
          multiSlot
            ? classNames(
                tableStyles.cell__split,
                tableStyles.black_borders,
                timeIndex === 0 || // case when multiSlot, creating half borders to whole div
                  timeIndex === slotsAmount - 1 ||
                  dateIndex === 0 ||
                  dateIndex === 6
                  ? tableStyles.cell__outer
                  : ''
              )
            : ''
        }>
        {slots.length > 0 ? (
          slots.map((slot, index) => {
            if (index && !multiSlot > 0) return <></>;
            return (
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
                  multiSlot // if not multiSlot, than create half borders else look up (div) for multiSlot case
                    ? tableStyles.cell__split__item
                    : timeIndex === 0 ||
                      timeIndex === slotsAmount - 1 ||
                      dateIndex === 0 ||
                      dateIndex === 6
                    ? tableStyles.cell__outer
                    : tableStyles.cell__inner,
                  slotsAmount === 48 ? tableStyles.cell__small : '',
                  tableStyles.black_borders,
                  !slot?.rowSpan &&
                    (!slot || (slot && selectedAppointment?.name === 'free')) &&
                    !MIC_flag
                    ? appointmentStyles[`hover__${selectedAppointment?.name}`]
                    : '',
                  slot ? appointmentStyles[`type_selector__${slot?.AppointmentType?.name}`] : '',
                  slot?.appointmentTypeId &&
                    slots.length > 0 &&
                    !multiSlot &&
                    !slot.subgroupId &&
                    slot.appointmentTypeId !== selectedAppointment.id
                    ? tableStyles[`cell__split__${selectedAppointment.name}`]
                    : ''
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
                {slot?.rowSpan && (
                  <div className={classNames(tableStyles.cell__content__wrapper)}>
                    <div>
                      {slot?.LessonSchedule
                        ? slot.LessonSchedule.startTime
                        : format(currentTime, 'HH:mm')}
                      <br /> - <br />
                      {format(
                        addMinutes(
                          currentTime,
                          30 *
                            ([1, 7, 9].includes(slot?.appointmentTypeId) // groups ids
                              ? 3
                              : 2) || slot?.rowSpan
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
                      {slot.rowSpan >= 2 && !slot.Replacement ? (
                        <span className={tableStyles.tags__item}>
                          {slot?.SubGroup?.SubgroupMentors &&
                          (slot?.SubGroup?.SubgroupMentors || []).find(
                            el => el.mentorId === user.id
                          )?.TeacherTypeId === 1
                            ? 'soft'
                            : 'tech'}
                        </span>
                      ) : (
                        <span className={tableStyles.tags__item}>Repl</span>
                      )}
                      {slots.length > 1 && (
                        <span className={tableStyles.tags__item}>x{slots.length}</span>
                      )}
                    </div>
                  </div>
                )}
              </button>
            );
          })
        ) : (
          <button
            type="button"
            className={classNames(
              tableStyles.cell,
              slotsAmount === 48 ? tableStyles.cell__small : '',
              tableStyles.black_borders,
              timeIndex === 0 || timeIndex === slotsAmount - 1 || dateIndex === 0 || dateIndex === 6
                ? tableStyles.cell__outer
                : tableStyles.cell__inner,
              !slot?.rowSpan && ![1, 2].includes(slot?.appointmentTypeId) && !MIC_flag
                ? appointmentStyles[`hover__${selectedAppointment?.name}`]
                : ''
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
            }}></button>
        )}
      </div>
    </td>
  );
}
