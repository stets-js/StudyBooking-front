import {addMinutes, format} from 'date-fns';

export const filterAndUpdateSlots = (slots, lessons) => {
  // This function itterate through all slots and filter them to exact weekDay
  // + add rowSpan for first slot of Each 'slot group' so it can be rendered as one
  // big slot not three small slots

  const updatedWeekSchedule = Array.from({length: 7}, () => []);

  lessons.forEach(lesson => {
    const schedule = lesson.LessonSchedule;
    const [hours, minutes] = schedule.startTime.split(':');
    const appointmentType =
      lesson.appointmentTypeId === 7 || lesson.appointmentTypeId === 9 ? 3 : 2;
    const slots = [
      {
        ...lesson,
        rowSpan: appointmentType,
        time: schedule.startTime
      }
    ];
    for (let i = 1; i < appointmentType; i++) {
      slots.push({
        time: format(addMinutes(new Date(1970, 0, 1, hours, minutes), 30 * i), 'HH:mm'),
        rowSpan: 0
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
