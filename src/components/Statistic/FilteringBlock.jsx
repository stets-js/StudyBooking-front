import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {getCourses} from '../../helpers/course/course';
import selectorStyles from '../../styles/selector.module.scss';
export default function FilteringBlock({setSelectedCourse}) {
  const [courses, setCourses] = useState([]);
  const fetchCourses = async () => {
    const res = await getCourses();
    if (res)
      setCourses(
        res.data.map(el => {
          return {value: el.id, label: el.name};
        })
      );
  };
  useEffect(() => {
    fetchCourses();
  }, []);
  return (
    <div>
      <Select
        options={courses}
        isClearable
        className={selectorStyles.selector}
        onChange={e => {
          setSelectedCourse(e?.value || null);
        }}
      />
    </div>
  );
}
