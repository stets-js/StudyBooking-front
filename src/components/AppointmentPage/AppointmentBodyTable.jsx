import React, {useState} from 'react';
import {format, addMinutes} from 'date-fns';
import {useSelector, useDispatch} from 'react-redux';
import Switch from 'react-switch';
import styles from '../../styles/teacher.module.scss';
import tableStyles from '../../styles/table.module.scss';
import {HandleCellClick} from './HandleCellClick';
import classNames from 'classnames';

export default function AppointmentBodyTable({
  selectedClassType,
  selectedSlotsAmount,
  setLessonAmount,
  slotsData,
  setSelectedSlotsAmount,
  setTeachersIds,
  excludeId,
  startDate,
  endDate
}) {
  const selectedSlots = useSelector(state => state.selectedSlots);
  const [startingHour, setStartingHour] = useState(9);
  const [slotsSettings, setSlotsSettings] = useState({height: 58, amount: 26});
  const dispatch = useDispatch();
  const [calendarType, setCalendarType] = useState(false);

  return (
    <>
      {' '}
      <label>
        <span>9-22</span>
        <Switch
          uncheckedIcon={false}
          checkedIcon={false}
          onChange={() => {
            setCalendarType(!calendarType);
            setStartingHour(!calendarType ? 0 : 9);
            setSlotsSettings(!calendarType ? {height: 40, amount: 48} : {height: 58, amount: 26});
            // handleCalendarChange(!calendarType);
          }}
          checked={calendarType}
        />
        <span>00-24</span>
      </label>
      <div className={styles.scroller}>
        <div className={`${tableStyles.calendar} ${tableStyles.scroller}`}>
          <table className={tableStyles.tableBody}>
            <tbody>
              {Array.from({length: slotsSettings.amount}, (_, timeIndex) => {
                const currentTime = addMinutes(
                  new Date(1970, 0, 1, startingHour, 0),
                  timeIndex * 30
                );
                if (currentTime.getHours() >= startingHour)
                  return (
                    <tr key={timeIndex}>
                      {Array.from({length: 7}, (_, dateIndex) => {
                        const weekDay = dateIndex;
                        const timeStr = format(currentTime, 'HH:mm');
                        if (selectedClassType === null)
                          return (
                            <td key={`${dateIndex}${currentTime}`}>
                              <button
                                className={classNames(
                                  tableStyles.cell,
                                  tableStyles.black_borders,
                                  timeIndex === 0 ||
                                    timeIndex === slotsSettings.amount - 1 ||
                                    dateIndex === 0 ||
                                    dateIndex === 6
                                    ? tableStyles.cell__outer
                                    : tableStyles.cell__inner
                                )}
                                disabled={1}>
                                <span>{timeStr} (0)</span>
                              </button>
                            </td>
                          );
                        const numPeople = slotsData[weekDay]?.[timeStr]?.length || 0;
                        const element = selectedSlots.selectedSlots[weekDay]?.find(
                          el => el.time === timeStr
                        );
                        if (element) {
                          if (element.rowSpan <= 0) {
                            return <></>;
                          }
                        }
                        return (
                          <td
                            key={`${dateIndex}${currentTime}`}
                            rowSpan={element ? element?.rowSpan : 1}>
                            <button
                              style={
                                element
                                  ? {
                                      height: `${slotsSettings.height * element.rowSpan}px`
                                    }
                                  : {}
                              }
                              className={classNames(
                                element ? styles.selectedCell : '',
                                startingHour === 0 ? tableStyles.cell__small : '',
                                tableStyles.cell,
                                tableStyles.black_borders,
                                timeIndex === 0 ||
                                  timeIndex === slotsSettings.amount - 1 ||
                                  dateIndex === 0 ||
                                  dateIndex === 6
                                  ? tableStyles.cell__outer
                                  : tableStyles.cell__inner
                              )}
                              disabled={!(numPeople > 0)}
                              onClick={() =>
                                HandleCellClick({
                                  weekDay,
                                  timeStr,
                                  numSlotsToCheck: selectedClassType === 1 ? 3 : 2, // 0 - group, 1 and 2 is indiv + jun_group that is altho 2 slots
                                  setSelectedSlotsAmount,
                                  selectedSlotsAmount,
                                  setTeachersIds,
                                  excludeId,
                                  selectedSlots,
                                  setLessonAmount,
                                  dispatch,
                                  slotsData,
                                  startDate,
                                  endDate
                                })
                              }>
                              <span>
                                {element ? (
                                  <>
                                    {timeStr}
                                    <br />-<br />
                                    {format(
                                      addMinutes(currentTime, 30 * element.rowSpan),
                                      'HH:mm'
                                    )}{' '}
                                    ({numPeople})
                                  </>
                                ) : (
                                  `${timeStr} (${numPeople})`
                                )}
                              </span>
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                return <></>;
              })}
            </tbody>
          </table>{' '}
        </div>
      </div>
    </>
  );
}
