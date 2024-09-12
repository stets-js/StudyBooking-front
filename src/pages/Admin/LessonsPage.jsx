import {format} from 'date-fns';
import React, {useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from '../../components/LessonsPage/statistic.module.scss';
import tableStyles from '../../styles/table.module.scss';
import Switch from 'react-switch';
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
  const [slotsData, setSlotsData] = useState({startingTime: 9, amount: 26});
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
  // useEffect(() => {
  //   generateEmptyStructure();
  //   fetchLessons();
  // }, []);
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
  useEffect(() => {
    generateEmptyStructure();
    console.log(123);
    fetchLessons();
  }, [selectedCourse, currDate]);
  return (
    <>
      <FilteringBlock
        setSelectedCourse={setSelectedCourse}
        onSwitchChange={checked =>
          setSlotsData(checked ? {startingTime: 9, amount: 26} : {startingTime: 0, amount: 48})
        }
        currDate={currDate}
        setCurrDate={setCurrDate}></FilteringBlock>
      <div className={styles.main}>
        <DateTable
          slotsData={slotsData}
          lessons={lessons}
          selectedTime={selectedTime}
          onClick={time => setSelectedTime(time)}
        />
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
