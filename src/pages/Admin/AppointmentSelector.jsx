import React, {useState, useEffect} from 'react';
import styles from '../../styles/teacher.module.scss';
import Select from 'react-select';
import {format, addDays, startOfWeek, addMinutes} from 'date-fns';
import {uk} from 'date-fns/locale';
import Switch from 'react-switch';
import {error} from '@pnotify/core';
import {getCourses, getTeachersByCourse} from '../../helpers/course/course';
import {getSlotsForUsers} from '../../helpers/teacher/slots';
import SetAppointment from '../../components/modals/setAppointment/setAppointment';
import FormInput from '../../components/FormInput/FormInput';

export default function UsersPage() {
  const [slotsData, setSlotsData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState();
  const [teachersIds, setTeachersIds] = useState([]);
  const initialStartDate = startOfWeek(new Date(), {weekStartsOn: 1});
  const startingHour = 9;
  const [selectedClassType, setSelectedClassType] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState(Array.from({length: 7}, _ => []));
  const [selectedSlotsAmount, setSelectedSlotsAmount] = useState(0);
  initialStartDate.setHours(startingHour, 0, 0, 0);

  const [startDates, setStartDates] = useState(
    Array.from({length: 7}, (_, i) => addDays(initialStartDate, i))
  );
  const [startDate, setStartDate] = useState(format(startDates[0], 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(null);

  const [renderTeachers, setRenderTeachers] = useState(false);

  useEffect(() => {
    getCourses().then(data => {
      setCourses(
        data.data.map(el => {
          return {label: el.name, value: el.id};
        })
      );
    });
  }, []);
  const [isReplacement, setIsReplacement] = useState(false);
  useEffect(() => {
    const fetchUsersIds = async () => {
      try {
        const usersIds = await getTeachersByCourse(selectedCourse);
        setTeachersIds(usersIds);
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedCourse) {
      fetchUsersIds();
    }
    if (renderTeachers) setRenderTeachers(false);
  }, [selectedCourse, selectedClassType, renderTeachers]);
  useEffect(() => {
    const fetchData = async () => {
      const slotsResponse = await getSlotsForUsers({userIds: teachersIds, startDate, endDate});
      const slots = slotsResponse.data;
      const organizedSlots = {};
      slots.forEach(slot => {
        const weekDay = slot.weekDay;
        const time = slot.time;

        if (!organizedSlots[weekDay]) {
          organizedSlots[weekDay] = {};
        }

        if (!organizedSlots[weekDay][time]) {
          organizedSlots[weekDay][time] = [];
        }

        organizedSlots[weekDay][time].push(slot);
      });

      setSlotsData(organizedSlots);
    };
    if (endDate < startDate) {
      // add snackebar for alerting  user about wrong input
      return;
    }
    if (selectedCourse && teachersIds && startDate && endDate) {
      fetchData();
    }
  }, [selectedCourse, selectedClassType, teachersIds, startDate, endDate]);
  const handleClose = () => {
    setIsOpen(!isOpen);
  };
  // const handlePrevWeek = () => {
  //   setStartDates(startDates.map(startDate => addDays(startDate, -7)));
  // };

  // const handleNextWeek = () => {
  //   setStartDates(startDates.map(startDate => addDays(startDate, 7)));
  // };
  const clearTable = () => {
    setSelectedSlots(Array.from({length: 7}, _ => []));
    setRenderTeachers(true);
  };

  const handleCellClick = async (weekDay, timeStr) => {
    const numSlotsToCheck = selectedClassType === 0 ? 3 : 2;

    let teachersIdsNew = [];
    for (let slotIndex = 0; slotIndex < numSlotsToCheck; slotIndex++) {
      // validating slots
      const currentTime = addMinutes(new Date(`1970 ${timeStr}`), slotIndex * 30);
      const isAlreadySelected = selectedSlots[weekDay].find(
        el => el?.time === format(currentTime, 'HH:mm')
      );
      if (isAlreadySelected) {
        return error({delay: 1000, text: 'Slot already selected'});
      }
      const slots = slotsData[weekDay]?.[format(currentTime, 'HH:mm')];
      if (!slots || !slots.length) return error({delay: 1000, text: 'Not enough slots'});
      teachersIdsNew.push(slots.map(el => el.userId));
    }

    teachersIdsNew = teachersIdsNew[0].filter(id => {
      return teachersIdsNew.every(currentArray => currentArray.includes(id));
    }); // filtering for teachers that matches all slots

    if (!teachersIdsNew || !teachersIdsNew.length) {
      // validating  that there is at least one teacher in the array
      error({text: 'Cant find avaible teacher, Slots occupied by different teachers', delay: 1000});
      return;
    }

    for (let slotIndex = 0; slotIndex < numSlotsToCheck; slotIndex++) {
      const currentTime = addMinutes(new Date(`1970 ${timeStr}`), slotIndex * 30);
      selectedSlots[weekDay].push(
        {time: format(currentTime, 'HH:mm'), rowSpan: slotIndex === 0 ? numSlotsToCheck : 0} // if first td -> show, else dont show
      );
    }
    setSelectedSlotsAmount(selectedSlotsAmount + 1);
    setTeachersIds(teachersIdsNew);
  };
  return (
    <div>
      {/* <div className={styles.dates_wrapper}>
        <button onClick={handlePrevWeek} className={styles.week_selector}>
          {`<<`}
        </button>
        <div>
          {format(startDates[0], 'dd.MM')} - {format(startDates[6], 'dd.MM')}
        </div>
        <button onClick={handleNextWeek} className={styles.week_selector}>
          {`>>`}
        </button>
      </div> */}
      <div className={styles.chooser_selector}>
        <div className={styles.chooser_selector__item}>
          <Select
            options={courses}
            placeholder="Select course"
            required
            className={styles.selector}
            onChange={choice => {
              setSelectedSlots(Array.from({length: 7}, _ => []));
              setTeachersIds([]);
              setSelectedCourse(choice.value);
            }}
          />
        </div>
        <div className={styles.chooser_selector__item}>
          <Select
            key={Math.random() * 1000 - 10}
            className={styles.selector}
            placeholder="Select type"
            defaultValue={[
              {label: 'Group', value: 0},
              {label: 'individual', value: 1}
            ].filter(el => el.value === selectedClassType)}
            options={[
              {label: 'Group', value: 0},
              {label: 'individual', value: 1}
            ]}
            required
            onChange={choice => {
              setSelectedSlots(Array.from({length: 7}, _ => []));
              setSelectedClassType(choice.value);
            }}
          />
        </div>

        <div className={styles.replacement_wrapper}>
          <label>
            <span className={styles.date_selector}>Replacement</span>
          </label>
          <div className={styles.replacement_wrapper__switch}>
            <Switch
              onChange={() => {
                setIsReplacement(!isReplacement);
              }}
              checked={isReplacement}
            />
          </div>
        </div>

        <div className={styles.chooser_selector__item__date}>
          <FormInput
            type={'date'}
            title={'Start'}
            value={startDate}
            defaultValue={isReplacement ? startDate : null}
            // pattern="(0[1-9]|[12][0-9]|3[01]).(0[1-9]|1[0-2]).\d{4}"
            handler={setStartDate}></FormInput>
        </div>
        <div className={styles.chooser_selector__item__date}>
          <FormInput
            type={'date'}
            title={'End'}
            value={endDate}
            pattern="\d{2}.\d{2}.\d{4}"
            handler={setEndDate}></FormInput>
        </div>
        <div className={styles.chooser_selector__item}>
          <button
            onClick={handleClose}
            className={`${styles.button} ${styles.button__add}`}
            disabled={selectedSlotsAmount === 0}>
            Create{' '}
          </button>
          <button
            onClick={() => {
              clearTable();
            }}
            className={`${styles.button} ${styles.button__delete}`}>
            Clear
          </button>
        </div>
      </div>
      <div className={styles.scroller}>
        <table className={styles.calendar}>
          <thead className={styles.tableHeader}>
            <tr>
              {startDates.map((startDate, dateIndex) => (
                <td key={dateIndex} className={`${styles.columns} ${styles.sticky} ${styles.cell}`}>
                  <div>
                    <div>
                      {format(startDate, 'EEEE', {locale: uk}).charAt(0).toUpperCase() +
                        format(startDate, 'EEEE', {locale: uk}).slice(1)}
                    </div>

                    <div>{format(startDate, 'dd.MM')}</div>
                  </div>
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({length: 25}, (_, timeIndex) => {
              const currentTime = addMinutes(new Date(`1970 9:00`), timeIndex * 30);
              if (currentTime.getHours() >= startingHour)
                return (
                  <tr key={timeIndex}>
                    {Array.from({length: 7}, (_, dayIndex) => {
                      const weekDay = dayIndex;
                      const timeStr = format(currentTime, 'HH:mm');

                      const numPeople = slotsData[weekDay]?.[timeStr]?.length || 0;
                      const element = selectedSlots[weekDay].find(el => el.time === timeStr);
                      if (element) {
                        if (element.rowSpan <= 0) {
                          return <></>;
                        }
                      }
                      return (
                        <td key={dayIndex} rowSpan={element ? element?.rowSpan : 1}>
                          <button
                            style={
                              element
                                ? {
                                    height: `${
                                      35 * element.rowSpan + element.rowSpan * element.rowSpan
                                    }px`
                                  }
                                : // slot && slot.rowSpan !== undefined
                                  // ? {
                                  //     height: `${35 * slot.rowSpan + 3 * slot.rowSpan}px`
                                  //   }
                                  // :
                                  {}
                            }
                            className={`${styles.cell} ${element ? styles.selectedCell : ''}`}
                            disabled={!(numPeople > 0)}
                            onClick={() => handleCellClick(weekDay, timeStr)}>
                            {element
                              ? `${timeStr} - ${format(
                                  addMinutes(currentTime, 30 * element.rowSpan),
                                  'HH:mm'
                                )} (${numPeople})`
                              : `${timeStr} (${numPeople})`}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
            })}
          </tbody>
        </table>
      </div>

      <SetAppointment
        setSelectedCourse={setSelectedCourse}
        startDate={startDate}
        endDate={endDate}
        isOpen={isOpen}
        handleClose={handleClose}
        selectedSlots={selectedSlots}
        teachersIds={JSON.stringify(teachersIds)}
        appointmentType={selectedClassType}
        isReplacement={isReplacement}
        course={courses.filter(el => el.value === selectedCourse)[0]}
        onSubmit={() => {
          clearTable();
        }}
      />
    </div>
  );
}
