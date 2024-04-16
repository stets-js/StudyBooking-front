import React, {useEffect, useState} from 'react';
import Select from 'react-select';

import {getCourses} from '../../helpers/course/course';
import styles from '../../styles/teacher.module.scss';
import {getSubGroups} from '../../helpers/subgroup/subgroup';
import FormInput from '../../components/FormInput/FormInput';
import tableStyles from '../../styles/table.module.scss';
import {addMinutes, format} from 'date-fns';
import appointmentStyles from '../../styles/appointment.module.scss';
export default function AddMySubgroup() {
  const [courses, setCourses] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [subGroup, setSubGroup] = useState(null);
  const [subGroups, setSubGroups] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedClassType, setSelectedClassType] = useState(null);
  const appointmentTypes = [
    {label: 'Group', value: 0},
    {label: 'Individual', value: 1},
    {label: 'Junior group', value: 2}
  ];
  useEffect(() => {
    getCourses().then(data => {
      setCourses(
        data.data.map(el => {
          return {label: el.name, value: el.id};
        })
      );
    });
  }, []);

  useEffect(() => {
    const fetchSubGroups = async () => {
      try {
        const res = await getSubGroups(`CourseId=${selectedCourse}`);
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
  console.log(slots);
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
          options={courses}
          placeholder="Select course"
          required
          className={`${styles.selector} ${styles.selector__filtering}`}
          onChange={choice => {
            setSelectedCourse(choice.value);
          }}
        />
      </div>
      {selectedCourse && (
        <>
          <div>
            <h2>2. Select subgroup: </h2>
            <Select
              name="subGroupSelector"
              className={styles.selector}
              value={subGroups.filter(el => el.value === subGroup)}
              options={subGroups}
              key={Math.random() * 100 - 10}
              required
              placeholder="Select subgroup"
              onChange={el => setSubGroup(el.value)}
            />
          </div>
          {selectedCourse && subGroup && (
            <>
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
                    handler={setEndDate}></FormInput>
                </div>
              </div>

              <div>
                <Select
                  key={Math.random() * 1000 - 10}
                  className={`${styles.selector} ${styles.selector__filtering}`}
                  placeholder="Lesson Type"
                  value={
                    selectedClassType !== null &&
                    appointmentTypes.filter(el => el.value === selectedClassType)
                  }
                  options={appointmentTypes}
                  required
                  onChange={choice => {
                    setSelectedClassType(choice.value);
                  }}
                />
              </div>
              {startDate && endDate && selectedClassType !== null && (
                <>
                  {slots.length > 0 && (
                    <button
                      //   onClick={}
                      className={`${styles.button} ${styles.button__add}`}>
                      Create
                    </button>
                  )}
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
                          {Array.from({length: 24}, (_, timeIndex) => {
                            // 24 - for making 20:30 last cell
                            const currentTime = addMinutes(new Date(`1970 9:00`), timeIndex * 30);
                            if (currentTime.getHours() >= 9)
                              return (
                                <tr key={Math.random() * 1000 - 1}>
                                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                                    (date, dateIndex) => {
                                      const curr_slot = slots.find(
                                        slot =>
                                          slot.time === format(currentTime, 'hh:mm') &&
                                          slot.day === dateIndex
                                      );
                                      if (curr_slot && curr_slot.rowSpan === 0) return <></>;
                                      return (
                                        <td rowSpan={curr_slot ? curr_slot.rowSpan : 1}>
                                          {
                                            <button
                                              type="button"
                                              style={
                                                curr_slot?.rowSpan
                                                  ? {
                                                      height: `${58 * curr_slot?.rowSpan}px`
                                                    }
                                                  : {}
                                              }
                                              className={`${tableStyles.cell} ${
                                                tableStyles.black_borders
                                              } ${
                                                timeIndex === 0 ||
                                                timeIndex === 23 ||
                                                dateIndex === 0 ||
                                                dateIndex === 6
                                                  ? tableStyles.cell__outer
                                                  : tableStyles.cell__inner
                                              } ${
                                                // key can be generated only for appointed
                                                !curr_slot?.rowSpan && selectedCourse && subGroup
                                                  ? appointmentStyles[`hover__group`]
                                                  : ''
                                              } ${curr_slot ? styles.selectedCell : ''}`}
                                              onClick={({
                                                time = currentTime,
                                                day = dateIndex,
                                                isSelected = curr_slot
                                              }) => {
                                                if (
                                                  selectedClassType === null ||
                                                  !selectedCourse ||
                                                  !subGroup
                                                )
                                                  return;
                                                const selectedSlotsTMP = [];
                                                for (
                                                  let i = 0;
                                                  i < (selectedClassType === 0 ? 3 : 2);
                                                  i++
                                                ) {
                                                  if (isSelected) {
                                                    console.log(isSelected);
                                                    const tmp = slots.filter(slot => {
                                                      console.log(slot);
                                                      return (
                                                        slot.day !== isSelected.day &&
                                                        slot.time !== isSelected.time
                                                      );
                                                    });
                                                    setSlots([...tmp]);
                                                  } else
                                                    selectedSlotsTMP.push({
                                                      day,
                                                      time: format(
                                                        addMinutes(time, 30 * i),
                                                        'HH:mm'
                                                      ),
                                                      rowSpan:
                                                        i === 0
                                                          ? selectedClassType === 0
                                                            ? 3
                                                            : 2
                                                          : 0
                                                    });
                                                }
                                                if (!isSelected)
                                                  setSlots([...slots, ...selectedSlotsTMP]);
                                              }}>
                                              <div className={tableStyles.cell__content__wrapper}>
                                                {format(currentTime, 'HH:mm')}
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
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
