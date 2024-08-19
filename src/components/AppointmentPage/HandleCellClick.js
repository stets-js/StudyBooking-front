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
  excludeId,
  dispatch,
  setLessonAmount,
  startDate,
  endDate,
  lesson = false
}) => {
  let teachersIdsNew = [];
  const [hours, minutes] = timeStr.split(':');
  const oneDaySlot = hours === '00';
  // oneDaySlot is bool for case when placing lesson on first hour of the day
  for (let slotIndex = 0; slotIndex < numSlotsToCheck; slotIndex++) {
    // validating slots
    const currentTime = addMinutes(new Date(1970, 0, 1, hours, minutes), slotIndex * 30);
    const formattedCurrTime = format(currentTime, 'HH:mm');
    const isAlreadySelected = selectedSlots.selectedSlots[weekDay]?.find(
      el => el?.time === formattedCurrTime
    );
    if (isAlreadySelected) {
      return lesson ? 1 : null;
    }
    let weekIndex = weekDay;
    if (formattedCurrTime.split(':')[0] === '00' && !oneDaySlot) weekIndex += 1 % 7;
    const slots = slotsData[weekIndex]?.[formattedCurrTime];
    if (!slots || !slots.length) return error({delay: 1000, text: 'Not enough slots'});
    teachersIdsNew.push(slots.map(el => el.userId));
  }
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
  let weekDayCopy = weekDay;
  const newSlots = [];
  for (let slotIndex = 0; slotIndex < numSlotsToCheck; slotIndex++) {
    const [hours, minutes] = timeStr.split(':');
    let currentTime = addMinutes(new Date(1970, 0, 1, hours, minutes), slotIndex * 30);
    currentTime = format(currentTime, 'HH:mm');

    let [newHours, newMinutes] = currentTime.split(':');
    console.log(newSlots);
    console.log(newHours, newMinutes, 'New new new!!');
    if (newHours === '00' && !oneDaySlot) {
      newHours = Number(newHours) % 24;
      if (newSlots[slotIndex - 1]) {
        newSlots[slotIndex - 1].payload.slot.rowSpan = slotIndex;
        if (weekDay === weekDayCopy) weekDayCopy = (weekDayCopy + 1) % 7;
      }
    }
    newSlots.push({
      type: 'ADD_SELECTED_SLOTS',
      payload: {
        weekDay: weekDayCopy,
        slot: {
          time: `${typeof newHours === typeof 1 ? `0${newHours}` : newHours}:${newMinutes}`,
          rowSpan: slotIndex === 0 || (newHours === 0 && newMinutes === '00') ? numSlotsToCheck : 0
        }
      }
    });
  }
  newSlots[0].payload.slot.schedule = {
    weekDayOrigin: weekDay,
    weekDayEnd: weekDayCopy,
    start: timeStr,
    end: newSlots[newSlots.length - 1].payload.slot.time
  };
  newSlots.map(slot => dispatch(slot));

  setSelectedSlotsAmount(selectedSlotsAmount + 1);
  setTeachersIds(excludeId(teachersIdsNew));
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
