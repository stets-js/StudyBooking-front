import React, {useState, useEffect} from 'react';
import styles from '../../styles/teacher.module.scss';
import Select from 'react-select';
import {format, addDays, startOfWeek, addMinutes} from 'date-fns';
import {uk} from 'date-fns/locale';

import {getCourses, getTeachersByCourse} from '../../helpers/course/course';
import {getSlotsForUsers} from '../../helpers/teacher/slots';
import SetAppointment from '../../components/modals/setAppointment/setAppointment';

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
  initialStartDate.setHours(startingHour, 0, 0, 0);

  const [startDates, setStartDates] = useState(
    Array.from({length: 7}, (_, i) => addDays(initialStartDate, i))
  );

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
      console.log(teachersIds);
      const slotsResponse = await getSlotsForUsers(teachersIds);
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

    if (selectedCourse && teachersIds) {
      fetchData();
    }
  }, [selectedCourse, selectedClassType, teachersIds]);
  const handleClose = () => {
    setIsOpen(!isOpen);
  };
  const handlePrevWeek = () => {
    setStartDates(startDates.map(startDate => addDays(startDate, -7)));
  };

  const handleNextWeek = () => {
    setStartDates(startDates.map(startDate => addDays(startDate, 7)));
  };
  const handleCellClick = async (weekDay, timeStr) => {
    const numSlotsToCheck = selectedClassType === 0 ? 3 : 2;

    const teachersIdsNew = [];

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

    teachersIdsNew.reduce((commonIds, currentArray) => {
      const filteredIds = currentArray.filter(id => commonIds.includes(id));

      return filteredIds;
    }, teachersIdsNew[0]);

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

    setTeachersIds(teachersIdsNew[0]);
  };
  return (
    <div>
      <div className={styles.dates_wrapper}>
        <button onClick={handlePrevWeek} className={styles.week_selector}>
          {`<<`}
        </button>
        <div>
          {format(startDates[0], 'dd.MM')} - {format(startDates[6], 'dd.MM')}
        </div>
        <button onClick={handleNextWeek} className={styles.week_selector}>
          {`>>`}
        </button>
      </div>
      <div>
        <Select
          className={styles.selector}
          options={courses}
          placeholder="Select course"
          required
          onChange={choice => {
            setSelectedSlots(Array.from({length: 7}, _ => []));
            setTeachersIds([]);
            setSelectedCourse(choice.value);
          }}
        />
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
      <button onClick={handleClose}>Додати групу</button>
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
        isOpen={isOpen}
        handleClose={handleClose}
        selectedSlots={selectedSlots}
        teachersIds={teachersIds}
        appointmentType={selectedClassType}
        course={courses.filter(el => el.value === selectedCourse)[0]}
      />
    </div>
  );
}
