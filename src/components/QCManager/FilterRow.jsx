import React, {useEffect} from 'react';
import {useState} from 'react';
import classNames from 'classnames';
import Select from 'react-select';

import Arrow from '../../img/down-arrow.png';

import tableStyles from '../../styles/table.module.scss';
import selectorStyles from '../../styles/selector.module.scss';
import styles from './Manager.module.scss';

import {getSheets} from '../../helpers/spreadsheet/spreadsheet';
import {getUsers} from '../../helpers/user/user';
import {getCourses} from '../../helpers/course/course';
import {useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';

export default function FitlerRow({filterData, setFilterData, teacherPage = false}) {
  const {teacherId} = useParams() || null;
  let userId = useSelector(state => state.auth.user.id);
  if (teacherId) {
    userId = teacherId;
  } //case when admin is logged in and wants to see another teacher

  const [status] = useState([
    {label: 'Погодження', value: 'Pending'},
    {label: 'Погоджено', value: 'Approved'},
    {label: 'Апеляція', value: 'Declined'}
  ]);
  const [mentors, setMentors] = useState([]);
  const [courses, setCourses] = useState([]);
  const fetchUsers = async () => {
    const users = await getUsers(`role=teacher`);
    setMentors(
      users.data.map(el => {
        return {label: el.name, value: el.id};
      })
    );
  };
  const fetchCourses = async () => {
    const courses = await getCourses(teacherPage ? `userCourses=true&mentorId=${userId}` : '');
    console.log(courses);
    setCourses([
      ...courses.data.map(el => {
        return {label: el.name, value: el.id};
      }),
      {label: 'Soft', value: 'Soft'}
    ]);
  };

  useEffect(() => {
    fetchUsers();
    fetchCourses();
  }, []);

  const classes = () => {
    return [tableStyles.cell, tableStyles.cell__outer, tableStyles.cell__mySubgroup];
  };

  const spreadsheetId = '1gbBpJfNZzkURPnOIghqPWDxkDovdRKVK_YxlotmkcIY';
  const [sheets, setSheets] = useState([]);
  const fetchSheets = async () => {
    if (teacherPage) {
      setSheets(filterData.sheets);
    } else {
      const {data} = await getSheets(spreadsheetId);
      setSheets(
        data.data.sheets.map((el, index) => {
          return {label: el, value: index};
        })
      );
    }
  };

  useEffect(() => {
    fetchSheets();
  }, []);
  return (
    <thead className={styles.thead}>
      <tr key={'filter_row'}>
        <th className={tableStyles.cell__mySubgroup}>
          <div className={classNames(classes())}>
            <Select
              className={selectorStyles.selector}
              options={courses}
              isClearable
              placeholder="Course"
              value={courses.filter(course => course.value === filterData?.courseId)}
              onChange={e => {
                setFilterData(prev => {
                  return {...prev, reset: true, courseId: e?.value || null};
                });
              }}
            />
          </div>
        </th>
        <th className={tableStyles.cell__mySubgroup}>
          <div className={classNames(classes())}></div>
        </th>
        {!teacherPage && (
          <th className={tableStyles.cell__mySubgroup}>
            <div className={classNames(classes())}>
              <Select
                className={selectorStyles.selector}
                options={mentors}
                isClearable
                placeholder="mentors"
                value={mentors.filter(mentor => mentor.value === filterData?.mentorId)}
                onChange={e => {
                  setFilterData(prev => {
                    return {...prev, reset: true, mentorId: e?.value || null};
                  });
                }}
              />
            </div>
          </th>
        )}
        <th className={tableStyles.cell__mySubgroup}>
          <div className={styles.filter__date__wrapper}>
            <div className={classNames(classes(), styles.filter__date)}>
              <Select
                className={selectorStyles.selector}
                isClearable
                options={sheets}
                value={sheets.find(sheet => sheet.label === filterData.sheet)}
                onChange={e => {
                  setFilterData(prev => {
                    return {...prev, reset: true, sheet: e?.label || null};
                  });
                }}></Select>
            </div>
          </div>
        </th>
        <th className={tableStyles.cell__mySubgroup}>
          <div className={classNames(classes())}>
            <button
              onClick={() => {
                setFilterData(prev => {
                  return {...prev, reset: true, mark: prev.mark === 'DESC' ? 'ASC' : 'DESC'};
                });
              }}
              className={classNames(
                styles.filter__button,
                styles.filter__button__no_border,
                filterData.mark === 'ASC' && styles.filter__button__up
              )}>
              <img src={Arrow} alt=">"></img>
            </button>
          </div>
        </th>
        <th className={tableStyles.cell__mySubgroup}>
          <div className={classNames(classes())}>
            <Select
              className={selectorStyles.selector}
              options={status}
              isClearable
              placeholder="Status"
              value={status.filter(stat => stat.label === filterData?.status)}
              onChange={e => {
                setFilterData(prev => {
                  return {...prev, reset: true, status: e?.label || null};
                });
              }}
            />
          </div>
        </th>
        <th className={tableStyles.cell__mySubgroup}>
          <div className={classNames(classes())}></div>
        </th>
      </tr>
    </thead>
  );
}
