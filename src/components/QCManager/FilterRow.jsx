import React, {useEffect} from 'react';
import {useState} from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import {format} from 'date-fns';
import Clear from '../../img/clear.svg';

import tableStyles from '../../styles/table.module.scss';
import selectorStyles from '../../styles/selector.module.scss';
import styles from './Manager.module.scss';
import FormInput from '../FormInput/FormInput';

export default function FitlerRow({reports, filterData, setFilterData, teacherPage = false}) {
  const [status] = useState([
    {label: 'Погодження', value: 'Pending'},
    {label: 'Погоджено', value: 'Approved'},
    {label: 'Апеляція', value: 'Declined'}
  ]);

  const getUniqueUsers = reports => {
    const uniqueUsers = [];
    const userIds = new Set();

    reports.forEach(el => {
      if (!userIds.has(el.User.id)) {
        userIds.add(el.User.id);
        uniqueUsers.push({label: el.User.name, value: el.User.id});
      }
    });

    return uniqueUsers;
  };
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    if (!filterData.mentorId) {
      const uniqueMentors = getUniqueUsers(reports);
      setMentors(uniqueMentors);
    }
  }, [reports, filterData]);

  useEffect(() => {
    setFilterData(prev => {
      const filteredReports = reports.filter(report => {
        const matchMentorId = !filterData.mentorId || report.mentorId === filterData.mentorId;
        const matchStatus = !filterData.status || report.status === filterData.status;
        const matchDate = !filterData.date || report.date === filterData.date;
        return matchMentorId && matchStatus && matchDate;
      });

      return {
        ...prev,
        reports: filteredReports
      };
    });
  }, [filterData.mentorId, filterData.status, filterData.date, reports]);

  useEffect(() => {
    setFilterData(prev => {
      return {...prev, reports: reports};
    });
  }, [reports]);
  console.log(filterData);
  const classes = () => {
    return filterData.reports.length > 0
      ? [tableStyles.cell, tableStyles.cell__outer, tableStyles.cell__mySubgroup]
      : [tableStyles.cell, tableStyles.cell__outer, tableStyles.cell__mySubgroup];
  };
  return (
    <tr key={'filter_row'}>
      <td className={tableStyles.cell__mySubgroup}>
        <div className={classNames(classes())}></div>
      </td>
      <td className={tableStyles.cell__mySubgroup}>
        <div className={classNames(classes())}></div>
      </td>
      {!teacherPage && (
        <td className={tableStyles.cell__mySubgroup}>
          <div className={classNames(classes())}>
            <Select
              className={selectorStyles.selector}
              options={mentors}
              isClearable
              placeholder="mentors"
              value={mentors.filter(mentor => mentor.value === filterData?.mentorId)}
              onChange={e => {
                setFilterData(prev => {
                  return {...prev, mentorId: e?.value || null};
                });
              }}
            />
          </div>
        </td>
      )}
      <td className={tableStyles.cell__mySubgroup}>
        <div className={classNames(classes())}>
          <div className={styles.filter__date__wrapper}>
            <div className={styles.filter__date}>
              <FormInput
                key={Math.random() * 100 - 1}
                value={filterData.date ? format(filterData.date, 'yyyy-MM-dd') : 0}
                type={'date'}
                handler={e =>
                  setFilterData(prev => {
                    return {...prev, date: e};
                  })
                }
              />
            </div>
            <button
              className={styles.filter__date__remove}
              onClick={() =>
                setFilterData(prev => {
                  return {...prev, date: null};
                })
              }>
              <img height="32" width="32" src={Clear} alt="X"></img>
            </button>
          </div>
        </div>
      </td>
      <td className={tableStyles.cell__mySubgroup}>
        <div className={classNames(classes())}></div>
      </td>
      <td className={tableStyles.cell__mySubgroup}>
        <div className={classNames(classes())}>
          <Select
            className={selectorStyles.selector}
            options={status}
            isClearable
            placeholder="Status"
            value={status.filter(stat => stat.label === filterData?.status)}
            onChange={e => {
              setFilterData(prev => {
                return {...prev, status: e?.label || null};
              });
            }}
          />
        </div>
      </td>
      <td className={tableStyles.cell__mySubgroup}>
        <div className={classNames(classes())}></div>
      </td>
    </tr>
  );
}
