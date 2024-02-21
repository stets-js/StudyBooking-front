import React, {useEffect, useState} from 'react';
import {format, addDays, getDay, addMinutes} from 'date-fns';
import Select from 'react-select';
import ukLocale from 'date-fns/locale/uk';
import styles from '../../styles/teacher.module.scss';
import {getCourses} from '../../helpers/course/course';
import {getFreeUsers} from '../../helpers/user/user';
export default function AvaliableTable() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWeekDay, setSelectedWeekDay] = useState(getDay(currentDate));
  const [users, setUsers] = useState([]);

  const generateTimeSlots = () => {
    const startTime = new Date().setHours(9, 0, 0, 0);
    const endTime = new Date().setHours(20, 30, 0, 0);

    const timeSlots = [];
    let currentTime = startTime;

    while (currentTime <= endTime) {
      timeSlots.push({
        time: format(currentTime, 'HH:mm'),
        names: []
      });
      currentTime = addMinutes(currentTime, 30);
    }

    return timeSlots;
  };

  const [scheduleTable, setScheduleTable] = useState(generateTimeSlots());

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
    const fetchUsers = async () => {
      setScheduleTable(generateTimeSlots());

      const freeUsers = (
        await getFreeUsers(selectedCourse, selectedWeekDay - 1 < 0 ? 6 : selectedWeekDay - 1)
      ).availableSlots;
      setScheduleTable(prevSchedule => {
        const newSchedule = [...prevSchedule];
        freeUsers.forEach(el => {
          const timeIndex = newSchedule.findIndex(slot => slot.time === el.time);
          if (timeIndex !== -1) {
            newSchedule[timeIndex].names.push(el.User.name);
          }
        });
        return newSchedule;
      });
    };

    if (selectedCourse) {
      fetchUsers();
    }
  }, [selectedCourse, selectedWeekDay]);

  const formatDate = date => {
    return format(date, 'iiii, dd.MM', {locale: ukLocale});
  };

  const handleDateChange = daysToAdd => {
    const newDate = addDays(currentDate, daysToAdd);
    setCurrentDate(newDate);
    // Reset selectedWeekDay to null when changing the date
    setSelectedWeekDay(getDay(newDate));
  };

  return (
    <div>
      <div className={styles.date_selector}>
        <button onClick={() => handleDateChange(-1)}>{'<<'}</button>
        <span>{formatDate(currentDate)}</span>
        <button onClick={() => handleDateChange(1)}>{'>>'}</button>
      </div>
      <Select
        options={courses}
        placeholder="Select course"
        required
        className={styles.selector}
        onChange={choice => {
          setSelectedCourse(choice.value);
        }}
      />

      <table className={styles.calendar__available} key={Math.random() * 100 - 1}>
        <tr className={styles.tableHeader}>
          <th>Час</th>
          <th>Викладачі</th>
        </tr>
        {scheduleTable.map(({time, names}) => (
          <tr key={time}>
            <td className={`${styles.cell} ${styles.available_cell}`}>{time}</td>
            <td className={`${styles.cell} ${styles.available_cell}`}>{names.join(', ')}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
