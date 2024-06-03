import React, {useEffect, useState} from 'react';
// import {error, success} from '@pnotify/core';
import {format} from 'date-fns';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {error} from '@pnotify/core';

import styles from '../../styles/teacher.module.scss';
import {getLessonsForUser} from '../../helpers/lessons/lesson';
import AmountTable from '../../components/StatisticsPage/AmountTable';
import LessonsTable from '../../components/StatisticsPage/LessonsTable';
import DateChooser from '../../components/StatisticsPage/DateChooser';

const getFirstAndLastDateOfMonth = () => {
  const now = new Date();
  const firstDay = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
  const lastDay = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0));

  return {start: format(firstDay, 'yyyy-MM-dd'), end: format(lastDay, 'yyyy-MM-dd')};
};

const clearDict = dict => {
  for (const [key, value] of Object.entries(dict)) {
    dict[key] = 0;
  }
};

export default function StatisticPage() {
  const {teacherId} = useParams() || null;
  let userId = useSelector(state => state.auth.user.id);
  if (teacherId) userId = teacherId; //case when admin is logged in and wants to see another teachers schedule

  const [dates, setDates] = useState(getFirstAndLastDateOfMonth());
  const [lessonsByDay, setLessonsByDay] = useState({});
  const [typeAmounts, setTypeAmounts] = useState({
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
    // get lessons
    const data = await getLessonsForUser({
      mentorId: userId,
      startDateLesson: dates.start,
      endDateLesson: dates.end
    });
    clearDict(typeAmounts);
    setLessonsByDay({});
    data.data.forEach(lesson => {
      // counting lesson types
      setTypeAmounts(prev => {
        return {
          ...prev,
          Total: prev['Total'] + 1,
          [lesson.appointmentTypeId]: prev[lesson.appointmentTypeId] + 1
        };
      });
      // formating lessons by date
      setLessonsByDay(prev => {
        // Проверяем, существует ли дата в предыдущем состоянии
        if (prev[lesson.date]) {
          return {
            ...prev,
            [lesson.date]: [...prev[lesson.date], lesson]
          };
        } else {
          return {
            ...prev,
            [lesson.date]: [lesson]
          };
        }
      });
    });
  };
  useEffect(() => {
    if (new Date(dates.start).getTime() <= new Date(dates.end).getTime()) {
      fetchData();
    } else {
      error({text: 'End date can`t be less, than start', delay: 1000});
    }
  }, [dates]);

  return (
    <>
      <DateChooser dates={dates} setDates={setDates}></DateChooser>
      <AmountTable typeAmounts={typeAmounts}></AmountTable>
      <LessonsTable lessonsByDay={lessonsByDay}></LessonsTable>
    </>
  );
}
