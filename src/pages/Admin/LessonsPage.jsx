import {format} from 'date-fns';
import React, {useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from '../../components/LessonsPage/statistic.module.scss';
import tableStyles from '../../styles/table.module.scss';

import {getLessons} from '../../helpers/lessons/lesson';
import LessonCard from '../../components/LessonsPage/LessonCard';
import FilteringBlock from '../../components/LessonsPage/FilteringBlock';
import DateTable from '../../components/LessonsPage/DateTable';
import classNames from 'classnames';

export default function LessonsPage() {
  const [lessons, setLessons] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currDate, setCurrDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  console.log(selectedTime);
  const generateEmptyStructure = () => {
    let schedule = {};

    let currentTime = new Date();
    currentTime.setHours(0, 0, 0, 0);

    for (let i = 0; i < 49; i++) {
      schedule[format(currentTime, 'HH:mm')] = [];
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
    setLessons(schedule);
  };
  useEffect(() => {
    generateEmptyStructure();
    fetchLessons();
  }, []);
  const fetchLessons = async () => {
    try {
      const {data} = await getLessons(
        `date=${format(currDate, 'yyyy-MM-dd')}${
          selectedCourse ? '&courseId=' + selectedCourse : ''
        }`
      );
      // generateEmptyStructure();
      if (data) {
        data.data.forEach(lesson => {
          const lessonStartTime = lesson.LessonSchedule.startTime;
          setLessons(prev => {
            return {
              ...prev,
              [lessonStartTime]: [...(prev[lessonStartTime] || []), lesson] // Update specific time slot with the lesson
            };
          });
          // setLessons(data.data);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect(() => {
  //   fetchLessons();
  // }, [selectedCourse, currDate]);
  return (
    <>
      {/* <label>
        <span>9-22</span>
        <Switch
          uncheckedIcon={false}
          checkedIcon={false}
          onChange={() => {
            // setCalendarType(!calendarType);
            // setStartingHour(!calendarType ? 0 : 9);
            // setSlotsSettings(!calendarType ? {height: 40, amount: 48} : {height: 58, amount: 26});
            // handleCalendarChange(!calendarType);
          }}
          //   checked={calendarType}
        />
        <span>00-24</span>
      </label> */}
      <FilteringBlock
        setSelectedCourse={setSelectedCourse}
        currDate={currDate}
        setCurrDate={setCurrDate}></FilteringBlock>
      <div className={styles.main}>
        <DateTable lessons={lessons} onClick={time => setSelectedTime(time)} />
        <div className={classNames(styles.main__cards, tableStyles.calendar, tableStyles.scroller)}>
          {selectedTime.length > 0 ? (
            lessons[selectedTime].map((lesson, index) => {
              return <LessonCard lesson={lesson} setLessons={setLessons}></LessonCard>;
            })
          ) : (
            <h2>Select time</h2>
          )}
        </div>
      </div>
    </>
  );
}
