import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {format} from 'date-fns';
import Switch from 'react-switch';
import {getCourses} from '../../helpers/course/course';
import selectorStyles from '../../styles/selector.module.scss';
import FormInput from '../FormInput/FormInput';
import style from './statistic.module.scss';
export default function FilteringBlock({setSelectedCourse, currDate, setCurrDate, onSwitchChange}) {
  const [courses, setCourses] = useState([]);
  const [isChecked, setIsChecked] = useState({
    teamLeadOnly: false,
    replacements: false,
    fullDay: false
  });
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
  useEffect(() => {
    onSwitchChange(isChecked);
  }, [isChecked]);
  return (
    <div className={style.filtering__container}>
      <div className={style.filtering__switch}>
        <span className={style.filtering__switch__text}>My</span>
        <Switch
          uncheckedIcon={false}
          checkedIcon={false}
          onChange={() => {
            setIsChecked(prev => {
              return {...prev, teamLeadOnly: !isChecked.teamLeadOnly};
            });
          }}
          checked={!isChecked.teamLeadOnly}
        />
        <span className={style.filtering__switch__text}>All</span>
      </div>
      <div className={style.filtering__switch}>
        <span className={style.filtering__switch__text}>Lessons</span>
        <Switch
          uncheckedIcon={false}
          checkedIcon={false}
          onChange={() => {
            setIsChecked(prev => {
              return {...prev, replacements: !isChecked.replacements};
            });
          }}
          checked={isChecked.replacements}
        />
        <span className={style.filtering__switch__text}>Replacements</span>
      </div>
      <div className={style.filtering__switch}>
        <span className={style.filtering__switch__text}>9-22</span>
        <Switch
          uncheckedIcon={false}
          checkedIcon={false}
          onChange={() => {
            setIsChecked(prev => {
              return {...prev, fullDay: !isChecked.fullDay};
            });
          }}
          checked={isChecked.fullDay}
        />
        <span className={style.filtering__switch__text}>00-24</span>
      </div>
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
