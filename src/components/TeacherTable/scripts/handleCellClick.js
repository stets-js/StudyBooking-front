import {addDays, format} from 'date-fns';
import {error} from '@pnotify/core';

import {createSlotForUser, deleteSlotForUser, updateSlot} from '../../../helpers/teacher/slots';
import {
  DeleteSlotFromWeek,
  addNewSlotToWeek,
  removeSlotFromWeekByTime,
  updateSlotForWeek,
  updateSlotForWeekByTime
} from '../../../redux/action/weekScheduler.action';

export const HandleCellClick = async ({
  slot,
  slots,
  selectedAppointment,
  date,
  currentTime,
  dateIndex,
  setOpenSlotDetails,
  setSelectedSlotDetails,
  startDates,
  user,
  dispatch,
  MIC_flag
}) => {
  const userId = user.id;
  if (!user.isPrevSubgroupPlaced) {
    error({text: 'First set up all your subgoups', delay: 1000});
    return <></>;
  }
  // case for opening  the details of a occupied cell
  let multiSlot =
    slots &&
    slots.length === 2 &&
    slots.every(slot => !slot.subgroupId) &&
    slots[0].appointmentTypeId !== slots[1].appointmentTypeId;
  // return;
  if (slot && (slot.subgroupId || slot.ReplacementId)) {
    setSelectedSlotDetails(slots.length > 1 ? slots : slot);
    setOpenSlotDetails(true);
    return;
  } else if (MIC_flag) return; // MIC only can look details but not interact with slots
  else if (slot && selectedAppointment.name === 'free') {
    // type free - delete slot
    const weekStart = format(startDates[0], 'yyyy-MM-dd');
    const weekEnd = format(startDates[6], 'yyyy-MM-dd');
    if (
      slot.startDate >= weekStart &&
      slot.startDate <= weekEnd &&
      slot.startDate === addDays(date, -7)
    ) {
      try {
        await deleteSlotForUser(userId, slot.id);
        dispatch(DeleteSlotFromWeek(slot.id));
      } catch (e) {
        console.log(e);
      }
    } else {
      // set slot endDate to date -7 days
      if (slot.id) {
        const res = await updateSlot(userId, slot.id, {endDate: addDays(date, -7)});
        if (res.data) dispatch(DeleteSlotFromWeek(slot.id));
      }
    }
  } else if (
    slot &&
    selectedAppointment.name !== 'free' &&
    slot.appointmentTypeId !== selectedAppointment.id &&
    multiSlot
  ) {
    return;
    // const res = await updateSlot(userId, slot.id, {
    //   appointmentTypeId: selectedAppointment.id
    // });
    // if (res.data) dispatch(updateSlotForWeek(res.data));
  } else if (
    (!slot && selectedAppointment.id !== 3) ||
    (slot &&
      selectedAppointment.name !== 'free' &&
      slot.appointmentTypeId !== selectedAppointment.id &&
      !multiSlot)
  ) {
    // Free slots cant be placed
    const prevWeekStart = format(addDays(date, -dateIndex - 7), 'yyyy-MM-dd');
    const prevWeekEnd = format(addDays(date, -dateIndex - 1), 'yyyy-MM-dd');
    await dispatch(
      addNewSlotToWeek({
        userId: +userId,
        appointmentTypeId: selectedAppointment.id,
        weekDay: dateIndex,
        startDate: format(date, 'yyyy-MM-dd'),
        time: format(currentTime, 'HH:mm'),
        AppointmentType: selectedAppointment
      })
    );
    try {
      const res = await createSlotForUser({
        userId,
        appointmentTypeId: selectedAppointment.id,
        weekDay: dateIndex,
        startDate: format(date, 'yyyy-MM-dd'),
        time: format(currentTime, 'HH:mm'),
        prevWeekStart,
        prevWeekEnd
      });
      if (res) dispatch(updateSlotForWeekByTime(res.data));
      // dispatch(addNewSlot(res.data));
    } catch (error) {
      dispatch(removeSlotFromWeekByTime({time: format(currentTime, 'HH:mm'), weekDay: dateIndex}));
      console.log(error);
    }
  }
};
