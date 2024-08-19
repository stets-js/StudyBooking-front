import {addMinutes, format} from 'date-fns';

export const filterAndUpdateSlots = (slots, lessons, slotsMaxAmount) => {
  // This function itterate through all slots and filter them to exact weekDay
  // + add rowSpan for first slot of Each 'slot group' so it can be rendered as one
  // big slot not three small slots

  // slotsMaxAmount - is number for length of callendar, if 48 -> full 0-24,else 9-22
  const updatedWeekSchedule = Array.from({length: 7}, () => []);

  lessons.forEach(lesson => {
    const schedule = lesson.LessonSchedule;
    // console.log(schedule);
    const [hours, minutes] = schedule.startTime.split(':');
    const [endHours, endMinutes] = schedule.endTime.split(':');
    const appointmentType =
      lesson.appointmentTypeId === 7 || lesson.appointmentTypeId === 9 ? 3 : 2;
    let rowSpanForNewDay = 0;
    let rowSpanForCuttedDay = 0; // variable for cutting slot time that outrun slotsMaxAmount
    if (hours === '21' && minutes === '30' && slotsMaxAmount < 48) {
      const hourDiff = Number(endHours) - Number(hours);
      const minutesDiff = (Number(endMinutes) - Number(minutes)) / 30;
      rowSpanForCuttedDay += hourDiff + (minutesDiff < 0 ? 0 : minutesDiff);
      // find how much diff between lesson.LessonSchedule.startTime and endTime
    }

    if (hours === '23' && (endHours === '00' || endHours === '01')) {
      rowSpanForNewDay += 1;
      if (endHours === '01') {
        rowSpanForNewDay += 1;
      }
    }
    const slots = [
      {
        ...lesson,
        rowSpan: appointmentType - rowSpanForNewDay - rowSpanForCuttedDay,
        time: schedule.startTime
      }
    ];
    for (let i = 1; i < appointmentType - rowSpanForNewDay; i++) {
      slots.push({
        time: format(addMinutes(new Date(1970, 0, 1, hours, minutes), 30 * i), 'HH:mm'),
        rowSpan: 0
      });
    }
    if (rowSpanForNewDay !== 0)
      for (let i = 0; i <= appointmentType - rowSpanForNewDay; i++) {
        updatedWeekSchedule[(schedule.weekDay + 1) % 7].push({
          ...lesson,
          rowSpan: i === 0 ? rowSpanForNewDay : 0,
          time: format(addMinutes(new Date(1970, 0, 1, hours, minutes), 30 * (1 + i)), 'HH:mm')
        });
      }
    updatedWeekSchedule[schedule.weekDay].push(...slots);
  });
  // console.log(updatedWeekSchedule);
  const appointedSubgroupsIds = [];
  const appointedReplacementsIds = [];
  //have to separete this lists cause ids can collapse

  slots.data.forEach(slot => {
    if (
      (slot.subgroupId &&
        !appointedSubgroupsIds.some(
          el => el.id === slot.subgroupId && el.weekDay === slot.weekDay
        )) || // if subgroup event
      (slot.ReplacementId &&
        !appointedReplacementsIds.some(
          el => el.id === slot.ReplacementId && el.weekDay === slot.weekDay
        )) // if replacement event
    ) {
      slot.rowSpan = !slot.AppointmentType.name.includes('group')
        ? 2
        : slot.AppointmentType.name.includes('junior')
        ? 2
        : 3; // if group -> 3 slots, else 2 slots
      const group = {
        weekDay: slot.weekDay,
        start: slot.time,
        leftSlotsForOneBlock: slot.rowSpan - 1
      };
      slot.subgroupId
        ? appointedSubgroupsIds.push({id: slot.subgroupId, ...group})
        : appointedReplacementsIds.push({id: slot.ReplacementId, ...group});
    } else if (slot.subgroupId || slot.ReplacementId) {
      const arr = slot.subgroupId ? appointedSubgroupsIds : appointedReplacementsIds;
      const indexOfId = arr.findIndex(
        el =>
          el.id === (slot.subgroupId ? slot.subgroupId : slot.ReplacementId) &&
          el.weekDay === slot.weekDay
      );
      arr[indexOfId].leftSlotsForOneBlock -= 1;
      if (arr[indexOfId].leftSlotsForOneBlock <= 0) {
        arr.splice(indexOfId, 1);
      }
    }
    updatedWeekSchedule[slot.weekDay].push(slot);
  });
  return updatedWeekSchedule;
};
