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

export default function UsersPage({MIC_flag = false}) {
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

  const [excludeTeacherId, setExcludeTeacherId] = useState(null); // for case of replacing through lesson page
  const [subGroup, setSubGroup] = useState({label: null, value: null});
  const excludeId = arr => {
    if (excludeTeacherId)
      return arr.filter(el => {
        return el !== excludeTeacherId;
      });
    else return arr;
  };
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
        setTeachersIds(excludeId(usersIds));
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
      const slotsResponse = await getSlotsForUsers({
        userIds: teachersIds,
        startDate,
        endDate,
        appointmentTypeId: selectedClassType === 11 ? 1 : selectedClassType
        // 11 is junior group, basicly it need same slots as group(id 1)
      });
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
    if (selectedCourse && teachersIds && startDate && endDate && selectedClassType) {
      fetchData();
    }
  }, [selectedCourse, teachersIds, startDate, endDate, selectedClassType]);
  const handleClose = () => {
    setIsOpen(!isOpen);
  };
  const [lessonId, setLessonId] = useState(null);
  const clearTable = () => {
    if (selectedSlotsAmount !== 0 || lesson) {
      dispatch({type: 'CLEAN_SELECTED_SLOTS'});
      setRenderTeachers(true);
      setSelectedSlotsAmount(0);
      setLessonAmount(0);
    }
  };

  useEffect(() => {
    const setAllData = async () => {
      if (lesson) {
        console.log(lesson);
        setLessonId(lesson.id);
        setStartDate(lesson.date);
        setEndDate(lesson.date);
        setSelectedCourse(lesson.courseId);
        setSelectedClassType(lesson.appointmentId);
        setSubGroup({value: lesson.subgroupId});
        setExcludeTeacherId(lesson.userId);
        setIsReplacement(true);
      }
    };
    setAllData();
  }, []);
  return (
    <div>
      <h3>Lesson amount: {lessonAmount}</h3>
      <AppointmentButtons
        selectedCourse={selectedCourse}
        MIC_flag={MIC_flag}
        startDate={startDate}
        isReplacement={isReplacement}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        courses={courses}
        setTeachersIds={setTeachersIds}
        setSelectedCourse={setSelectedCourse}
        selectedClassType={selectedClassType}
        handleClose={handleClose}
        selectedSlotsAmount={selectedSlotsAmount}
        setSelectedClassType={setSelectedClassType}
        setTeacherType={setTeacherType}
        teacherType={teacherType}
        clearTable={clearTable}></AppointmentButtons>
      <AppointmentHeaderTable startDates={startDates}></AppointmentHeaderTable>

      <AppointmentBodyTable
        setLessonAmount={setLessonAmount}
        selectedClassType={selectedClassType}
        selectedSlotsAmount={selectedSlotsAmount}
        slotsData={slotsData}
        setSelectedSlotsAmount={setSelectedSlotsAmount}
        setTeachersIds={setTeachersIds}
        excludeId={excludeId}
        startDate={startDate}
        endDate={endDate}></AppointmentBodyTable>

      <SetAppointment
        lessonId={lessonId}
        setSubGroup={setSubGroup}
        subGroup={subGroup}
        MIC_flag={MIC_flag}
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
