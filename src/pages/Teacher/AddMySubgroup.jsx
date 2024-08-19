import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {useSelector} from 'react-redux';

import Switch from 'react-switch';
// import {error} from '@pnotify/core';
import {RadioButton, RadioGroup} from '@trendmicro/react-radio';
import {getCourses, getTeacherCourses} from '../../helpers/course/course';
import styles from '../../styles/teacher.module.scss';
import {getSubGroups} from '../../helpers/subgroup/subgroup';
import FormInput from '../../components/FormInput/FormInput';
import tableStyles from '../../styles/table.module.scss';
import {addMinutes, format} from 'date-fns';
import appointmentStyles from '../../styles/appointment.module.scss';
import NewMySubgroup from '../../components/modals/NewMySubgroup/NewMySubgroup';
import {useParams} from 'react-router-dom';
import EditButton from '../../components/Buttons/Edit';
import DeleteButton from '../../components/Buttons/Delete';
import classNames from 'classnames';

export default function AddMySubgroup() {
  const {teacherId} = useParams() || null;
  let userId = useSelector(state => state.auth.user.id);
  if (teacherId) userId = teacherId; //case when admin is logged in and wants to see another teachers schedule
  const [courses, setCourses] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [subGroup, setSubGroup] = useState(null);
  const [subGroups, setSubGroups] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedClassType, setSelectedClassType] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [teacherType, setTeacherType] = useState(2);
  const [calendarType, setCalendarType] = useState(false); // false - 9-22, true 00 -24
  const [calendarData, setCalendarData] = useState({startingDate: 9, amount: 26, length: 58});
  const handleClose = () => {
    setIsOpen(!isOpen);
  };
  const appointmentTypes = [
    {label: 'Group', value: 7},
    {label: 'Individual', value: 8},
    {label: 'Kids group', value: 11}
  ];
  const [userCourses, setUserCourses] = useState([]);
  useEffect(() => {
    getCourses().then(data => {
      setCourses(
        data.data
        // .map(el => {
        //   return {label: el.name, value: el.id, TeacherTypeId: el.TeacherTypeId};
        // })
      );
    });
  }, []);
  useEffect(() => {
    if (courses)
      getTeacherCourses(userId).then(data => {
        const newUserCourses = data.data;
        newUserCourses.forEach(userCourse => {
          const course = courses.find(el => el.id === userCourse.courseId);
          if (course)
            setUserCourses(prev => [
              ...prev,
              {label: course.name, value: course.id, TeacherTypeId: userCourse.TeacherTypeId}
            ]);
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses]);
  useEffect(() => {
    const fetchSubGroups = async () => {
      try {
        const res = await getSubGroups(`CourseId=${selectedCourse.value}`);
        setSubGroups(
          res.data.map(el => {
            return {label: el.name, value: el.id};
          })
        );
      } catch (error) {}
    };
    fetchSubGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse]);
  const [slots, setSlots] = useState([]);

  const handleCellClick = ({time, weekDay, isSelected, changeCalendarType}) => {
    if (selectedClassType === null || !selectedCourse || !subGroup) return;
    const selectedSlotsTMP = [];
    let isMovingDay = -1;
    for (let i = 0; i < (selectedClassType.value === 7 ? 3 : 2); i++) {
      const slotTime = format(addMinutes(time, 30 * i), 'HH:mm');
      if (slots.some(el => el.weekDay === weekDay && el.time[0] === slotTime)) {
        return;
      }
      const [hours, minutes] = slotTime.split(':');
      let weekDayCopy = weekDay;
      let rowSpan = selectedClassType.value === 7 ? 3 : 2;
      if (i !== 0) {
        if (hours === '00' && minutes === '00') {
          rowSpan -= i;
          isMovingDay = i;
        } else rowSpan = 0;
      }
      if (hours === '21' && minutes === '30' && i !== (selectedClassType.value === 7 ? 3 : 2) - 1) {
        changeCalendarType();
      }
      if (hours === '00' && minutes === '00' && i !== 0) weekDayCopy = (weekDayCopy + 1) % 7;

      selectedSlotsTMP.push({
        weekDay: weekDayCopy,
        skip: weekDayCopy !== weekDay,
        time: [
          slotTime,
          format(addMinutes(time, 30 * (selectedClassType.value === 7 ? 3 : 2)), 'HH:mm')
        ],
        timeEnd: format(addMinutes(time, 30 * (selectedClassType.value === 7 ? 3 : 2)), 'HH:mm'),
        startDate,
        endDate,
        mentorId: +userId,
        subgroupId: subGroup.value,
        appointmentTypeId: selectedClassType.value,
        rowSpan: rowSpan
      });
    }
    if (isMovingDay !== -1) selectedSlotsTMP[0].rowSpan = isMovingDay;
    if (!isSelected) setSlots(prev => [...prev, ...selectedSlotsTMP]);
  };
  return (
    <div className={styles.add_my_subgroup__wrapper}>
      <div className={styles.add_my_subgroup__intro}>
        Hello, this is the page with instructions for mentors. You should fill in the fields with
        info about the groups you already have in your scedule
      </div>
      <div>
        <h2>1. Select course: </h2>

        <Select
          name="courses"
          options={userCourses}
          placeholder="Select course"
          required
          className={`${styles.selector} ${styles.selector__filtering}`}
          onChange={choice => {
            setSelectedCourse(choice);
          }}
        />
      </div>
      {selectedCourse && (
        <>
          <div>
            <br />
            <h2>2. Select subgroup: </h2>
            <Select
              name="subGroupSelector"
              className={styles.selector}
              value={subGroups.filter(el => el.value === subGroup?.value)}
              options={subGroups}
              key={Math.random() * 100 - 10}
              required
              placeholder="Select subgroup"
              onChange={el => {
                setSubGroup(el);
              }}
            />
          </div>
          {selectedCourse && subGroup && (
            <>
              <br />
              <h2>3. Select time period and type of subgroup: </h2>
              <div className={styles.add_my_subgroup__date_wrapper}>
                <div>
                  <FormInput
                    type={'date'}
                    title={'Start'}
                    value={startDate}
                    handler={setStartDate}></FormInput>
                </div>
                <div>
                  <FormInput
                    type={'date'}
                    title={'End'}
                    classname={'right'}
                    value={endDate}
                    pattern="\d{2}.\d{2}.\d{4}"
                    handler={e => {
                      setEndDate(e);
                      // setTimeout(() => {
                      //   if (endDate < startDate && endDate[0] !== 2)
                      //     error({text: 'Something wrong with start/end date', delay: 1000});
                      // }, 2000);
                    }}></FormInput>
                </div>
              </div>
              <br />
              <div className={styles.add_my_subgroup__date_wrapper}>
                <Select
                  key={Math.random() * 1000 - 10}
                  className={`${styles.selector} ${styles.selector__filtering}`}
                  placeholder="Lesson Type"
                  value={
                    selectedClassType !== null &&
                    appointmentTypes.filter(el => el.value === selectedClassType.value)
                  }
                  options={appointmentTypes}
                  required
                  onChange={choice => {
                    setSelectedClassType(choice);
                    setSlots([]);
                  }}
                />
                <div className={styles.radio__group}>
                  <RadioGroup
                    name="teacherType"
                    value={String(teacherType)}
                    onChange={event => setTeacherType(+event.target.value)}>
                    <RadioButton value="1" className={styles.radio__button}>
                      soft
                    </RadioButton>
                    <RadioButton value="2" className={styles.radio__button}>
                      tech
                    </RadioButton>
                  </RadioGroup>
                </div>
              </div>
              <br />
              {/* <div>
                <label>
                  <span>9-22</span>
                  <Switch
                    uncheckedIcon={false}
                    checkedIcon={false}
                    onChange={switched => {
                      setCalendarType(!calendarType);
                      setCalendarData(
                        !switched
                          ? {startingDate: 9, amount: 26, length: 58}
                          : {startingDate: 0, amount: 48, length: 40}
                      );
                    }}
                    checked={calendarType}
                  />
                  <span>00-24</span>
                </label>
              </div> */}
              <br />
              {startDate && endDate && startDate <= endDate && selectedClassType !== null && (
                <>
                  <div className={tableStyles.button__wrapper}>
                    <EditButton
                      text="Create"
                      disabled={slots.length === 0}
                      onClick={() => setIsOpen(true)}
                      classname={'button__add'}></EditButton>
                    <DeleteButton
                      text="Clear"
                      onClick={() => {
                        setSlots([]);
                      }}></DeleteButton>
                  </div>
                  <div>
                    <table className={`${tableStyles.calendar} ${tableStyles.tableHeader}`}>
                      <thead>
                        <tr>
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                            (day, dateIndex) => (
                              <th
                                key={dateIndex}
                                className={`${tableStyles.columns} ${tableStyles.sticky}`}>
                                <div className={tableStyles.cell__header}>{day}</div>
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                    </table>
                    <div className={`${tableStyles.calendar} ${tableStyles.scroller}`}>
                      <table className={tableStyles.tableBody} key="calendar">
                        <tbody>
                          {Array.from({length: calendarData.amount}, (_, timeIndex) => {
                            const currentTime = addMinutes(
                              new Date(1970, 0, 1, calendarData.startingDate, 0),
                              timeIndex * 30
                            );
                            return (
                              <tr key={Math.random() * 1000 - 1}>
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                                  (date, dateIndex) => {
                                    const curr_slot = slots.find(
                                      slot =>
                                        slot.time[0] === format(currentTime, 'HH:mm') &&
                                        slot.weekDay === dateIndex
                                    );
                                    if (curr_slot && curr_slot.rowSpan === 0) return <></>;
                                    return (
                                      <td
                                        rowSpan={curr_slot ? curr_slot.rowSpan : 1}
                                        key={`${dateIndex}${currentTime}`}>
                                        {
                                          <button
                                            type="button"
                                            style={
                                              curr_slot?.rowSpan
                                                ? {
                                                    height: `${
                                                      calendarData.length * curr_slot?.rowSpan
                                                    }px`
                                                  }
                                                : {}
                                            }
                                            className={classNames(
                                              tableStyles.cell,
                                              tableStyles.black_borders,
                                              timeIndex === 0 ||
                                                timeIndex === calendarData.amount - 1 ||
                                                dateIndex === 0 ||
                                                dateIndex === 6
                                                ? tableStyles.cell__outer
                                                : tableStyles.cell__inner,
                                              // key can be generated only for appointed
                                              !curr_slot?.rowSpan && selectedCourse && subGroup
                                                ? appointmentStyles[`hover__group`]
                                                : '',
                                              curr_slot ? styles.selectedCell : '',
                                              calendarData.startingDate === 0
                                                ? tableStyles.cell__small
                                                : ''
                                            )}
                                            onClick={() => {
                                              handleCellClick({
                                                time: currentTime,
                                                weekDay: dateIndex,
                                                isSelected: curr_slot,
                                                changeCalendarType: () => {
                                                  setCalendarType(true);
                                                  setCalendarData({
                                                    startingDate: 0,
                                                    amount: 48,
                                                    length: 40
                                                  });
                                                }
                                              });
                                            }}>
                                            <div className={tableStyles.cell__content__wrapper}>
                                              {curr_slot ? (
                                                <>
                                                  <div>
                                                    {curr_slot.time[0]}
                                                    <br />-<br />
                                                    {curr_slot.timeEnd}
                                                  </div>
                                                </>
                                              ) : (
                                                format(currentTime, 'HH:mm')
                                              )}
                                            </div>
                                          </button>
                                        }
                                      </td>
                                    );
                                  }
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
      {isOpen && (
        <NewMySubgroup
          slots={slots}
          setSlots={setSlots}
          isOpen={isOpen}
          handleClose={handleClose}
          info={{
            selectedClassType,
            selectedCourse,
            subGroup,
            startDate,
            endDate,
            mentorId: +userId,
            teacherType
          }}></NewMySubgroup>
      )}
    </div>
  );
}
