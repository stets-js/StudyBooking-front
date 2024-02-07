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
import {
  DeleteSlot,
  addNewSlot,
  cleanOccupiedSlots,
  setOccupiedSlots,
  updateSlotForUser
} from '../../redux/action/teacher.action';

export default function TeacherPage() {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth.user.id);
  const userName = useSelector(state => state.auth.user.name);
  const loggedUser = useSelector(state => state.auth);
  const initialStartDate = startOfWeek(new Date(), {weekStartsOn: 1});
  const startingHour = 8;
  initialStartDate.setHours(startingHour, 0, 0, 0);

  const [selectedGroup, setSelectedGroup] = useState('Група');
  const [startDates, setStartDates] = useState(
    Array.from({length: 7}, (_, i) => addDays(initialStartDate, i))
  );
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [selectedAppointmentTypeId, setSelectedAppointmentTypeId] = useState(null);
  const [selectedAppointmentTypeName, setSelectedAppointmentTypeName] = useState(null);
  const occupiedSlots = useSelector(state => state.teacher.occupiedSlots);

  useEffect(() => {
    const fetchAppointmentTypes = async () => {
      try {
        const response = await getAppointmentTypes();
        const slots = await getSlotsForUser(userId);

        setAppointmentTypes(
          response.data.sort((a, b) => {
            const order = ['group', 'private', 'replacement', 'free'];
            return order.indexOf(a.name) - order.indexOf(b.name);
          })
        );
        // setAppointmentTypes(sortedAppointmentTypes);

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
    fetchAppointmentTypes();
  }, [dispatch]);

  const handleCellClick = async (date, timeSlot) => {
    const isSlotOccupied = occupiedSlots.filter(el => el.data === timeSlot.toISOString())[0];
    if (isSlotOccupied && selectedAppointmentTypeId === 3) {
      // type free - delete slot
      const slotId = isSlotOccupied.id;
      await deleteSlotForUser(userId, slotId);
      dispatch(DeleteSlot(slotId));
    } else if (
      isSlotOccupied &&
      selectedAppointmentTypeId !== 3 &&
      isSlotOccupied.appointmentTypeId !== selectedAppointmentTypeId
    ) {
      const res = await updateSlot(
        userId,
        isSlotOccupied.appointmentTypeId,
        selectedAppointmentTypeId
      );
      console.log(res.data);
      if (res.data) dispatch(updateSlotForUser(res.data));
    } else if (!isSlotOccupied && selectedAppointmentTypeId !== 3) {
      // Free slots cant be placed
      const res = await createSlotForUser(userId, timeSlot, selectedAppointmentTypeId);

      if (res.status === 'success') {
        dispatch(addNewSlot(res.data));
      }
      console.log(`Ви вибрали ${timeSlot}`);
      console.log(`Дата: ${format(date, 'dd.MM.yyyy')}`);
      console.log(`День тижня: ${format(date, 'EEEE')}`);
      console.log(`Вибрана група: ${selectedGroup}`);
      console.log(`Вибраний appointmentTypeId: ${selectedAppointmentTypeId}`);
    }
  };

  const handleGroupChange = group => {
    setSelectedGroup(group);
  };

  const handlePrevWeek = () => {
    setStartDates(startDates.map(startDate => addDays(startDate, -7)));
  };

  const handleNextWeek = () => {
    setStartDates(startDates.map(startDate => addDays(startDate, 7)));
  };
  const translateAppointmentTypeName = name => {
    switch (name) {
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
              handleGroupChange(appointmentType.name);
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
            {Array.from({length: 29}, (_, timeIndex) => (
              <tr key={timeIndex}>
                {startDates.map((date, dateIndex) => (
                  <td key={dateIndex}>
                    {!(
                      addMinutes(date, timeIndex * 30).getHours() === 22 &&
                      addMinutes(date, timeIndex * 30).getMinutes() === 30
                    ) && (
                      <button
                        className={`${styles.cell} ${
                          styles[`hover__${selectedAppointmentTypeName}`]
                        }  ${
                          occupiedSlots.some(
                            el => el.data === addMinutes(date, timeIndex * 30).toISOString()
                          )
                            ? styles[
                                `type_selector__${
                                  occupiedSlots.filter(
                                    el => el.data === addMinutes(date, timeIndex * 30).toISOString()
                                  )[0].AppointmentType.name
                                }`
                              ]
                            : ''
                        } `}
                        onClick={() => handleCellClick(date, addMinutes(date, timeIndex * 30))}>
                        {addMinutes(date, timeIndex * 30).getHours() >= startingHour &&
                          addMinutes(date, timeIndex * 30).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
