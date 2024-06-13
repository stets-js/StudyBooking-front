import React, {useEffect, useState} from 'react';
import {error, success} from '@pnotify/core';
import {format} from 'date-fns';

import {getLessons} from '../../helpers/lessons/lesson';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import LessonCard from '../../components/MyLessonPage/LessonCard';
import FilteringBlock from '../../components/Statistic/FilteringBlock';

export default function MyLessonPage() {
  const {teacherId} = useParams() || null;
  let userId = useSelector(state => state.auth.user.id);
  if (teacherId) userId = teacherId; //case when admin is logged in and wants to see another teachers schedule
  const [lessons, setLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currDate, setCurrDate] = useState(new Date());

  const fetchLessons = async () => {
    try {
      const {data} = await getLessons(
        `mentorId=${userId}&date=${format(currDate, 'yyyy-MM-dd')}${
          selectedCourse ? '&courseId=' + selectedCourse : ''
        }`
      );
      if (data) {
        setLessons(data.data);
        // setOffset(data.newOffset);
        // setTotalAmount(data.totalCount);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchLessons();
  }, []);
  useEffect(() => {
    fetchLessons();
  }, [selectedCourse, currDate]);
  return (
    <>
      <FilteringBlock
        setSelectedCourse={setSelectedCourse}
        currDate={currDate}
        setCurrDate={setCurrDate}></FilteringBlock>
      <div>
        {(lessons || []).map(lesson => {
          return <LessonCard lesson={lesson} setLessons={setLessons}></LessonCard>;
        })}
        {lessons.length === 0 ? <>Ops, no lessons today :(</> : <></>}
      </div>
    </>
  );
}
