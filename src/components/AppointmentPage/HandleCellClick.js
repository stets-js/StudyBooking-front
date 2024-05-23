import {addMinutes, format} from 'date-fns';
import {error} from '@pnotify/core';

export const HandleCellClick = async ({
  weekDay,
  timeStr,
  numSlotsToCheck,
  slotsData,
  setSelectedSlotsAmount,
  selectedSlotsAmount,
  setTeachersIds,
  selectedSlots,
  dispatch,
  setLessonAmount,
  startDate,
  endDate,
  lesson = false
}) => {
  console.log('hello?');
  let teachersIdsNew = [];
  console.log('hello1');
  for (let slotIndex = 0; slotIndex < numSlotsToCheck; slotIndex++) {
    // validating slots
    const currentTime = addMinutes(new Date(`1970 ${timeStr}`), slotIndex * 30);
    const isAlreadySelected = selectedSlots.selectedSlots[weekDay]?.find(
      el => el?.time === format(currentTime, 'HH:mm')
    );
    if (isAlreadySelected) {
      return lesson ? 1 : error({delay: 1000, text: 'Slot already selected'});
    }
    const slots = slotsData[weekDay]?.[format(currentTime, 'HH:mm')];
    if (!slots || !slots.length) return error({delay: 1000, text: 'Not enough slots'});
    teachersIdsNew.push(slots.map(el => el.userId));
  }
  console.log(teachersIdsNew);
  teachersIdsNew = teachersIdsNew[0].filter(id => {
    return teachersIdsNew.every(currentArray => currentArray.includes(id));
  }); // filtering for teachers that matches all slots

  if (!teachersIdsNew || !teachersIdsNew.length) {
    // validating  that there is at least one teacher in the array
    error({
      text: 'Cant find avaible teacher, Slots occupied by different teachers',
      delay: 1000
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
          rowSpan: slotIndex === 0 ? numSlotsToCheck : 0
        }
      }
    });
  }

  setSelectedSlotsAmount(selectedSlotsAmount + 1);
  setTeachersIds(teachersIdsNew);
  const start = new Date(startDate);
  const end = new Date(endDate);
  // console.log(end, start);
  let count = 0;
  let currentDate = start;

  while (currentDate <= end) {
    if ((currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1) === weekDay) {
      count++;
      currentDate.setDate(currentDate.getDate() + 7);
    } else currentDate.setDate(currentDate.getDate() + 1); // Переходим к следующей дате
  }
  setLessonAmount(prev => prev + count);
  return <></>;
};
