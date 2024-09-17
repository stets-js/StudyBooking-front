import React, {useEffect, useState} from 'react';
import {error, success} from '@pnotify/core';
import {format} from 'date-fns';
import classNames from 'classnames';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {getLessons} from '../../helpers/lessons/lesson';
import WriteFeedback from '../../components/modals/Feedback/WriteFeedback';
import FilteringBlock from '../../components/LessonsPage/FilteringBlock';
import LessonCard from '../../components/LessonsPage/LessonCard';
import DateTable from '../../components/LessonsPage/DateTable';
import styles from '../../components/LessonsPage/statistic.module.scss';
import tableStyles from '../../styles/table.module.scss';
import {fetchLessons, generateEmptyStructure} from '../../components/LessonsPage/functions';

export default function MyLessonPage() {
  const {teacherId} = useParams() || null;
  let userId = useSelector(state => state.auth.user.id);
  if (teacherId) userId = teacherId; //case when admin is logged in and wants to see another teachers schedule
  const [lessons, setLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currDate, setCurrDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [slotsData, setSlotsData] = useState({
    startingTime: 9,
    amount: 26,
    replacements: false
  });

  useEffect(() => {
    setLessons(generateEmptyStructure());
    console.log(123);
    fetchLessons(
      `mentorId=${userId}&date=${format(currDate, 'yyyy-MM-dd')}${
        selectedCourse ? '&courseId=' + selectedCourse : ''
      }${slotsData.teamLeadOnly ? '&teamLeadOnly=true' : ''}${
        slotsData.replacements ? '&replacements=true' : ''
      }`,
      setLessons
    );
  }, [selectedCourse, currDate, slotsData]);
  return (
    <>
      <FilteringBlock
        setSelectedCourse={setSelectedCourse}
        currDate={currDate}
        onSwitchChange={checked => {
          setSlotsData(prev => {
            let obj = {};
            if (checked.fullDay) {
              obj = {...obj, ...{startingTime: 0, amount: 48}};
            } else {
              obj = {...obj, ...{startingTime: 9, amount: 26}};
            }
            obj = {...obj, replacements: checked.replacements};
            return obj;
          });
        }}
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

      <WriteFeedback
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        id={selectedLesson?.id}></WriteFeedback>
    </>
  );
}
