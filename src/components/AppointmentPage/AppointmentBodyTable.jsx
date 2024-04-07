import React from 'react';
import { format, addMinutes } from 'date-fns';
import { error } from '@pnotify/core';
import { useDispatch, useSelector } from 'react-redux';

import styles from '../../styles/teacher.module.scss';
import tableStyles from '../../styles/table.module.scss';

export default function AppointmentBodyTable({
 selectedClassType,
 selectedSlotsAmount,
 slotsData,
 setSelectedSlotsAmount,
 setTeachersIds,
}) {
 const dispatch = useDispatch();
 const selectedSlots = useSelector((state) => state.selectedSlots);
 const startingHour = 9;
 const handleCellClick = async (weekDay, timeStr) => {
  const numSlotsToCheck = selectedClassType === 0 ? 3 : 2;

  let teachersIdsNew = [];
  for (let slotIndex = 0; slotIndex < numSlotsToCheck; slotIndex++) {
   // validating slots
   const currentTime = addMinutes(new Date(`1970 ${timeStr}`), slotIndex * 30);
   const isAlreadySelected = selectedSlots.selectedSlots[weekDay]?.find(
    (el) => el?.time === format(currentTime, 'HH:mm')
   );
   if (isAlreadySelected) {
    return error({ delay: 1000, text: 'Slot already selected' });
   }
   const slots = slotsData[weekDay]?.[format(currentTime, 'HH:mm')];
   if (!slots || !slots.length) return error({ delay: 1000, text: 'Not enough slots' });
   teachersIdsNew.push(slots.map((el) => el.userId));
  }

  teachersIdsNew = teachersIdsNew[0].filter((id) => {
   return teachersIdsNew.every((currentArray) => currentArray.includes(id));
  }); // filtering for teachers that matches all slots

  if (!teachersIdsNew || !teachersIdsNew.length) {
   // validating  that there is at least one teacher in the array
   error({
    text: 'Cant find avaible teacher, Slots occupied by different teachers',
    delay: 1000,
   });
   return;
  }

  for (let slotIndex = 0; slotIndex < numSlotsToCheck; slotIndex++) {
   const currentTime = addMinutes(new Date(`1970 ${timeStr}`), slotIndex * 30);
   dispatch({
    type: 'ADD_SELECTED_SLOTS',
    payload: {
     weekDay,
     slot: {
      time: format(currentTime, 'HH:mm'),
      rowSpan: slotIndex === 0 ? numSlotsToCheck : 0,
     },
    },
   });
   console.log(selectedSlots);
  }
  setSelectedSlotsAmount(selectedSlotsAmount + 1);
  setTeachersIds(teachersIdsNew);
 };
 return (
  <table className={tableStyles.tableBody}>
   <tbody>
    {Array.from({ length: 24 }, (_, timeIndex) => {
     const currentTime = addMinutes(new Date(`1970 9:00`), timeIndex * 30);
     if (currentTime.getHours() >= startingHour)
      return (
       <tr key={timeIndex}>
        {Array.from({ length: 7 }, (_, dateIndex) => {
         const weekDay = dateIndex;
         const timeStr = format(currentTime, 'HH:mm');

         const numPeople = slotsData[weekDay]?.[timeStr]?.length || 0;
         const element = selectedSlots.selectedSlots[weekDay]?.find((el) => el.time === timeStr);
         if (element) {
          if (element.rowSpan <= 0) {
           return <></>;
          }
         }
         return (
          <td key={dateIndex} rowSpan={element ? element?.rowSpan : 1}>
           <button
            style={
             element
              ? {
                 height: `${58 * element.rowSpan}px`,
                }
              : {}
            }
            className={`${element ? styles.selectedCell : ''} 
			${tableStyles.cell} ${tableStyles.black_borders} ${
             timeIndex === 0 || timeIndex === 23 || dateIndex === 0 || dateIndex === 6
              ? tableStyles.cell__outer
              : tableStyles.cell__inner
            }`}
            disabled={!(numPeople > 0)}
            onClick={() => handleCellClick(weekDay, timeStr)}
           >
            <span>
             {element ? (
              <>
               {timeStr}
               <br />-<br />
               {format(addMinutes(currentTime, 30 * element.rowSpan), 'HH:mm')} ({numPeople})
              </>
             ) : (
              `${timeStr} (${numPeople})`
             )}
            </span>
           </button>
          </td>
         );
        })}
       </tr>
      );
    })}
   </tbody>
  </table>
 );
}
