import React, {useState, useEffect} from 'react';
import {format, addDays, startOfWeek, addMinutes} from 'date-fns';
import styles from '../../styles/teacher.module.scss';
import {uk} from 'date-fns/locale';
import {
  getSlotsForUser,
  createSlotForUser,
  deleteSlotForUser,
  updateSlot
} from '../../helpers/teacher/slots';
import {getAppointmentTypes} from '../../helpers/teacher/appointment-type';
import {useDispatch, useSelector} from 'react-redux';
import LoginBox from '../../components/LoginBox/LoginBox';
import {addNewSlot, cleanOccupiedSlots, setOccupiedSlots} from '../../redux/action/teacher.action';
import {
  DeleteSlotFromWeek,
  addNewSlotToWeek,
  setWeekScheduler,
  updateSlotForWeek
} from '../../redux/action/weekScheduler.action';
import SlotDetails from '../../components/modals/SlotDetails/SlotDetails';

export default function TeacherPage() {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth.user.id);
  const userName = useSelector(state => state.auth.user.name);
  const loggedUser = useSelector(state => state.auth);
  const initialStartDate = startOfWeek(new Date(), {weekStartsOn: 1});
  const weekSchedule = useSelector(state => state.weekScheduler.weekScheduler);
  const startingHour = 9;
  initialStartDate.setHours(startingHour, 0, 0, 0);

  const [startDates, setStartDates] = useState(
    Array.from({length: 7}, (_, i) => addDays(initialStartDate, i))
  );
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [selectedAppointmentTypeId, setSelectedAppointmentTypeId] = useState(null);
  const [selectedAppointmentTypeName, setSelectedAppointmentTypeName] = useState('');
  const [selectedSlotDetailsId, setSelectedSlotDetailsId] = useState(0);
  const [openSlotDetails, setOpenSlotDetails] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchAppointmentTypesAndSlots = async () => {
      try {
        const response = await getAppointmentTypes();
        const slots = await getSlotsForUser({
          userId,
          startDate: format(startDates[0], 'yyyy-MM-dd'),
          endDate: format(startDates[6], 'yyyy-MM-dd')
        });

        setAppointmentTypes(
          response.data.sort((a, b) => {
            const order = ['group', 'private', 'replacement', 'free'];
            return order.indexOf(a.name) - order.indexOf(b.name);
          })
        );

        const updatedWeekSchedule = Array.from({length: 7}, () => []);
        slots.data.forEach(slot => {
          updatedWeekSchedule[slot.weekDay].push(slot);
        });

        // for (let dayIndex = 0; dayIndex <= 6; dayIndex++) {
        //   const slotsForDay = updatedWeekSchedule[dayIndex];

        //   slotsForDay.forEach(el => {
        //     if (el.rowSpan === undefined) {
        //       let rowSpan = 1;
        //       const cursorTime = new Date(`1970 ${el.time}`);
        //       let checkForNext = true;
        //       while (checkForNext) {
        //         const nextSlot = slotsForDay.filter(
        //           // eslint-disable-next-line no-loop-func
        //           element =>
        //             element[rowSpan] === undefined &&
        //             element.time === format(addMinutes(cursorTime, 30 * rowSpan), 'HH:mm')
        //         );
        //         if (nextSlot.length > 0) {
        //           nextSlot[0].rowSpan = 0;
        //           rowSpan++;
        //         } else checkForNext = false;
        //       }
        //       el.rowSpan = rowSpan;
        //     }
        //   });
        // }

        dispatch(setWeekScheduler(updatedWeekSchedule));
        if (appointmentTypes && appointmentTypes.length > 0) {
          setSelectedAppointmentTypeId(appointmentTypes[0].id || null);
          setSelectedAppointmentTypeName(appointmentTypes[0].name);
        }

        // dispatch(setOccupiedSlots(slots.data));
      } catch (error) {
        console.error('Error fetching appointment types:', error);
      }
    };

    dispatch(cleanOccupiedSlots());
    fetchAppointmentTypesAndSlots();
  }, [dispatch, startDates, userId]);

  const handleCellClick = async (isSlotOccupied, date, timeSlot, weekDay) => {
    if (
      (isSlotOccupied && isSlotOccupied.SubGroupId) ||
      selectedAppointmentTypeName.startsWith('appointed')
    )
      return;
    if (isSlotOccupied && selectedAppointmentTypeName === 'free') {
      // type free - delete slot
      const weekStart = format(startDates[0], 'yyyy-MM-dd');
      const weekEnd = format(startDates[6], 'yyyy-MM-dd');
      if (isSlotOccupied.startDate >= weekStart && isSlotOccupied.startDate <= weekEnd) {
        await deleteSlotForUser(userId, isSlotOccupied.id);
        dispatch(DeleteSlotFromWeek(isSlotOccupied.id));
      } else {
        // set slot endDate to date - 7 days
        const res = await updateSlot(userId, isSlotOccupied.id, {endDate: addDays(date, -7)});
        if (res.data) dispatch(DeleteSlotFromWeek(isSlotOccupied.id));
      }
    } else if (
      isSlotOccupied &&
      selectedAppointmentTypeName !== 'free' &&
      isSlotOccupied.appointmentTypeId !== selectedAppointmentTypeId
    ) {
      const res = await updateSlot(userId, isSlotOccupied.id, {
        appointmentTypeId: selectedAppointmentTypeId
      });
      if (res.data) dispatch(updateSlotForWeek(res.data));
    } else if (!isSlotOccupied && selectedAppointmentTypeId !== 3) {
      // Free slots cant be placed
      const prevWeekStart = format(addDays(date, -weekDay - 7), 'yyyy-MM-dd');
      const prevWeekEnd = format(addDays(date, -weekDay - 1), 'yyyy-MM-dd');
      const res = await createSlotForUser({
        userId,
        appointmentTypeId: selectedAppointmentTypeId,
        weekDay,
        startDate: format(date, 'yyyy-MM-dd'),
        time: format(timeSlot, 'HH:mm'),
        prevWeekStart,
        prevWeekEnd
      });
      // check if message is 'updated' -> reload table
      if (res.status === 'success') {
        dispatch(addNewSlotToWeek(res.data));
        dispatch(addNewSlot(res.data));
      }
    }
  };

  const handlePrevWeek = () => {
    setStartDates(startDates.map(startDate => addDays(startDate, -7)));
  };

  const handleNextWeek = () => {
    setStartDates(startDates.map(startDate => addDays(startDate, 7)));
  };
  const translateAppointmentTypeName = name => {
    switch (name) {
      case 'universal':
        return 'Універсальний';
      case 'appointed_group':
        return 'Запланована група';
      case 'appointed_private':
        return 'Запланований індив';
      case 'group':
        return 'Група';
      case 'private':
        return 'Індивід';
      case 'replacement':
        return 'Заміна';
      case 'free':
        return 'Вільно';
      default:
        return name;
    }
  };
  const appointedTable = {};

  return (
    <div>
      <LoginBox loggedUser={loggedUser} />
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

      <div className={styles.buttons_header}>
        {appointmentTypes.map(appointmentType => (
          <button
            key={appointmentType.id}
            onClick={() => {
              setSelectedAppointmentTypeId(appointmentType.id);
              setSelectedAppointmentTypeName(appointmentType.name);
            }}
            className={`${styles.type_selector} ${
              styles[`type_selector__${appointmentType.name}`]
            }`}>
            {translateAppointmentTypeName(appointmentType.name)}
          </button>
        ))}
        <div className={styles.teacherInfo}>Викладач: {userName}</div>
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
                  <tr
                    key={timeIndex}
                    onClick={() => {
                      setSelectedRow(timeIndex);
                    }}>
                    {startDates.map((date, dateIndex) => {
                      const daySlots = weekSchedule[dateIndex];
                      const slot = (daySlots || []).find(
                        slot => slot.time === format(currentTime, 'HH:mm')
                      );

                      let key = '';
                      if (
                        slot &&
                        slot.SubGroupId &&
                        slot.AppointmentType.name.startsWith('appointed')
                      ) {
                        key = `1${slot.SubGroupId}${slot.weekDay}`; // 1 is for case of both 0
                        if (appointedTable[key]) {
                          appointedTable[key].display = false;
                          return <></>;
                        } else
                          appointedTable[key] = {
                            display: true,
                            rowLength: slot.AppointmentType.name.includes('group') ? 3 : 2,
                            id: key
                          };
                      }
                      // if (slot && slot.rowSpan === 0) return <></>;

                      return (
                        <td
                          key={dateIndex}
                          rowspan={
                            appointedTable[key] && appointedTable[key].display
                              ? appointedTable[key].rowLength
                              : // slot
                                // ? slot.rowSpan
                                // :
                                1
                          }>
                          {
                            <input
                              type="button"
                              style={
                                appointedTable[key]
                                  ? {
                                      height: `${
                                        35 * appointedTable[key].rowLength +
                                        (appointedTable[key].rowLength === 3 ? 3 : 2) *
                                          appointedTable[key].rowLength
                                      }px`
                                    }
                                  : // slot && slot.rowSpan !== undefined
                                    // ? {
                                    //     height: `${35 * slot.rowSpan + 3 * slot.rowSpan}px`
                                    //   }
                                    // :
                                    {}
                              }
                              className={`${styles.cell} ${
                                // key can be generated only for appointed
                                !key ? styles[`hover__${selectedAppointmentTypeName}`] : ''
                              }  ${
                                slot && slot.AppointmentType
                                  ? styles[`type_selector__${slot.AppointmentType.name}`]
                                  : ''
                              } `}
                              onClick={() => {
                                if (slot && slot.AppointmentType.name.startsWith('appointed')) {
                                  setOpenSlotDetails(!openSlotDetails);
                                  setSelectedSlotDetailsId(slot.SubGroupId);
                                  setAppointmentDetails(slot.AppointmentType.name);
                                  return;
                                } else handleCellClick(slot, date, currentTime, dateIndex);
                              }}
                              value={
                                appointedTable[key]
                                  ? `${format(currentTime, 'HH:mm')} - ${format(
                                      addMinutes(currentTime, 30 * appointedTable[key].rowLength),
                                      'HH:mm'
                                    )} `
                                  : format(currentTime, 'HH:mm')
                              }
                            />
                          }
                        </td>
                      );
                    })}
                  </tr>
                );
            })}
          </tbody>
        </table>
      </div>
      <SlotDetails
        isOpen={openSlotDetails}
        handleClose={() => setOpenSlotDetails(!openSlotDetails)}
        slotId={selectedSlotDetailsId}
        appointmentDetails={appointmentDetails}
      />
    </div>
  );
}
