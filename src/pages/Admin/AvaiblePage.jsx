import React, {useEffect, useState} from 'react';
import {format, addDays, getDay, addMinutes} from 'date-fns';
import Select from 'react-select';
import styles from '../../styles/teacher.module.scss';
import {getCourses} from '../../helpers/course/course';
import {getFreeUsers} from '../../helpers/user/user';
import {Link} from 'react-router-dom';
export default function AvaliableTable() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWeekDay, setSelectedWeekDay] = useState(getDay(currentDate));
  const [valueGenerated, setValueGenerated] = useState(false);
  const generateTimeSlots = () => {
    const startTime = new Date().setHours(9, 0, 0, 0);
    const endTime = new Date().setHours(20, 30, 0, 0);

    const timeSlots = [];
    let currentTime = startTime;

    while (currentTime <= endTime) {
      timeSlots.push({
        time: format(currentTime, 'HH:mm'),
        users: []
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
      console.log(freeUsers);
      setScheduleTable(prevSchedule => {
        const newSchedule = [...prevSchedule];
        freeUsers.forEach(el => {
          const timeIndex = newSchedule.findIndex(slot => slot.time === el.time);
          if (timeIndex !== -1) {
            newSchedule[timeIndex].users.push(el.User);
          }
        });
        return newSchedule;
      });
      console.log(scheduleTable);
    };

    if (selectedCourse) {
      fetchUsers();
      setValueGenerated(true);
    }
  }, [selectedCourse, selectedWeekDay]);

  const formatDate = date => {
    return format(date, 'iiii, dd.MM');
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
        <button onClick={() => handleDateChange(-1)} className={styles.week_selector}>
          {'<<'}
        </button>
        <span>{formatDate(currentDate)}</span>
        <button onClick={() => handleDateChange(1)} className={styles.week_selector}>
          {'>>'}
        </button>
      </div>
      <Select
        options={courses}
        placeholder="Select course"
        required
        className={`${styles.selector} ${styles.half_width} ${styles.selector__filtering}`}
        onChange={choice => {
          setSelectedCourse(choice.value);
        }}
      />
      <br />
      <table className={styles.calendar__available} key={Math.random() * 100 - 1}>
        <tr className={styles.tableHeader}>
          <th className={`${styles.sticky} ${styles.cell} ${styles.cell__available}`}>Time</th>
          <th className={`${styles.columns} ${styles.sticky} ${styles.cell}`}>Mentors</th>
        </tr>
        {scheduleTable.map(({time, users}) => {
          return (
            <tr key={time}>
              <td className={`${styles.cell} ${styles.cell__available}`}>{time}</td>
              <td className={`${styles.cell}`}>
                <div className={styles.ul_items}>
                  {users.length > 0 &&
                    users.map((user, index) => (
                      <React.Fragment key={user.id}>
                        <Link
                          className={`${styles.teacher_name} ${styles.ul_items} ${styles.ul_items_link} `}
                          target="_self"
                          to={`../teacher/${user.id}`}>
                          <span className={styles.ul_items_text}>
                            {user.name}
                            {index !== users.length - 1 && ', '}{' '}
                          </span>
                        </Link>
                      </React.Fragment>
                    ))}
                </div>
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}
