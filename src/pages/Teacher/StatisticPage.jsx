import React, {useEffect, useState} from 'react';
// import {error, success} from '@pnotify/core';
import {format} from 'date-fns';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import styles from '../../styles/teacher.module.scss';
import {getLessonsForUser} from '../../helpers/lessons/lesson';
import AmountTable from '../../components/StatisticsPage/AmountTable';
import LessonsTable from '../../components/StatisticsPage/LessonsTable';

const getFirstAndLastDateOfMonth = () => {
  const now = new Date();
  const firstDay = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
  const lastDay = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0));

  return {start: format(firstDay, 'yyyy-MM-dd'), end: format(lastDay, 'yyyy-MM-dd')};
};

export default function StatisticPage() {
  const {teacherId} = useParams() || null;
  let userId = useSelector(state => state.auth.user.id);
  if (teacherId) userId = teacherId; //case when admin is logged in and wants to see another teachers schedule

  const [dates, setDates] = useState(getFirstAndLastDateOfMonth());
  let [lessonsByDay] = useState({});
  let [typeAmounts, setTypeAmounts] = useState({
    // for content of constants look at typeTranslater
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    Total: 0
  });
  const fetchData = async () => {
    const data = await getLessonsForUser({
      mentorId: userId,
      startDateLesson: dates.start,
      endDateLesson: dates.end
    });
    setTypeAmounts(prev => {
      return {...prev, Total: data.results};
    });
    data.data.forEach(lesson => {
      setTypeAmounts(prev => {
        return {...prev, [lesson.appointmentTypeId]: prev[lesson.appointmentTypeId] + 1};
      });

      if (lessonsByDay[lesson.date]) {
        lessonsByDay[lesson.date] = [...lessonsByDay[lesson.date], lesson];
      } else {
        lessonsByDay[lesson.date] = [lesson];
      }
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <AmountTable typeAmounts={typeAmounts}></AmountTable>
      <LessonsTable lessonsByDay={lessonsByDay}></LessonsTable>
    </>
  );
}
