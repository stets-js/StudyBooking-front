import React, {useState, useEffect} from 'react';
// import {error} from '@pnotify/core';
import Select from 'react-select';
import {success, error} from '@pnotify/core';
import {useConfirm} from 'material-ui-confirm';
import Switch from 'react-switch';
import {addMinutes, format} from 'date-fns';
import {useLocation, useParams} from 'react-router-dom';

import styles from '../../styles/teacher.module.scss';
import tableStyles from '../../styles/table.module.scss';
import teacherStyles from '../../styles/teacher.module.scss';
import appointmentStyles from '../../styles/appointment.module.scss';
import EditButton from '../../components/Buttons/Edit';
import DeleteButton from '../../components/Buttons/Delete';
import {bulkLessonCreate, deleteLessons} from '../../helpers/lessons/lesson';
import {updateSubgroupMentor} from '../../helpers/subgroup/subgroup';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import classNames from 'classnames';

export default function EditMySubgroup() {
  const location = useLocation();
  const confirm = useConfirm();
  const {t} = useTranslation('global');
  const [slotData, setSlotData] = useState({
    startingHour: 9,
    slotsAmount: 26,
    slotsHeight: 58
  });
  const {teacherId} = useParams() || null;
  let userId = useSelector(state => state.auth.user.id);
  if (teacherId) userId = teacherId;

  const {group} = location.state;
  const [selectedClassType, setSelectedClassType] = useState(null);

  const [oldSchedule, setOldSchedule] = useState(group.schedule);
  const [newSchedule, setNewSchedule] = useState('');
  const [slots, setSlots] = useState([]);
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  console.log(weekDays);
  const calculateSchedule = () => {
    let tmpSchedule = '';
    slots.forEach(slot => {
      if (slot.rowSpan) {
        tmpSchedule += `${weekDays[slot.weekDay]}: ${slot.time[0]} - ${slot.timeEnd}\n`;
      }
    });
    setNewSchedule(tmpSchedule);
  };
  const handleCellClick = ({time, weekDay, isSelected}) => {
    const selectedSlotsTMP = [];
    if (!selectedClassType) return error({text: t('teacher.mySubgroups.edit.error'), delay: 1000});
    for (let i = 0; i < (selectedClassType.value === 7 ? 3 : 2); i++) {
      const slotTime = format(addMinutes(time, 30 * i), 'HH:mm');
      if (slots.some(el => el.weekDay === weekDay && el.time === slotTime)) {
        return;
      }
      selectedSlotsTMP.push({
        weekDay,
        time: [
          slotTime,
          format(addMinutes(time, 30 * (selectedClassType.value === 7 ? 3 : 2)), 'HH:mm')
        ],
        timeEnd: format(addMinutes(time, 30 * (selectedClassType.value === 7 ? 3 : 2)), 'HH:mm'),
        startDate: group.SubGroup.startDate,
        endDate: group.SubGroup.endDate,
        mentorId: group.mentorId,
        subgroupId: group.subgroupId,
        appointmentTypeId: selectedClassType.value,
        rowSpan: i === 0 ? (selectedClassType.value === 7 ? 3 : 2) : 0
      });
    }
    if (!isSelected) setSlots(prev => [...prev, ...selectedSlotsTMP]);
  };
  useEffect(() => {
    calculateSchedule();
  }, [slots]);
  const appointmentTypes = [
    {label: 'Group', value: 7},
    {label: 'Individual', value: 8},
    {label: 'Kids group', value: 11}
  ];
  return (
    <div>
      <div className={teacherStyles.editMySubgroup__info__container}>
        <div className={teacherStyles.editMySubgroup__info__title}>{group.SubGroup.name}</div>
        <Select
          key={Math.random() * 1000 - 10}
          className={`${styles.selector} ${styles.selector__filtering}`}
          placeholder={t('teacher.mySubgroups.edit.lessonType.placeholder')}
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
        <div className={teacherStyles.editMySubgroup__info__schedule__container}>
          <div className={teacherStyles.editMySubgroup__info__schedule__item}>
            <h2>{t('teacher.mySubgroups.edit.oldSchedule')}</h2>
            {oldSchedule.split('\n').map(el => {
              let day = '';
              if (el) {
                day = t(`daysOfWeek.${el.slice(0, 3).toLowerCase()}`);
              }
              return (
                <React.Fragment key={el}>
                  {day + el.slice(day.length > 0 ? 3 : 0)} <br />
                </React.Fragment>
              );
            })}
          </div>
          <div className={teacherStyles.editMySubgroup__info__schedule__item}>
            <h2>{t('teacher.mySubgroups.edit.newSchedule')}</h2>
            {newSchedule.split('\n').map(el => {
              let day = '';
              if (el) {
                console.log(el);
                day = t(`daysOfWeek.${el.slice(0, 3).toLowerCase()}`);
              }
              return (
                <React.Fragment key={el}>
                  {day + el.slice(day.length > 0 ? 3 : 0)} <br />
                </React.Fragment>
              );
            })}
          </div>
        </div>
        <label>
          <span>9-22</span>
          <Switch
            uncheckedIcon={false}
            checkedIcon={false}
            onChange={() => {
              setSlotData(prev => {
                const res =
                  prev.startingHour === 0
                    ? {startingHour: 9, slotsAmount: 26, slotsHeight: 58}
                    : {startingHour: 0, slotsAmount: 48, slotsHeight: 40};
                return res;
              });
              // setCalendarType(!calendarType);
              // handleCalendarChange(!calendarType);
            }}
            checked={slotData.startingHour === 0}
          />
          <span>00-24</span>
        </label>
      </div>
      <>
        <div className={tableStyles.button__wrapper}>
          <EditButton
            text={t('teacher.mySubgroups.edit.buttons.conf')}
            disabled={slots.length === 0}
            onClick={() => {
              confirm({
                description: t('teacher.mySubgroups.edit.confirm.desc'),
                confirmationText: 'Yes',
                cancelText: 'No',
                confirmationButtonProps: {autoFocus: true}
              })
                .then(async () => {
                  // delete prev lessons
                  console.log({subgroupId: group.subgroupId, mentorId: group.mentorId});
                  const deletedLess = await deleteLessons({
                    subgroupId: group.subgroupId,
                    mentorId: group.mentorId
                  });
                  // create new
                  if (deletedLess) {
                    await slots
                      .filter(slot => slot.rowSpan !== 0)
                      .forEach(slot => bulkLessonCreate(slot));

                    await updateSubgroupMentor(
                      {
                        subgroupId: group.subgroupId,
                        mentorId: group.mentorId
                      },
                      {schedule: newSchedule}
                    );
                  }
                  setOldSchedule(newSchedule);
                  success({delay: 1000, text: 'Deleted successfully!'});
                })
                .catch(e => console.log('no ' + e));
            }}
            classname={'button__add'}></EditButton>
          <DeleteButton
            text={t('teacher.mySubgroups.edit.buttons.clear')}
            onClick={() => {
              setSlots([]);
            }}></DeleteButton>
        </div>
        <div>
          <table className={`${tableStyles.calendar} ${tableStyles.tableHeader}`}>
            <thead>
              <tr>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dateIndex) => (
                  <th key={dateIndex} className={`${tableStyles.columns} ${tableStyles.sticky}`}>
                    <div className={tableStyles.cell__header}>{weekDays[day.toLowerCase()]}</div>
                  </th>
                ))}
              </tr>
            </thead>
          </table>
          <div className={`${tableStyles.calendar} ${tableStyles.scroller}`}>
            <table className={tableStyles.tableBody} key="calendar">
              <tbody>
                {Array.from({length: slotData.slotsAmount}, (_, timeIndex) => {
                  // 24 - for making 20:30 last cell
                  const currentTime = addMinutes(
                    new Date(1970, 0, 1, slotData.startingHour, 0),
                    timeIndex * 30
                  );
                  if (currentTime.getHours() >= slotData.startingHour)
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
                                            height: `${slotData.slotsHeight * curr_slot?.rowSpan}px`
                                          }
                                        : {}
                                    }
                                    className={classNames(
                                      tableStyles.cell,
                                      slotData.startingHour === 0 ? tableStyles.cell__small : '',
                                      tableStyles.black_borders,
                                      timeIndex === 0 ||
                                        timeIndex === slotData.slotsAmount - 1 ||
                                        dateIndex === 0 ||
                                        dateIndex === 6
                                        ? tableStyles.cell__outer
                                        : tableStyles.cell__inner,
                                      // key can be generated only for appointed
                                      !curr_slot?.rowSpan && group
                                        ? appointmentStyles[`hover__group`]
                                        : '',
                                      curr_slot ? styles.selectedCell : ''
                                    )}
                                    onClick={() => {
                                      handleCellClick({
                                        time: currentTime,
                                        weekDay: dateIndex,
                                        isSelected: curr_slot
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
                  return <></>;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>
      {/* {isOpen && (
        <NewMySubgroup
          slots={slots}
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
          }}></NewMySubgroup> */}
      {/* )} */}
    </div>
  );
}
