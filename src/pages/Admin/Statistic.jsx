import {format} from 'date-fns';
import React, {useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import {getLessons} from '../../helpers/lessons/lesson';
import LessonCard from '../../components/Statistic/LessonCard';
import FilteringBlock from '../../components/Statistic/FilteringBlock';

export default function StatisticPage() {
  const [lessons, setLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currDate, setCurrDate] = useState(new Date());

  const fetchLessons = async () => {
    try {
      const {data} = await getLessons(
        `date=${format(currDate, 'yyyy-MM-dd')}${
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
          return <LessonCard lesson={lesson}></LessonCard>;
        })}
      </div>
    </>
  );
}
