/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import 'react-tooltip/dist/react-tooltip.css';

import selectorStyles from '../../styles/selector.module.scss';
import mentorStyles from './mentorChooser.module.scss';

import FormInput from '../FormInput/FormInput';
import classNames from 'classnames';
import {getCourses} from '../../helpers/course/course';

export default function FilteringBlock({setFilterName, filterName, setFilterCourse, setReset}) {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(
        res.data.map(course => {
          return {label: course.name, value: course.id};
        })
      );
    } catch (error) {}
  };
  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    let timeoutId;
    const resetWithDelay = async () => {
      try {
        setReset(true);
        console.log('hello');
      } catch (error) {
        console.error('Произошла ошибка:', error);
      }
    };

    const delayedFetch = async () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(resetWithDelay, 500);
    };
    if (filterName !== null) delayedFetch();

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterName]);

  return (
    <div className={mentorStyles.filtering__container}>
      <FormInput
        label_classname={'no_margin'}
        height={'52px'}
        type={'text'}
        placeholder={`Name`}
        value={filterName}
        handler={setFilterName}></FormInput>
      <Select
        options={courses}
        isClearable
        onChange={e => {
          setFilterCourse(e === null ? {} : e);
          setReset(true);
        }}
        className={classNames(
          selectorStyles.selector,
          selectorStyles.selector__no_margin
        )}></Select>
    </div>
  );
}
