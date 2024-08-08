import React, {useEffect} from 'react';
import {useState} from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import {format} from 'date-fns';

import EditButton from '../Buttons/Edit';
import DeleteButton from '../Buttons/Delete';

import tableStyles from '../../styles/table.module.scss';
import selectorStyles from '../../styles/selector.module.scss';
import styles from './Manager.module.scss';
import FormInput from '../FormInput/FormInput';
import {updateReport} from '../../helpers/manager/qcmanager';
import FitlerRow from './FilterRow';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Tbody({offsetData, reports, updateData, teacherPage}) {
  const [isEdit, setIsEdit] = useState(-1);
  const [filterData, setFilterData] = useState({
    mentorId: null,
    reports: reports,
    date: null,
    status: null
  });

  const [status] = useState([
    {label: 'Погодження', value: 'Pending'},
    {label: 'Погоджено', value: 'Approved'},
    {label: 'Апеляція', value: 'Declined'}
  ]);
  const [editData, setEditData] = useState({mark: null, status: null});

  const edit = (index, report) => {
    setIsEdit(index);
    setEditData({mark: report.mark, status: null});
  };
  const onSave = async id => {
    await updateReport(id, editData);
    setIsEdit(-1);
    updateData();
  };

  useEffect(() => {
    setFilterData(prev => {
      return {...prev, reports: reports};
    });
  }, [reports]);

  console.log(reports, typeof reports);
  console.log(filterData);
  return (
    <>
      <div className={styles.filter__wrapper}></div>
      <div className={classNames(tableStyles.calendar, tableStyles.scroller)}>
        <table className={tableStyles.tableBody}>
          <tbody>
            <InfiniteScroll
              height={'600px'}
              width={'100%'}
              dataLength={10} //This is important field to render the next data
              next={updateData}
              hasMore={offsetData.offset + offsetData.limit <= offsetData.total}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scroller">
              {reports.length > 0 && (
                <FitlerRow
                  reports={reports}
                  setFilterData={setFilterData}
                  filterData={filterData}
                  teacherPage={teacherPage}
                />
              )}

              {filterData.reports.length > 0 ? (
                filterData.reports.map((report, index) => {
                  if (!report) return <></>;
                  return (
                    <tr key={'' + report.id}>
                      <td className={tableStyles.cell__mySubgroup}>
                        <div
                          className={classNames(
                            tableStyles.cell,
                            tableStyles.cell__outer,
                            tableStyles.cell__mySubgroup
                          )}>
                          {report.Course ? report.Course.name : report.course}
                        </div>
                      </td>
                      <td className={tableStyles.cell__mySubgroup}>
                        <div
                          className={classNames(
                            tableStyles.cell,
                            tableStyles.cell__mySubgroup,
                            index === filterData.reports.length - 1
                              ? tableStyles.cell__outer
                              : tableStyles.cell__inner
                          )}>
                          {report?.SubGroup?.name}
                        </div>
                      </td>
                      {!teacherPage && (
                        <td className={tableStyles.cell__mySubgroup}>
                          <div
                            className={classNames(
                              tableStyles.cell,
                              tableStyles.cell__mySubgroup,
                              index === filterData.reports.length - 1
                                ? tableStyles.cell__outer
                                : tableStyles.cell__inner
                            )}>
                            <button
                              className={styles.filter__button}
                              onClick={() => {
                                setFilterData(prev => {
                                  return {...prev, mentorId: report.User?.id};
                                });
                              }}>
                              {report.User?.name}
                            </button>
                          </div>
                        </td>
                      )}
                      <td className={tableStyles.cell__mySubgroup}>
                        <div
                          className={classNames(
                            tableStyles.cell,
                            tableStyles.cell__mySubgroup,
                            index === filterData.reports.length - 1
                              ? tableStyles.cell__outer
                              : tableStyles.cell__inner
                          )}>
                          <button
                            className={styles.filter__button}
                            onClick={() => {
                              setFilterData(prev => {
                                return {...prev, sheet: report.sheetName};
                              });
                            }}>
                            {report.sheetName}
                          </button>
                        </div>
                      </td>
                      <td className={tableStyles.cell__mySubgroup}>
                        <div
                          className={classNames(
                            tableStyles.cell,
                            tableStyles.cell__mySubgroup,
                            index === filterData.reports.length - 1
                              ? tableStyles.cell__outer
                              : tableStyles.cell__inner
                          )}>
                          {isEdit !== index ? (
                            <>{report.mark}</>
                          ) : !teacherPage ? (
                            <>
                              <FormInput
                                type="number"
                                min={0}
                                max={100}
                                placeholder={report.mark}
                                value={editData.mark}
                                handler={e =>
                                  setEditData(prev => {
                                    return {...prev, mark: e};
                                  })
                                }
                              />
                            </>
                          ) : (
                            <>{report.mark}</>
                          )}
                        </div>
                      </td>
                      <td className={tableStyles.cell__mySubgroup}>
                        <div
                          className={classNames(
                            tableStyles.cell,
                            tableStyles.cell__mySubgroup,
                            index === filterData.reports.length - 1
                              ? tableStyles.cell__outer
                              : tableStyles.cell__inner
                          )}>
                          {(isEdit !== index || (isEdit === index && !teacherPage)) && (
                            <button
                              className={classNames(
                                styles.filter__button,
                                styles.filter__button__status,
                                styles.report__status,
                                report.status === 'Погоджено'
                                  ? styles.report__status__approved
                                  : report.status === 'Погодження'
                                  ? styles.report__status__approving
                                  : styles.report__status__declined
                              )}
                              onClick={() => {
                                setFilterData(prev => {
                                  return {...prev, status: report.status};
                                });
                              }}>
                              {report.status}
                            </button>
                          )}
                          {isEdit === index && teacherPage && (
                            <Select
                              className={classNames(selectorStyles.selector, styles.report__status)}
                              options={status}
                              defaultValue={{label: report.status}}
                              value={status.filter(
                                stat => stat.label === (editData?.status || report.status)
                              )}
                              onChange={e =>
                                setEditData(prev => {
                                  return {...prev, status: e.label};
                                })
                              }></Select>
                          )}
                        </div>
                      </td>
                      <td className={tableStyles.cell__mySubgroup}>
                        <div
                          className={`${tableStyles.cell} ${tableStyles.cell__outer} ${tableStyles.cell__mySubgroup}`}>
                          {isEdit !== index ? (
                            <EditButton
                              text="Змінити"
                              onClick={() => {
                                edit(index, report);
                              }}></EditButton>
                          ) : (
                            <div className={styles.buttons}>
                              <EditButton
                                text="Зберегти"
                                onClick={() => onSave(report.id)}></EditButton>
                              <DeleteButton
                                text="Відміна"
                                onClick={() => setIsEdit(-1)}></DeleteButton>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr key={'No'}>
                  <td className={tableStyles.cell__mySubgroup} colSpan={teacherPage ? 6 : 7}>
                    <div>No reports for now!</div>
                  </td>
                </tr>
              )}
            </InfiniteScroll>
          </tbody>
        </table>
      </div>
    </>
  );
}
