import React, {useEffect, useState} from 'react';
import {format, getDay, addMinutes} from 'date-fns';
import Select from 'react-select';
import {Link} from 'react-router-dom';
import classNames from 'classnames';
import selectorStyles from '../../styles/selector.module.scss';
import styles from '../../styles/teacher.module.scss';
import tableStyles from '../../styles/table.module.scss';
import {getCourses} from '../../helpers/course/course';
import {getFreeUsers} from '../../helpers/user/user';
import OneDaySelector from '../../components/DateSelector/OneDaySelector';

export default function AvaliableTable() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointmentTypes] = useState([
    {label: 'Group', value: 'group'},
    {label: 'Individual', value: 'private'}
  ]);
  const [selectedAppointment, SetSelectedAppointment] = useState({
    label: 'Group',
    value: 'group'
  });
  const [teacherTypes] = useState([
    {label: 'Soft', value: 1},
    {label: 'Tech', value: 2}
  ]);
  const [selectedTeacherType, setSelectedTeacherType] = useState({label: 'Tech', value: 2});
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

  const fetchUsers = async () => {
    setScheduleTable(generateTimeSlots());

    const freeUsers = (
      await getFreeUsers(
        selectedCourse,
        getDay(currentDate) - 1 < 0 ? 6 : getDay(currentDate) - 1,
        `appointmentType=${selectedAppointment.value}&teacherType=${selectedTeacherType.value}`
      )
    ).availableSlots;
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
  };
  useEffect(() => {
    if (selectedCourse && selectedTeacherType) {
      fetchUsers();
      // setValueGenerated(true);
    }
  }, [selectedCourse, selectedAppointment, currentDate, selectedTeacherType]);

  return (
    <div>
      <div className={styles.available_nav_wrapper}>
        <div className={styles.available_nav__selectors}>
          <Select
            options={courses}
            placeholder="Select course"
            required
            className={classNames(
              selectorStyles.selector,
              selectorStyles.selector__fullwidth,
              selectorStyles.selector__filtering,
              styles.available_nav__item
            )}
            onChange={choice => {
              setSelectedCourse(choice.value);
            }}
          />
          <Select
            options={teacherTypes}
            placeholder="Select teacher type"
            required
            value={selectedTeacherType}
            className={classNames(
              selectorStyles.selector,
              selectorStyles.selector__fullwidth,
              selectorStyles.selector__filtering,
              styles.available_nav__item
            )}
            onChange={choice => {
              setSelectedTeacherType(choice);
            }}
          />
          <Select
            options={appointmentTypes}
            placeholder="Appointment type"
            required
            defaultValue={selectedAppointment}
            className={classNames(
              selectorStyles.selector,
              selectorStyles.selector__fullwidth,
              selectorStyles.selector__filtering,
              styles.available_nav__item
            )}
            onChange={choice => {
              SetSelectedAppointment(choice);
            }}
          />
        </div>
        <OneDaySelector currentDate={currentDate} setCurrentDate={setCurrentDate}></OneDaySelector>
      </div>

      <div
        className={`${tableStyles.calendar} ${tableStyles.calendar__small} ${tableStyles.scroller}`}>
        <table className={tableStyles.tableBody}>
          <tbody>
            {scheduleTable.map(({time, users}, index) => {
              return (
                <tr key={time}>
                  <td className={tableStyles.cell__available}>
                    <div
                      className={`${tableStyles.cell} ${tableStyles.black_borders} ${tableStyles.cell__outer} `}>
                      {time}
                    </div>
                  </td>
                  <td>
                    <div
                      className={`${tableStyles.cell} ${tableStyles.black_borders} ${tableStyles.cell__outer} ${tableStyles.cell__outer__big} ${styles.ul_items}`}>
                      {users.length > 0 ? (
                        users.map((user, index) => (
                          <React.Fragment key={user.id}>
                            <Link
                              className={`${styles.teacher_name} ${styles.ul_items} ${styles.ul_items_link} `}
                              target="_self"
                              to={`../teacher/${user.id}`}>
                              <span className={styles.ul_items_text}>
                                {user.name}
                                {index !== users.length - 1 && ', '}
                              </span>
                            </Link>
                          </React.Fragment>
                        ))
                      ) : (
                        <span className={styles.ul_items_text}>...</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
