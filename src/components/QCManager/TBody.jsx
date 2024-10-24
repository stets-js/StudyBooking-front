import React, {useEffect} from 'react';
import {useState} from 'react';
import classNames from 'classnames';
import Select from 'react-select';

import EditButton from '../Buttons/Edit';
import DeleteButton from '../Buttons/Delete';

import tableStyles from '../../styles/table.module.scss';
import selectorStyles from '../../styles/selector.module.scss';
import styles from './Manager.module.scss';
import FormInput from '../FormInput/FormInput';
import {getReports, updateReport} from '../../helpers/manager/qcmanager';
import FitlerRow from './FilterRow';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import InfoButton from '../Buttons/Info';

export default function Tbody({teacherPage, needToUpdate, setNeedToUpdate}) {
  const {teacherId} = useParams() || null;
  let userId = useSelector(state => state.auth.user.id);
  const userRole = useSelector(state => state.auth.user.role);
  if (teacherId) userId = teacherId; //case when admin is logged in and wants to see another teachers schedule
  const [reports, setReports] = useState([]);
  const [offsetData, setOffsetData] = useState({
    total: 0,
    limit: 20,
    offset: 0
  });
  const [isEdit, setIsEdit] = useState(-1);
  const [filterData, setFilterData] = useState({
    mentorId: userRole !== 'QC manager' ? userId : undefined,
    date: undefined,
    status: undefined,
    mark: 'DESC',
    reset: false,
    sheets: []
  });
  console.log(userRole);
  const [status] = useState([
    {label: 'Погодження', value: 'Pending'},
    {label: 'Погоджено', value: 'Approved'},
    {label: 'Апеляція', value: 'Declined'}
  ]);
  const [editData, setEditData] = useState({mark: null, status: null});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchAllReports = async (reset = false) => {
    const data = await getReports(
      `?limit=${offsetData.limit}&offset=${
        filterData.reset || reset ? 0 : offsetData.offset
      }&mark=${filterData.mark || 'DESC'}&mentorId=${filterData.mentorId}&status=${
        filterData.status
      }&sheet=${filterData.sheet}&course=${filterData.courseId}`
    );
    setReports(prev => (filterData.reset || reset ? data.data : [...prev, ...data.data]));

    setOffsetData(prevOffsetData => {
      return {
        ...prevOffsetData,
        total: data.totalCount,
        offset: filterData.reset || reset ? 0 : data.newOffset
      };
    });
    setFilterData(prev => {
      return {...prev, reset: false};
    });
  };
  useEffect(() => {
    setFilterData(prev => ({
      ...prev,
      sheets: reports.map(report => ({label: report.sheetName, value: report.sheetName}))
    }));
  }, [reports]);
  console.log(filterData);
  useEffect(() => {
    fetchAllReports();
  }, []);
  useEffect(() => {
    if (filterData.reset) {
      fetchAllReports();
    }
  }, [filterData]);
  useEffect(() => {
    if (needToUpdate) {
      setNeedToUpdate(false);
      setFilterData(prev => ({...prev, reset: true}));
      setOffsetData(prev => ({...prev, offset: 0}));
    }
  }, [needToUpdate]);
  const edit = (index, report) => {
    setIsEdit(index);
    setEditData({mark: report.mark, status: null});
  };
  const onSave = async (id, data = null) => {
    await updateReport(id, data || editData);

    setIsEdit(-1);
    fetchAllReports(true);
  };
  console.log(filterData);
  return (
    <>
      <div className={styles.filter__wrapper}></div>
      <div className={classNames(tableStyles.calendar, tableStyles.scroller)} id="scroller">
        <InfiniteScroll
          style={{height: '100%'}}
          // height={'600px'}
          width={'100%'}
          height={'100%'}
          dataLength={reports.length} //This is important field to render the next data
          next={fetchAllReports}
          hasMore={offsetData.offset + offsetData.limit <= offsetData.total}>
          <table className={tableStyles.tableBody}>
            <FitlerRow
              updateReport={query => {
                fetchAllReports(query, true);
              }}
              reports={reports}
              setFilterData={setFilterData}
              filterData={filterData}
              teacherPage={teacherPage}
            />
            <tbody>
              {reports.length > 0 ? (
                reports.map((report, index) => {
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
                          <button
                            className={styles.filter__button}
                            onClick={() => {
                              setFilterData(prev => {
                                return {
                                  ...prev,
                                  courseId: report.courseId || report.course,
                                  reset: true
                                };
                              });
                            }}>
                            {report.Course ? report.Course.name : report.course}
                          </button>
                        </div>
                      </td>
                      <td className={tableStyles.cell__mySubgroup}>
                        <div
                          className={classNames(
                            tableStyles.cell,
                            tableStyles.cell__mySubgroup,
                            index === reports.length - 1
                              ? tableStyles.cell__outer
                              : tableStyles.cell__inner
                          )}>
                          <a href={report?.link} target="_blank" rel="noreferrer">
                            Click
                          </a>
                        </div>
                      </td>
                      {!teacherPage && (
                        <td className={tableStyles.cell__mySubgroup}>
                          <div
                            className={classNames(
                              tableStyles.cell,
                              tableStyles.cell__mySubgroup,
                              index === reports.length - 1
                                ? tableStyles.cell__outer
                                : tableStyles.cell__inner
                            )}>
                            <button
                              className={styles.filter__button}
                              onClick={() => {
                                setFilterData(prev => {
                                  return {...prev, mentorId: report.User?.id, reset: true};
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
                            index === reports.length - 1
                              ? tableStyles.cell__outer
                              : tableStyles.cell__inner
                          )}>
                          <button
                            className={styles.filter__button}
                            onClick={() => {
                              setFilterData(prev => {
                                return {...prev, sheet: report.sheetName, reset: true};
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
                            index === reports.length - 1
                              ? tableStyles.cell__outer
                              : tableStyles.cell__inner
                          )}>
                          {isEdit !== index ? (
                            <>{report.total}</>
                          ) : !teacherPage ? (
                            <>
                              <FormInput
                                type="number"
                                min={0}
                                max={100}
                                placeholder={report.total}
                                value={editData.total}
                                handler={e =>
                                  setEditData(prev => {
                                    return {...prev, total: e};
                                  })
                                }
                              />
                            </>
                          ) : (
                            <>{report.total}</>
                          )}
                        </div>
                      </td>
                      <td className={tableStyles.cell__mySubgroup}>
                        <div
                          className={classNames(
                            tableStyles.cell,
                            tableStyles.cell__mySubgroup,
                            index === reports.length - 1
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
                                  return {...prev, status: report.status, reset: true};
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
                          className={classNames(
                            tableStyles.cell,
                            tableStyles.cell__outer,
                            tableStyles.cell__mySubgroup
                          )}>
                          {userRole === 'QC manager' ? (
                            isEdit !== index ? (
                              <EditButton
                                text="Змінити"
                                onClick={() => {
                                  edit(index, report);
                                }}
                              />
                            ) : (
                              <div className={styles.buttons}>
                                <EditButton
                                  text="Зберегти"
                                  onClick={() => onSave(report.id)}></EditButton>
                                <DeleteButton
                                  text="Відміна"
                                  onClick={() => setIsEdit(-1)}></DeleteButton>
                              </div>
                            )
                          ) : (
                            <EditButton
                              text="Погодитись"
                              onClick={() => {
                                onSave(report.id, {mark: report.mark, status: 'Погоджено'});
                              }}
                            />
                          )}
                          {userRole !== 'QC manager' && (
                            <InfoButton
                              text="Апеляція"
                              onClick={() => {
                                window.open(
                                  'https://docs.google.com/forms/d/e/1FAIpQLScQa0r5NHzT_Q_LxwfunuaCpSjh5DsJUJS6vIMSIdU1WQZIuw/viewform'
                                );
                              }}></InfoButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <>
                  <tr key={'No'} style={{height: '480px'}}>
                    <td className={tableStyles.cell__mySubgroup} colSpan={teacherPage ? 6 : 7}>
                      <div>No reports for now!</div>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>{' '}
        </InfiniteScroll>
      </div>
    </>
  );
}
