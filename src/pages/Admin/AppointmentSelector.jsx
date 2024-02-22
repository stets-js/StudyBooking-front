import React, {useState, useEffect} from 'react';
import styles from '../../styles/teacher.module.scss';
import Select from 'react-select';
import {format, addDays, startOfWeek, addMinutes} from 'date-fns';
import {uk} from 'date-fns/locale';

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
  const [startDate, setStartDate] = useState(startDates[0]);
  const [endDate, setEndDate] = useState(null);
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
    const fetchUsersIds = async () => {
      const usersIds = await getTeachersByCourse(selectedCourse);
      setTeachersIds(usersIds);
    };
    if (selectedCourse) {
      fetchUsersIds();
    }
  }, [selectedCourse, selectedClassType]);

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
  const handleCellClick = async (weekDay, timeStr) => {
    const numSlotsToCheck = selectedClassType === 0 ? 3 : 2;

    let teachersIdsNew = [];

    for (let slotIndex = 0; slotIndex < numSlotsToCheck; slotIndex++) {
      // validating slots
      const currentTime = addMinutes(new Date(`1970 ${timeStr}`), slotIndex * 30);
      const isAlreadySelected = selectedSlots[weekDay].includes(format(currentTime, 'HH:mm'));
      if (isAlreadySelected) {
        return new Error('Slot already selected');
      }
      const slots = slotsData[weekDay]?.[format(currentTime, 'HH:mm')];
      if (!slots || !slots.length) return new Error('not enough slots');
      teachersIdsNew.push(slots.map(el => el.userId));
    }

    teachersIdsNew = teachersIdsNew[0].filter(id => {
      return teachersIdsNew.every(currentArray => currentArray.includes(id));
    });
    if (!teachersIdsNew || !teachersIdsNew.length) {
      // validating  that there is at least one teacher in the array
      return new Error('Cant find avaible teacher, Slots is occupied for different teachers');
    }

    for (let slotIndex = 0; slotIndex < numSlotsToCheck; slotIndex++) {
      const currentTime = addMinutes(new Date(`1970 ${timeStr}`), slotIndex * 30);
      const slots = slotsData[weekDay]?.[format(currentTime, 'HH:mm')];
      selectedSlots[weekDay].push(
        slots.map(el => {
          return el.time;
        })[0]
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
              {label: 'Група', value: 0},
              {label: 'Індив', value: 1}
            ].filter(el => el.value === selectedClassType)}
            options={[
              {label: 'Група', value: 0},
              {label: 'Індив', value: 1}
            ]}
            required
            onChange={choice => {
              setSelectedSlots(Array.from({length: 7}, _ => []));
              setSelectedClassType(choice.value);
            }}
          />
        </div>
        <div className={styles.chooser_selector__item}>
          <FormInput
            type={'date'}
            title={'Початок'}
            value={startDate}
            pattern="(0[1-9]|[12][0-9]|3[01]).(0[1-9]|1[0-2]).\d{4}"
            handler={setStartDate}></FormInput>
        </div>
        <div className={styles.chooser_selector__item}>
          <FormInput
            type={'date'}
            title={'Кінець'}
            value={endDate}
            pattern="\d{2}.\d{2}.\d{4}"
            handler={setEndDate}></FormInput>
        </div>
        <button
          onClick={handleClose}
          className={`${styles.add_button} ${styles.chooser_selector__item}`}
          disabled={selectedSlotsAmount === 0}>
          Додати{' '}
        </button>
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

                      return (
                        <td key={dayIndex}>
                          <button
                            className={`${styles.cell} ${
                              selectedSlots[weekDay].includes(timeStr) ? styles.selectedCell : ''
                            }`}
                            disabled={!(numPeople > 0)}
                            onClick={() => handleCellClick(weekDay, timeStr)}>
                            {format(currentTime, 'HH:mm')} ({numPeople})
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
        course={courses.filter(el => el.value === selectedCourse)[0]}
      />
    </div>
  );
}
