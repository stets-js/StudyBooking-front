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
  console.log(MIC_flag);
  const userId = user.id;
  if (!user.isPrevSubgroupPlaced) {
    error({text: 'First set up all your subgoups', delay: 1000});
    return <></>;
  }
  // case for opening  the details of a occupied cell
  if (slot && (slot.subgroupId || slot.ReplacementId)) {
    setSelectedSlotDetails(slot);
    setOpenSlotDetails(true);
    return;
  } else if (MIC_flag) return; // MIC only can look details but not interact with slots
  else if (slot && selectedAppointment.name === 'free') {
    // type free - delete slot
    const weekStart = format(startDates[0], 'yyyy-MM-dd');
    const weekEnd = format(startDates[6], 'yyyy-MM-dd');
    if (slot.startDate >= weekStart && slot.startDate <= weekEnd) {
      await deleteSlotForUser(userId, slot.id);
      dispatch(DeleteSlotFromWeek(slot.id));
    } else {
      // set slot endDate to date -7 days
      const res = await updateSlot(userId, slot.id, {endDate: addDays(date, -7)});
      if (res.data) dispatch(DeleteSlotFromWeek(slot.id));
    }
  } else if (
    slot &&
    selectedAppointment.name !== 'free' &&
    slot.appointmentTypeId !== selectedAppointment.id
  ) {
    const res = await updateSlot(userId, slot.id, {
      appointmentTypeId: selectedAppointment.id
    });
    if (res.data) dispatch(updateSlotForWeek(res.data));
  } else if (!slot && selectedAppointment.id !== 3) {
    // Free slots cant be placed
    const prevWeekStart = format(addDays(date, -dateIndex - 7), 'yyyy-MM-dd');
    const prevWeekEnd = format(addDays(date, -dateIndex - 1), 'yyyy-MM-dd');
    console.log(selectedAppointment);
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
