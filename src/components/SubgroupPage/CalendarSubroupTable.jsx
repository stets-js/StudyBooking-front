import React, {useEffect, useState} from 'react';
import {addDays, addMinutes, format, getDay} from 'date-fns';

import styles from '../../styles/teacher.module.scss';
import tableStyles from '../../styles/table.module.scss';
import {getSlots} from '../../helpers/teacher/slots';

export default function CalendarSubgroupTable({isOneDay, selectedCourse, fetchData}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWeekDay, setSelectedWeekDay] = useState(
    getDay(currentDate) - 1 < 0 ? 6 : getDay(currentDate) - 1
  );

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
      `type&weekDay=${selectedWeekDay}&startSubGroup=${format(
        currentDate,
        'yyyy-MM-dd'
      )}&endSubGroup=${format(currentDate, 'yyyy-MM-dd')}`
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
    if (isOneDay) fetchSubGroupsByTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOneDay, selectedWeekDay]);

  const handleDateChange = daysToAdd => {
    const newDate = addDays(currentDate, daysToAdd);
    setCurrentDate(newDate);
    // Reset selectedWeekDay to null when changing the date
    setSelectedWeekDay(getDay(newDate) - 1 < 0 ? 6 : getDay(newDate) - 1);
  };
  const formatDate = date => {
    return format(date, 'iiii, dd.MM');
  };
  console.log(currentDate, selectedWeekDay);
  return (
    <>
      <div className={`${styles.date_selector} ${styles.available_nav__item}`}>
        <button onClick={() => handleDateChange(-1)} className={styles.week_selector}>
          {'<'}
        </button>
        <span>{formatDate(currentDate)}</span>
        <button onClick={() => handleDateChange(1)} className={styles.week_selector}>
          {'>'}
        </button>
      </div>
      <div
        className={`${tableStyles.calendar} ${tableStyles.calendar__small} ${tableStyles.scroller}`}>
        <table className={tableStyles.tableBody}>
          <tbody>
            {scheduleTable.map(({time, names}) => (
              <tr key={time}>
                <td className={tableStyles.cell__available}>
                  <div
                    className={`${tableStyles.cell} ${tableStyles.black_borders} ${tableStyles.cell__outer}`}>
                    {time}
                  </div>
                </td>
                <td className={tableStyles.cell__big}>
                  <div
                    className={`${tableStyles.cell} ${tableStyles.black_borders} ${tableStyles.cell__outer} ${tableStyles.cell__outer__big}`}>
                    {names.join(', ')}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
