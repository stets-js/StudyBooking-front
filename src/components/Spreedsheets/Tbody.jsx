import React, {useState} from 'react';
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
  usersActivity,
  usersActivityByCourse
} from '../../helpers/spreadsheet/spreadsheet';
import EditButton from '../Buttons/Edit';
import FormInput from '../FormInput/FormInput';

export default function TableBody({headers}) {
  const [rows] = useState([
    {
      title: 'Реферальна система',
      link: 'https://docs.google.com/spreadsheets/d/1oWDWLZo0IuOR4UvmcjGzxk-2HWubNI2qaXTWDhyfhYY/edit?usp=sharing',
      onClick: referalSheet,
      dates: false
    },
    {
      title: 'Залученість (загальна)',
      link: 'https://docs.google.com/spreadsheets/d/1R23wuCk86AKCP4KJOyEQTjcZd7e9DKRCyyS2El9MWsA/edit?usp=sharing',
      onClick: allUsersStats,
      dates: false
    },

    {
      title: 'Залученість (По напрямах)',
      link: 'https://docs.google.com/spreadsheets/d/1R23wuCk86AKCP4KJOyEQTjcZd7e9DKRCyyS2El9MWsA/edit?usp=sharing',
      onClick: allUsersStatsByCourse,
      dates: false
    },

    {
      title: 'Активність (загальна)',
      link: 'https://docs.google.com/spreadsheets/d/1oLtCH6ZTyg6Q0ZNQaukxHciJRHRh-wjINAf7R6ctTAk/edit?usp=sharing',
      onClick: usersActivity,
      dates: true
    },
    {
      title: 'Активність (По напрямах)',
      link: 'https://docs.google.com/spreadsheets/d/1oLtCH6ZTyg6Q0ZNQaukxHciJRHRh-wjINAf7R6ctTAk/edit?usp=sharing',
      onClick: usersActivityByCourse,
      dates: true
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
                      {row.dates && index !== dateInputIndex && (
                        <EditButton
                          classname={'fullHeight'}
                          onClick={() => setDateInputIndex(index)}
                          text="Ввести діапазон"></EditButton>
                      )}
                      {row.dates && index === dateInputIndex && (
                        <div className={styles.dates__wrapper}>
                          <FormInput
                            type={'date'}
                            value={format(dates.start, 'yyyy-MM-dd')}
                            handler={e =>
                              setDates(prev => {
                                return {...prev, start: e};
                              })
                            }
                          />

                          <span>{'<->'}</span>
                          <FormInput
                            type={'date'}
                            value={format(dates.end, 'yyyy-MM-dd')}
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
                          try {
                            success('Запит відправився, очікуйте :)');
                            const res = await row.onClick(dates);
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
