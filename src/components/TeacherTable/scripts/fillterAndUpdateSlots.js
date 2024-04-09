export const filterAndUpdateSlots = slots => {
  // This function itterate through all slots and filter them to exact weekDay
  // + add rowSpan for first slot of Each 'slot group' so it can be rendered as one
  // big slot not three small slots

  const updatedWeekSchedule = Array.from({length: 7}, () => []);

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
      slot.rowSpan = slot.AppointmentType.name.includes('group') ? 3 : 2; // if group -> 3 slots, else 2 slots
      const group = {
        weekDay: slot.weekDay,
        start: slot.time,
        leftSlotsForOneBlock: slot.rowSpan - 1
      };
      console.log(group);
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
  console.log(updatedWeekSchedule);
  return updatedWeekSchedule;
};
