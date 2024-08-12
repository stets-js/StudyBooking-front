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
import {getSheets} from '../../helpers/spreadsheet/spreadsheet';
import {getUsers} from '../../helpers/user/user';

export default function FitlerRow({reports, filterData, setFilterData, teacherPage = false}) {
  const [status] = useState([
    {label: 'Погодження', value: 'Pending'},
    {label: 'Погоджено', value: 'Approved'},
    {label: 'Апеляція', value: 'Declined'}
  ]);
  const [mentors, setMentors] = useState([]);
  const fetchUsers = async () => {
    const users = await getUsers(`role=teacher`);
    setMentors(
      users.data.map(el => {
        return {label: el.name, value: el.id};
      })
    );
  };

  useEffect(() => {
    if (!filterData.mentorId) {
      fetchUsers();
    }
  }, []);

  useEffect(() => {
    setFilterData(prev => {
      const filteredReports = reports.filter(report => {
        const matchMentorId = !filterData.mentorId || report.mentorId === filterData.mentorId;
        const matchStatus = !filterData.status || report.status === filterData.status;
        const matchSheet = !filterData.sheet || report.sheet === filterData.sheet;
        return matchMentorId && matchStatus && matchSheet;
      });

      return {
        ...prev,
        reports: filteredReports
      };
    });
  }, [filterData.mentorId, filterData.status, filterData.sheet, reports]);

  useEffect(() => {
    setFilterData(prev => {
      return {...prev, reports: reports};
    });
  }, [reports]);
  const classes = () => {
    return filterData.reports.length > 0
      ? [tableStyles.cell, tableStyles.cell__outer, tableStyles.cell__mySubgroup]
      : [tableStyles.cell, tableStyles.cell__outer, tableStyles.cell__mySubgroup];
  };

  const spreadsheetId = '1gbBpJfNZzkURPnOIghqPWDxkDovdRKVK_YxlotmkcIY';
  const [sheets, setSheets] = useState([]);
  const fetchSheets = async () => {
    const {data} = await getSheets(spreadsheetId);
    setSheets(
      data.data.sheets.map((el, index) => {
        return {label: el, value: index};
      })
    );
  };

  useEffect(() => {
    fetchSheets();
  }, []);
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
        <div className={styles.filter__date__wrapper}>
          <div className={classNames(classes(), styles.filter__date)}>
            <Select
              className={selectorStyles.selector}
              isClearable
              options={sheets}
              value={sheets.find(sheet => sheet.label === filterData.sheet)}
              onChange={e => {
                setFilterData(prev => {
                  return {...prev, sheet: e?.label || null};
                });
              }}></Select>
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
