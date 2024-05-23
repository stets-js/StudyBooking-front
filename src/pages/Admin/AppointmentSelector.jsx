import React, {useState, useEffect} from 'react';
import {format, addDays, startOfWeek} from 'date-fns';
import {error} from '@pnotify/core';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation} from 'react-router-dom';

import styles from '../../styles/teacher.module.scss';
import tableStyles from '../../styles/table.module.scss';
import {getCourses, getTeachersByCourse} from '../../helpers/course/course';
import {getSlotsForUsers} from '../../helpers/teacher/slots';
import SetAppointment from '../../components/modals/setAppointment/setAppointment';
import AppointmentButtons from '../../components/AppointmentPage/AppointmentButtons';
import AppointmentHeaderTable from '../../components/AppointmentPage/AppointmentHeaderTable';
import AppointmentBodyTable from '../../components/AppointmentPage/AppointmentBodyTable';
import {HandleCellClick} from '../../components/AppointmentPage/HandleCellClick';

export default function UsersPage({appointmentFlag = 'appointment'}) {
  const location = useLocation();

  const dispatch = useDispatch();
  const [slotsData, setSlotsData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState();
  const [teachersIds, setTeachersIds] = useState([]);
  const initialStartDate = startOfWeek(new Date(), {weekStartsOn: 1});
  const startingHour = 9;
  const [selectedClassType, setSelectedClassType] = useState(null);
  const selectedSlots = useSelector(state => state.selectedSlots);
  const [lessonAmount, setLessonAmount] = useState(0);

  const [selectedSlotsAmount, setSelectedSlotsAmount] = useState(0);
  const [teacherType, setTeacherType] = useState(1); // soft/tech
  initialStartDate.setHours(startingHour, 0, 0, 0);
  const [startDates] = useState(Array.from({length: 7}, (_, i) => addDays(initialStartDate, i)));
  const [startDate, setStartDate] = useState(format(startDates[0], 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(undefined);

  const [renderTeachers, setRenderTeachers] = useState(false);
  dispatch({type: 'SET_SELECTEDS_SLOTS'});
  useEffect(() => {
    const fetchCourses = async () => {
      const data = await getCourses();
      setCourses(
        data.data.map(el => {
          return {label: el.name, value: el.id};
        })
      );
    };
    fetchCourses();
  }, []);
  const [isReplacement, setIsReplacement] = useState(false);
  useEffect(() => {
    const fetchUsersIds = async () => {
      try {
        const usersIds = await getTeachersByCourse(selectedCourse, teacherType);
        setTeachersIds(usersIds);
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedCourse) {
      fetchUsersIds();
    }
    if (renderTeachers) setRenderTeachers(false);
  }, [selectedCourse, renderTeachers, teacherType]);

  const {lesson} = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      const slotsResponse = await getSlotsForUsers({userIds: teachersIds, startDate, endDate});
      const slots = slotsResponse.data;
      const organizedSlots = {};
      slots.forEach(slot => {
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
        error({text: 'End date can`t be less than start', delay: 1000});
      return;
    }
    if (selectedCourse && teachersIds && startDate && endDate) {
      fetchData();
    }
  }, [selectedCourse, teachersIds, startDate, endDate]);
  const handleClose = () => {
    setIsOpen(!isOpen);
  };

  const clearTable = () => {
    if (selectedSlotsAmount !== 0 || lesson) {
      dispatch({type: 'CLEAN_SELECTED_SLOTS'});
      setRenderTeachers(true);
      setSelectedSlotsAmount(0);
      setLessonAmount(0);
    }
  };

  const [tmpFlag, setTmpFlag] = useState(false);

  useEffect(() => {
    const setAllData = async () => {
      if (lesson) {
        setStartDate(lesson.date);
        setEndDate(lesson.date);
        setSelectedCourse(lesson.courseId);
        setSelectedClassType(lesson.appointmentId);
        setSelectedSlotsAmount(1);
        setTmpFlag(true);
      }
    };
    setAllData();
  }, [lesson, courses, teachersIds, slotsData]);
  console.log(teachersIds);

  useEffect(() => {
    const setAllData = async () => {
      if (lesson) {
        try {
          console.log('clicking211');
          if (startDate && endDate) {
            console.log('clicking1???');
            await HandleCellClick({
              weekDay: lesson.weekDay,
              timeStr: lesson.startTime,
              numSlotsToCheck: selectedClassType === 7 ? 3 : 2, // 0 - group, 1 and 2 is indiv + jun_group that is altho 2 slots
              setSelectedSlotsAmount,
              selectedSlotsAmount,
              setTeachersIds,
              selectedSlots,
              setLessonAmount,
              dispatch,
              slotsData,
              startDate,
              endDate,
              lesson
            });
          }
        } catch (err) {
          console.log('Sorry, can`t find slots!');
        }
      }
    };
    console.log(
      tmpFlag,
      teachersIds.length > 0,
      startDate,
      endDate,
      selectedCourse,
      selectedClassType
    );
    if (
      tmpFlag &&
      teachersIds.length > 0 &&
      startDate &&
      endDate &&
      selectedCourse &&
      selectedClassType
    ) {
      setAllData();
      console.log(4444);
      setTmpFlag(false);
    }
    console.log(333335);
  }, [
    tmpFlag,
    teachersIds,
    startDate,
    endDate,
    selectedCourse,
    selectedClassType,
    lesson,
    selectedSlotsAmount,
    selectedSlots,
    dispatch,
    slotsData
  ]);

  return (
    <div>
      <h3>Lesson amount: {lessonAmount}</h3>
      <AppointmentButtons
        selectedCourse={selectedCourse}
        appointmentFlag={appointmentFlag}
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
        setTeacherType={setTeacherType}
        teacherType={teacherType}
        clearTable={clearTable}></AppointmentButtons>
      <AppointmentHeaderTable startDates={startDates}></AppointmentHeaderTable>

      <div className={styles.scroller}>
        <div className={`${tableStyles.calendar} ${tableStyles.scroller}`}>
          <AppointmentBodyTable
            setLessonAmount={setLessonAmount}
            selectedClassType={selectedClassType}
            selectedSlotsAmount={selectedSlotsAmount}
            slotsData={slotsData}
            setSelectedSlotsAmount={setSelectedSlotsAmount}
            setTeachersIds={setTeachersIds}
            startDate={startDate}
            endDate={endDate}></AppointmentBodyTable>
        </div>
      </div>
      <SetAppointment
        appointmentFlag={appointmentFlag}
        setSelectedCourse={setSelectedCourse}
        startDate={startDate}
        endDate={endDate}
        isOpen={isOpen}
        handleClose={handleClose}
        selectedSlots={selectedSlots.selectedSlots}
        teachersIds={JSON.stringify(teachersIds)}
        appointmentType={selectedClassType}
        isReplacement={isReplacement}
        // course={courses.filter(el => el.value === selectedCourse)[0]}
        course={(courses || []).filter(el => el?.value === selectedCourse)[0]}
        onSubmit={() => {
          clearTable();
        }}
        teacherType={teacherType}
      />
    </div>
  );
}
