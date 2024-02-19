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

  useEffect(() => {
    const fetchAppointmentTypesAndSlots = async () => {
      try {
        const response = await getAppointmentTypes();
        const slots = await getSlotsForUser(userId);

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
        dispatch(setWeekScheduler(updatedWeekSchedule));
        if (appointmentTypes && appointmentTypes.length > 0) {
          setSelectedAppointmentTypeId(appointmentTypes[0].id || null);
          setSelectedAppointmentTypeName(appointmentTypes[0].name);
        }

        dispatch(setOccupiedSlots(slots.data));
      } catch (error) {
        console.error('Error fetching appointment types:', error);
      }
    };

    dispatch(cleanOccupiedSlots());
    fetchAppointmentTypesAndSlots();
  }, [dispatch]);

  const handleCellClick = async (isSlotOccupied, date, timeSlot, weekDay) => {
    if (
      (isSlotOccupied && isSlotOccupied.SubGroupId) ||
      selectedAppointmentTypeName.startsWith('appointed')
    )
      return;

    if (isSlotOccupied && selectedAppointmentTypeName === 'free') {
      // type free - delete slot
      const slotId = isSlotOccupied.id;
      await deleteSlotForUser(userId, slotId);
      dispatch(DeleteSlotFromWeek(slotId));
    } else if (
      isSlotOccupied &&
      selectedAppointmentTypeName !== 'free' &&
      isSlotOccupied.appointmentTypeId !== selectedAppointmentTypeId
    ) {
      console.log(isSlotOccupied.id, selectedAppointmentTypeId);
      const res = await updateSlot(userId, isSlotOccupied.id, selectedAppointmentTypeId);
      if (res.data) dispatch(updateSlotForWeek(res.data));
    } else if (!isSlotOccupied && selectedAppointmentTypeId !== 3) {
      // Free slots cant be placed
      const res = await createSlotForUser(
        userId,
        timeSlot,
        selectedAppointmentTypeId,
        weekDay,
        format(timeSlot, 'HH:mm')
      );

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
                  <tr key={timeIndex}>
                    {startDates.map((date, dateIndex) => {
                      const daySlots = weekSchedule[dateIndex];
                      const slot = (daySlots || []).find(
                        slot => slot.time === format(currentTime, 'HH:mm')
                      );
                      const isSlotOccupied = weekSchedule[dateIndex].find(
                        el => el.time === format(currentTime, 'HH:mm')
                      );
                      let key = '';
                      if (
                        isSlotOccupied &&
                        isSlotOccupied.SubGroupId &&
                        isSlotOccupied.AppointmentType.name.startsWith('appointed')
                      ) {
                        key = `1${isSlotOccupied.SubGroupId}${isSlotOccupied.weekDay}`; // 1 is for case of both 0
                        if (appointedTable[key]) {
                          appointedTable[key].display = false;
                          return <></>;
                        } else
                          appointedTable[key] = {
                            display: true,
                            rowLength: isSlotOccupied.AppointmentType.name.includes('group')
                              ? 3
                              : 2,
                            id: key
                          };
                      }
                      return (
                        <td
                          key={dateIndex}
                          rowspan={
                            appointedTable[key] && appointedTable[key].display
                              ? appointedTable[key].rowLength
                              : 1
                          }>
                          {
                            <input
                              type="button"
                              style={
                                appointedTable[key]
                                  ? {height: `${35 * appointedTable[key].rowLength + 4}px`}
                                  : {}
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
                                if (
                                  isSlotOccupied &&
                                  isSlotOccupied.AppointmentType.name.startsWith('appointed')
                                ) {
                                  setOpenSlotDetails(!openSlotDetails);
                                  setSelectedSlotDetailsId(slot.SubGroupId);
                                  setAppointmentDetails(slot.AppointmentType.name);
                                  return;
                                } else
                                  handleCellClick(isSlotOccupied, date, currentTime, dateIndex);
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
