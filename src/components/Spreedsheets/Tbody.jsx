import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {format} from 'date-fns';
import tableStyles from '../../styles/table.module.scss';
import classNames from 'classnames';
import InfoButton from '../Buttons/Info';
import styles from './spreadsheets.module.scss';
import {success, error} from '@pnotify/core';
import {
  allUsersStats,
  allUsersStatsByCourse,
  referalSheet,
  updateSurvey,
  usersActivity,
  usersActivityByCourse
} from '../../helpers/spreadsheet/spreadsheet';
import EditButton from '../Buttons/Edit';
import FormInput from '../FormInput/FormInput';
import {getCourses} from '../../helpers/course/course';

import selectorStyle from '../../styles/selector.module.scss';

export default function TableBody() {
  const [rows] = useState([
    {
      title: 'Реферальна система',
      link: 'https://docs.google.com/spreadsheets/d/1oWDWLZo0IuOR4UvmcjGzxk-2HWubNI2qaXTWDhyfhYY/edit?usp=sharing',
      onClick: referalSheet,
      dates: false
    },
    {
      title: 'Залученість (По напрямах)',
      link: 'https://docs.google.com/spreadsheets/d/1R23wuCk86AKCP4KJOyEQTjcZd7e9DKRCyyS2El9MWsA/edit?usp=sharing',
      onClick: allUsersStatsByCourse,
      dates: false,
      selectByCourse: true
    },
    {
      title: 'Активність (По напрямах)',
      link: 'https://docs.google.com/spreadsheets/d/1oLtCH6ZTyg6Q0ZNQaukxHciJRHRh-wjINAf7R6ctTAk/edit?usp=sharing',
      onClick: usersActivityByCourse,
      dates: true,
      selectByCourse: true
    },
    {
      title: 'Залученість (загальна)',
      link: 'https://docs.google.com/spreadsheets/d/1R23wuCk86AKCP4KJOyEQTjcZd7e9DKRCyyS2El9MWsA/edit?usp=sharing',
      onClick: allUsersStats,
      dates: false
    },

    {
      title: 'Активність (загальна)',
      link: 'https://docs.google.com/spreadsheets/d/1oLtCH6ZTyg6Q0ZNQaukxHciJRHRh-wjINAf7R6ctTAk/edit?usp=sharing',
      onClick: usersActivity,
      dates: true
    },
    {
      title: 'Опитування',
      link: 'https://docs.google.com/spreadsheets/d/1yXL-m63lfL6R3DSrOY73YkwdcJFB1bnKYvYkTDnN0VU/edit?usp=sharing',
      onClick: updateSurvey,
      withoutInput: true,
      dates: false
    }
  ]);
  const outerOrInnerCell = index => {
    return index === rows.length - 1 ? tableStyles.cell__outer : tableStyles.cell__inner;
  };
  const getStartOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  };

  const getEndOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
  };

  const [dates, setDates] = useState({start: getStartOfMonth(), end: getEndOfMonth()});

  const [dateInputIndex, setDateInputIndex] = useState(-1);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseSelectorIndex, setCourseSelectorIndex] = useState(-1);
  const fetchCourses = async () => {
    try {
      const courses = await getCourses();
      setCourses(
        courses.data.map(el => {
          return {label: el.name, value: el.id};
        })
      );
    } catch (e) {
      // error('Something went wrong');
      console.log(e);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <>
      <div className={classNames(tableStyles.calendar, tableStyles.scroller)}>
        <table className={tableStyles.tableBody}>
          <tbody>
            {rows.map((row, index) => {
              return (
                <tr>
                  <td className={tableStyles.cell__mySubgroup}>
                    <div
                      className={classNames(
                        tableStyles.cell,
                        tableStyles.cell__outer,
                        tableStyles.cell__mySubgroup
                      )}>
                      {row.title}
                    </div>
                  </td>
                  <td className={tableStyles.cell__mySubgroup}>
                    <div
                      className={classNames(
                        tableStyles.cell,
                        tableStyles.cell__mySubgroup,
                        outerOrInnerCell(index)
                      )}>
                      <a href={row.link} className={styles.link} target="_blank" rel="noreferrer">
                        Link
                      </a>
                    </div>
                  </td>

                  <td className={tableStyles.cell__mySubgroup}>
                    <div
                      className={classNames(
                        tableStyles.cell,
                        tableStyles.cell__mySubgroup,
                        outerOrInnerCell(index),
                        styles.date__wrapper
                      )}>
                      {row.selectByCourse && index !== courseSelectorIndex && (
                        <EditButton
                          classname={'fullHeight'}
                          onClick={() => setCourseSelectorIndex(index)}
                          text="Ввести Курс"></EditButton>
                      )}{' '}
                      {row.dates && index !== dateInputIndex && (
                        <EditButton
                          classname={'fullHeight'}
                          onClick={() => setDateInputIndex(index)}
                          text="Ввести діапазон"></EditButton>
                      )}
                      {row?.selectByCourse && index === courseSelectorIndex && (
                        <Select
                          className={selectorStyle.selector}
                          options={courses}
                          value={courses.filter(course => course.value === selectedCourse)}
                          onChange={e => setSelectedCourse(e.value)}></Select>
                      )}
                      {row.dates && index === dateInputIndex && (
                        <div className={styles.dates__wrapper}>
                          <FormInput
                            type={'date'}
                            value={dates.start && format(dates.start, 'yyyy-MM-dd')}
                            handler={e =>
                              setDates(prev => {
                                return {...prev, start: e};
                              })
                            }
                          />

                          <span>{'<->'}</span>
                          <FormInput
                            type={'date'}
                            value={dates.end && format(dates.end, 'yyyy-MM-dd')}
                            handler={e =>
                              setDates(prev => {
                                return {...prev, end: e};
                              })
                            }
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className={tableStyles.cell__mySubgroup}>
                    <div
                      className={`${tableStyles.cell} ${tableStyles.cell__outer} ${tableStyles.cell__mySubgroup}`}>
                      <InfoButton
                        text="Оновити"
                        onClick={async () => {
                          if (row.dates && dateInputIndex !== index)
                            return error('Спочатку введіть діапазон');
                          else if (row?.selectByCourse && !selectedCourse)
                            error('Увага, без вибраного курса не всі данні будуть завантажені');
                          try {
                            success('Запит відправився, очікуйте :)');
                            const res = await (row.withoutInput
                              ? row.onClick()
                              : row.onClick(dates, selectedCourse));
                            if (res) success({text: 'success', delay: 800});
                          } catch (e) {
                            error({
                              text: e.response.data?.message || 'Something went wrong',
                              delay: 800
                            });
                          }
                        }}></InfoButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
