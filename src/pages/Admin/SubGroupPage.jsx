import React, {useEffect, useState} from 'react';
import {useConfirm} from 'material-ui-confirm';
import Select from 'react-select';
import {success} from '@pnotify/core';
import Switch from 'react-switch';
import {addDays, addMinutes, format, getDay} from 'date-fns';

import {deleteSubGroup, getSubGroups} from '../../helpers/subgroup/subgroup';
import styles from '../../styles/teacher.module.scss';
import FormInput from '../../components/FormInput/FormInput';
import {getCourses} from '../../helpers/course/course';
import ChangeSubGroup from '../../components/modals/ChangeSubGroup/ChangeSubGroup';
import {getSlots} from '../../helpers/teacher/slots';

export default function SubGroupPage() {
  const [subGroups, setSubGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const confirm = useConfirm();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [render, setRender] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedWeekDay, setSelectedWeekDay] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchData = async (query = '') => {
    try {
      const data = await getSubGroups(query);
      setSubGroups(data.data);
    } catch (e) {
      // error('Something went wrong');
      console.log(e);
    }
  };
  const fetchCourses = async () => {
    try {
      const courses = await getCourses();
      setCourses(
        courses.data.map(el => {
          return {label: el.name, value: el.id};
        })
      );
    } catch (e) {
      // error('Something went wrong');
      console.log(e);
    }
  };
  useEffect(() => {
    //first time render
    fetchData('');
    fetchCourses();
  }, []);
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
  const fetchSubGroupsByTime = async () => {
    setScheduleTable(generateTimeSlots());
    const data = await getSlots(
      `type&weekDay=${selectedWeekDay}&endSubGroup=${format(currentDate, 'yyyy-MM-dd')}`
    );
    setScheduleTable(prevSchedule => {
      const newSchedule = [...prevSchedule];
      data.data.forEach(el => {
        const timeIndex = newSchedule.findIndex(slot => slot.time === el.time);
        if (timeIndex !== -1) {
          newSchedule[timeIndex].names.push(el.SubGroup.name);
        }
      });
      return newSchedule;
    });
  };

  useEffect(() => {
    if (isChecked) fetchSubGroupsByTime();
  }, [isChecked, selectedWeekDay]);

  useEffect(() => {
    if (render) {
      fetchData('');
      setRender(false);
    }
  }, [render, isChecked]);
  useEffect(() => {
    fetchData(selectedCourse !== null ? `CourseId=${selectedCourse}` : '');
  }, [selectedCourse]);

  const handleDelete = async (id, name) => {
    confirm({
      description: 'Are you sure you want to delete ' + name,
      confirmationText: 'delete',
      confirmationButtonProps: {autoFocus: true}
    })
      .then(async () => {
        await deleteSubGroup(id);
        setSubGroups(prevSubGroups => prevSubGroups.filter(subgroup => subgroup.id !== id));
        success({delay: 1000, text: 'Deleted successfully!'});
      })
      .catch(e => console.log('no ' + e));
  };

  const filteredSubGroups = subGroups.filter(element =>
    element.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDateChange = daysToAdd => {
    const newDate = addDays(currentDate, daysToAdd);
    setCurrentDate(newDate);
    // Reset selectedWeekDay to null when changing the date
    setSelectedWeekDay(getDay(newDate) - 1 < 0 ? 6 : getDay(newDate) - 1);
  };
  const formatDate = date => {
    return format(date, 'iiii, dd.MM');
  };

  return (
    <div>
      <div className={styles.calendar__available}>
        <div className={styles.filter_wrapper}>
          <div className={styles.grid_item}>
            <FormInput
              type="text"
              title={'Search by name'}
              placeholder="Name..."
              value={searchQuery}
              classname={'green'}
              handler={setSearchQuery}
            />
          </div>
          <Select
            className={`${styles.selector} ${styles.selector__filtering} ${styles.subgroup_selector}`}
            options={courses}
            placeholder={'Select course'}
            onChange={el => setSelectedCourse(el?.value || null)}
            isClearable></Select>
          <div className={styles.one_day_wrapper}>
            <label>
              <span className={styles.date_selector}>One day</span>
            </label>
            <Switch
              onChange={() => {
                setIsChecked(!isChecked);
              }}
              checked={isChecked}
            />
          </div>
        </div>

        {!isChecked ? (
          <>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={`${styles.columns} ${styles.sticky} ${styles.cell}`}>Name</th>
                  <th className={`${styles.columns} ${styles.sticky} ${styles.cell}`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  // loader ? (
                  //   <tr>
                  //     <td colSpan={2} className={`${styles.cell} ${styles.subgroup_cell}`}>
                  //       Loading...
                  //     </td>
                  //   </tr>
                  // ) :
                  filteredSubGroups.length === 0 ? (
                    <tr>
                      <td colSpan={2} className={`${styles.cell} ${styles.subgroup_cell}`}>
                        Ops, can't find this SubGroup...
                      </td>
                    </tr>
                  ) : (
                    filteredSubGroups.map(element => {
                      return (
                        <tr key={element.id}>
                          <td className={`${styles.cell} ${styles.subgroup_cell}`}>
                            {element.name}
                          </td>
                          <td className={`${styles.cell} ${styles.subgroup_cell}`}>
                            <div className={styles.action_wrapper}>
                              <button
                                className={`${styles.button} ${styles.button__edit}`}
                                onClick={() => {
                                  setIsOpen(!isOpen);
                                  setSelectedId(element.id);
                                }}>
                                Edit
                              </button>
                              <button
                                className={`${styles.button} ${styles.button__delete}`}
                                onClick={() => handleDelete(element.id, element.name)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )
                }
              </tbody>
            </table>
          </>
        ) : (
          <>
            <div className={styles.date_selector}>
              <button onClick={() => handleDateChange(-1)}>{'<<'}</button>
              <span>{formatDate(currentDate)}</span>
              <button onClick={() => handleDateChange(1)}>{'>>'}</button>
            </div>
            <table className={styles.calendar__available} key={Math.random() * 100 - 1}>
              <tr className={styles.tableHeader}>
                <th className={`${styles.columns} ${styles.sticky} ${styles.cell}`}>Time</th>
                <th className={`${styles.columns} ${styles.sticky} ${styles.cell}`}>Subgroups</th>
              </tr>
              {scheduleTable.map(({time, names}) => (
                <tr key={time}>
                  <td className={`${styles.cell} ${styles.available_cell}`}>{time}</td>
                  <td className={`${styles.cell} ${styles.available_cell}`}>{names.join(', ')}</td>
                </tr>
              ))}
            </table>
          </>
        )}

        <ChangeSubGroup
          isOpen={isOpen}
          handleClose={() => setIsOpen(!isOpen)}
          setRender={setRender}
          id={selectedId}></ChangeSubGroup>
      </div>
    </div>
  );
}
