import React from 'react';
import {format, addMinutes} from 'date-fns';
import {useSelector, useDispatch} from 'react-redux';

import styles from '../../styles/teacher.module.scss';
import tableStyles from '../../styles/table.module.scss';
import {HandleCellClick} from './HandleCellClick';

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
  const startingHour = 9;
  const dispatch = useDispatch();
  return (
    <table className={tableStyles.tableBody}>
      <tbody>
        {Array.from({length: 26}, (_, timeIndex) => {
          const currentTime = addMinutes(new Date(1970, 0, 1, 9, 0), timeIndex * 30);
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
                          className={`${tableStyles.cell} ${tableStyles.black_borders} ${
                            timeIndex === 0 ||
                            timeIndex === 25 ||
                            dateIndex === 0 ||
                            dateIndex === 6
                              ? tableStyles.cell__outer
                              : tableStyles.cell__inner
                          }`}
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
                    <td key={`${dateIndex}${currentTime}`} rowSpan={element ? element?.rowSpan : 1}>
                      <button
                        style={
                          element
                            ? {
                                height: `${58 * element.rowSpan}px`
                              }
                            : {}
                        }
                        className={`${element ? styles.selectedCell : ''}
                        ${tableStyles.cell} 
                        ${tableStyles.black_borders} ${
                          timeIndex === 0 || timeIndex === 23 || dateIndex === 0 || dateIndex === 6
                            ? tableStyles.cell__outer
                            : tableStyles.cell__inner
                        }`}
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
                              {format(addMinutes(currentTime, 30 * element.rowSpan), 'HH:mm')} (
                              {numPeople})
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
    </table>
  );
}
