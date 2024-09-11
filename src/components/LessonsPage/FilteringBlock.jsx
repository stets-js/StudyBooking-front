import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {format} from 'date-fns';

import {getCourses} from '../../helpers/course/course';
import selectorStyles from '../../styles/selector.module.scss';
import FormInput from '../FormInput/FormInput';
import style from './statistic.module.scss';
export default function FilteringBlock({setSelectedCourse, currDate, setCurrDate}) {
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
    <div className={style.filtering__container}>
      <Select
        options={courses}
        isClearable
        className={selectorStyles.selector}
        placeholder={'Course..'}
        onChange={e => {
          setSelectedCourse(e?.value || null);
        }}
      />
      <div className={style.filtering__date}>
        <FormInput
          height={'54px'}
          type={'date'}
          value={format(currDate, 'yyyy-MM-dd')}
          handler={e => {
            setCurrDate(prev => {
              try {
                return format(e, 'yyyy-MM-dd');
              } catch (error) {
                return prev;
              }
            });
          }}
        />
      </div>
    </div>
  );
}
