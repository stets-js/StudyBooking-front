import React, {useState, useEffect} from 'react';
import {format, addDays, startOfWeek, addMinutes} from 'date-fns';
import {useDispatch, useSelector} from 'react-redux';

import tableStyles from '../../styles/table.module.scss';

import {getSlotsForUser} from '../../helpers/teacher/slots';
import {cleanOccupiedSlots} from '../../redux/action/teacher.action';
import {setWeekScheduler} from '../../redux/action/weekScheduler.action';
import SlotDetails from '../../components/modals/SlotDetails/SlotDetails';
import {getUserById} from '../../helpers/user/user';
import ScheduleCell from './components/ScheduleCell';
import WeekChanger from './components/weekChanger';
import {filterAndUpdateSlots} from './scripts/fillterAndUpdateSlots';
import AppointmentList from './components/AppointmentList';

export default function TeacherTable({userId}) {
  const dispatch = useDispatch();
  const [user, setUser] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserById(userId);
      setUser(user.data);
    };
    if (userId) fetchUser();
  }, [userId]);

  const initialStartDate = startOfWeek(new Date(), {weekStartsOn: 1});
  const weekSchedule = useSelector(state => state.weekScheduler.weekScheduler);
  const startingHour = 9;
  initialStartDate.setHours(startingHour, 0, 0, 0);

  const [startDates, setStartDates] = useState(
    Array.from({length: 7}, (_, i) => addDays(initialStartDate, i))
  );
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState({name: '', id: null});
  const [openSlotDetails, setOpenSlotDetails] = useState(false);
  const [selectedSlotDetails, setSelectedSlotDetails] = useState(null);
  useEffect(() => {
    const fetchSlots = async () => {
      dispatch(cleanOccupiedSlots());
      const slots = await getSlotsForUser({
        userId,
        startDate: format(startDates[0], 'yyyy-MM-dd'),
        endDate: format(startDates[6], 'yyyy-MM-dd')
      });

      dispatch(setWeekScheduler(filterAndUpdateSlots(slots)));
    };
    try {
      fetchSlots();
    } catch (error) {
      console.log(error);
    }
  }, [userId, dispatch, startDates]);

  return (
    <div>
      <AppointmentList
        setAppointmentTypes={setAppointmentTypes}
        appointmentTypes={appointmentTypes}
        user={user}
        setSelectedAppointment={setSelectedAppointment}></AppointmentList>

      <WeekChanger
        startDates={startDates}
        setStartDates={setStartDates}
        userName={user.name}></WeekChanger>
      {/* <div className={tableStyles.scroller}> */}
      {/* <div className={tableStyles.calendar}> */}
      <div>
        <table className={`${tableStyles.calendar} ${tableStyles.tableHeader}`}>
          <thead>
            <tr>
              {startDates.map((startDate, dateIndex) => (
                <th key={dateIndex} className={`${tableStyles.columns} ${tableStyles.sticky}`}>
                  <div className={tableStyles.cell__header}>
                    {format(startDate, 'EEEE').charAt(0).toUpperCase() +
                      format(startDate, 'EEEE').slice(1, 3)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
        </table>
        <div className={`${tableStyles.calendar} ${tableStyles.scroller}`}>
          <table className={tableStyles.tableBody}>
            <tbody>
              {Array.from({length: 25}, (_, timeIndex) => {
                const currentTime = addMinutes(new Date(`1970 9:00`), timeIndex * 30);
                if (currentTime.getHours() >= startingHour)
                  return (
                    <tr key={Math.random() * 100 - 1}>
                      {startDates.map((date, dateIndex) => {
                        const slot = (weekSchedule[dateIndex] || []).find(
                          el => el.time === format(currentTime, 'HH:mm')
                        );
                        return (
                          <ScheduleCell
                            key={`${dateIndex}_${currentTime}`}
                            userId={userId}
                            slot={slot}
                            currentTime={currentTime}
                            date={date}
                            dateIndex={dateIndex}
                            startDates={startDates}
                            setOpenSlotDetails={setOpenSlotDetails}
                            setSelectedSlotDetails={setSelectedSlotDetails}
                            selectedAppointment={selectedAppointment}
                            dispatch={dispatch}
                          />
                        );
                      })}
                    </tr>
                  );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <SlotDetails
        isOpen={openSlotDetails}
        handleClose={() => {
          setSelectedSlotDetails(null);
          setOpenSlotDetails(false);
        }}
        slot={selectedSlotDetails}
      />
    </div>
  );
}
