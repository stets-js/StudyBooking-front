import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { error } from '@pnotify/core';
import { useDispatch, useSelector } from 'react-redux';

import styles from '../../styles/teacher.module.scss';
import tableStyles from '../../styles/table.module.scss';
import { getCourses, getTeachersByCourse } from '../../helpers/course/course';
import { getSlotsForUsers } from '../../helpers/teacher/slots';
import SetAppointment from '../../components/modals/setAppointment/setAppointment';
import AppointmentButtons from '../../components/AppointmentPage/AppointmentButtons';
import AppointmentHeaderTable from '../../components/AppointmentPage/AppointmentHeaderTable';
import AppointmentBodyTable from '../../components/AppointmentPage/AppointmentBodyTable';

export default function UsersPage() {
 const dispatch = useDispatch();
 const [slotsData, setSlotsData] = useState([]);
 const [isOpen, setIsOpen] = useState(false);
 const [courses, setCourses] = useState([]);
 const [selectedCourse, setSelectedCourse] = useState();
 const [teachersIds, setTeachersIds] = useState([]);
 const initialStartDate = startOfWeek(new Date(), { weekStartsOn: 1 });
 const startingHour = 9;
 const [selectedClassType, setSelectedClassType] = useState(null);
 const selectedSlots = useSelector((state) => state.selectedSlots);
 const [selectedSlotsAmount, setSelectedSlotsAmount] = useState(0);
 initialStartDate.setHours(startingHour, 0, 0, 0);

 const [startDates, setStartDates] = useState(
  Array.from({ length: 7 }, (_, i) => addDays(initialStartDate, i))
 );
 const [startDate, setStartDate] = useState(format(startDates[0], 'yyyy-MM-dd'));
 const [endDate, setEndDate] = useState(null);

 const [renderTeachers, setRenderTeachers] = useState(false);
 dispatch({ type: 'SET_SELECTEDS_SLOTS' });
 useEffect(() => {
  getCourses().then((data) => {
   setCourses(
    data.data.map((el) => {
     return { label: el.name, value: el.id };
    })
   );
  });
 }, []);
 const [isReplacement, setIsReplacement] = useState(false);
 useEffect(() => {
  const fetchUsersIds = async () => {
   try {
    const usersIds = await getTeachersByCourse(selectedCourse);
    setTeachersIds(usersIds);
   } catch (error) {
    console.log(error);
   }
  };
  if (selectedCourse) {
   fetchUsersIds();
  }
  if (renderTeachers) setRenderTeachers(false);
 }, [selectedCourse, selectedClassType, renderTeachers]);
 useEffect(() => {
  const fetchData = async () => {
   const slotsResponse = await getSlotsForUsers({ userIds: teachersIds, startDate, endDate });
   const slots = slotsResponse.data;
   const organizedSlots = {};
   slots.forEach((slot) => {
    const weekDay = slot.weekDay;
    const time = slot.time;

    if (!organizedSlots[weekDay]) {
     organizedSlots[weekDay] = {};
    }

    if (!organizedSlots[weekDay][time]) {
     organizedSlots[weekDay][time] = [];
    }

    organizedSlots[weekDay][time].push(slot);
   });

   setSlotsData(organizedSlots);
  };
  if (endDate < startDate) {
   // add snackebar for alerting  user about wrong input
   // case when full data is setted, but its wrong formatted
   if (endDate && +endDate[0] !== 0)
    error({ text: 'End date can`t be less than start', delay: 1000 });
   return;
  }
  if (selectedCourse && teachersIds && startDate && endDate) {
   fetchData();
  }
 }, [selectedCourse, selectedClassType, teachersIds, startDate, endDate]);
 const handleClose = () => {
  setIsOpen(!isOpen);
 };

 const clearTable = () => {
  if (selectedSlotsAmount !== 0) {
   dispatch({ type: 'CLEAN_SELECTED_SLOTS' });
   setRenderTeachers(true);
   setSelectedSlotsAmount(0);
  }
 };

 return (
  <div>
   <AppointmentButtons
    startDate={startDate}
    isReplacement={isReplacement}
    setStartDate={setStartDate}
    endDate={endDate}
    setEndDate={setEndDate}
    courses={courses}
    setTeachersIds={setTeachersIds}
    setSelectedCourse={setSelectedCourse}
    selectedClassType={selectedClassType}
    setIsReplacement={setIsReplacement}
    handleClose={handleClose}
    selectedSlotsAmount={selectedSlotsAmount}
    setSelectedClassType={setSelectedClassType}
    clearTable={clearTable}
   ></AppointmentButtons>
   <AppointmentHeaderTable startDates={startDates}></AppointmentHeaderTable>

   <div className={styles.scroller}>
    <div className={`${tableStyles.calendar} ${tableStyles.scroller}`}>
     <AppointmentBodyTable
      selectedClassType={selectedClassType}
      selectedSlotsAmount={selectedSlotsAmount}
      slotsData={slotsData}
      setSelectedSlotsAmount={setSelectedSlotsAmount}
      setTeachersIds={setTeachersIds}
     ></AppointmentBodyTable>
    </div>
   </div>

   <SetAppointment
    setSelectedCourse={setSelectedCourse}
    startDate={startDate}
    endDate={endDate}
    isOpen={isOpen}
    handleClose={handleClose}
    selectedSlots={selectedSlots.selectedSlots}
    teachersIds={JSON.stringify(teachersIds)}
    appointmentType={selectedClassType}
    isReplacement={isReplacement}
    course={courses.filter((el) => el.value === selectedCourse)[0]}
    onSubmit={() => {
     clearTable();
    }}
   />
  </div>
 );
}
