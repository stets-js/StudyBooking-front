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
import {getLessonsForUser} from '../../helpers/lessons/lesson';
import Banner from './components/Banner';
import InfoButton from '../Buttons/Info';
import ReferalButton from '../Buttons/Referal';
import ReferalModalWindow from '../modals/ReferalModal/ReferalModalWindow';
import classNames from 'classnames';
import {useTranslation} from 'react-i18next';

export default function TeacherTable({userId, isAdmin, MIC_flag}) {
  const dispatch = useDispatch();
  const {t} = useTranslation('global');

  const [user, setUser] = useState('');
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserById(userId);
      setUser(user.data);
    };
    if (userId !== null) fetchUser();
  }, [userId]);
  const initialStartDate = startOfWeek(new Date(), {weekStartsOn: 1});
  const weekSchedule = useSelector(state => state.weekScheduler.weekScheduler);
  const [startingHour, setStartingHour] = useState(9);
  // 26 stays for 13 hours
  const [slotsAmount, setSlotsAmount] = useState(26);
  const [slotHeight, setSlotHeight] = useState(58);
  initialStartDate.setHours(startingHour, 0, 0, 0);

  const [startDates, setStartDates] = useState(
    Array.from({length: 7}, (_, i) => addDays(initialStartDate, i))
  );
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState({name: 'group', id: 1});
  const [openSlotDetails, setOpenSlotDetails] = useState(false);
  const [selectedSlotDetails, setSelectedSlotDetails] = useState(null);

  useEffect(() => {
    initialStartDate.setHours(startingHour, 0, 0, 0);
    setStartDates(Array.from({length: 7}, (_, i) => addDays(initialStartDate, i)));
  }, [startingHour]);

  useEffect(() => {
    const fetchSlots = async () => {
      dispatch(cleanOccupiedSlots());
      const lessons = await getLessonsForUser({
        mentorId: userId,
        startDateLesson: format(startDates[0], 'yyyy-MM-dd'),
        endDateLesson: format(startDates[6], 'yyyy-MM-dd')
      });
      const slots = await getSlotsForUser({
        userId,
        startDate: format(startDates[0], 'yyyy-MM-dd'),
        endDate: format(startDates[6], 'yyyy-MM-dd')
      });
      dispatch(setWeekScheduler(filterAndUpdateSlots(slots, lessons.data, slotsAmount)));
    };
    try {
      fetchSlots();
    } catch (error) {
      console.log(error);
    }
  }, [userId, dispatch, startDates]);
  return (
    <div>
      {!isAdmin && <Banner setUser={setUser} user={user}></Banner>}
      {/* <div className={styles.refferal}>
        <div className={styles.refferal__button}>
          <span>{t('teacher.timetable.refferal.title')}</span>
          <ReferalButton
            text={t('teacher.timetable.refferal.buttonText')}
            onClick={() => {
              setReferalDetails(true);
            }}></ReferalButton>
        </div>
        <img
          className={styles.refferal__img}
          src="https://res.cloudinary.com/dn4cdsmqr/image/upload/v1721037700/Referral_etkc0a.png"
          alt="alt"></img>
      </div>
      {referalDetails && (
        <ReferalModalWindow
          isOpen={referalDetails}
          handleClose={() => setReferalDetails(false)}></ReferalModalWindow>
      )} */}
      <AppointmentList
        setAppointmentTypes={setAppointmentTypes}
        appointmentTypes={appointmentTypes}
        user={user}
        setSelectedAppointment={setSelectedAppointment}></AppointmentList>

      <WeekChanger
        handleCalendarChange={fullDay => {
          setStartingHour(fullDay ? 0 : 9);
          setSlotsAmount(fullDay ? 48 : 26);
          setSlotHeight(fullDay ? 40 : 58);
        }}
        startDates={startDates}
        setStartDates={setStartDates}
        userName={user.name}
      />
      <div>
        <table
          className={classNames(
            tableStyles.calendar,

            tableStyles.tableHeader
          )}>
          <thead>
            <tr>
              {startDates.map((startDate, dateIndex) => (
                <th key={dateIndex} className={`${tableStyles.columns} ${tableStyles.sticky}`}>
                  <div className={tableStyles.cell__header}>
                    {t(`daysOfWeek.${format(startDate, 'EEEE').slice(0, 3).toLowerCase()}`)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
        </table>
        <div className={`${tableStyles.calendar} ${tableStyles.scroller}`}>
          <table className={classNames(tableStyles.tableBody, tableStyles.teacher_calendar)}>
            <tbody>
              {Array.from({length: slotsAmount}, (_, timeIndex) => {
                // 24 - for making 20:30 last cell
                // 26 - for making 21:30
                const currentTime = addMinutes(
                  new Date(1970, 0, 1, startingHour, 0),
                  timeIndex * 30
                );
                if (currentTime.getHours() >= startingHour)
                  return (
                    <tr key={Math.random() * 100 - 1}>
                      {startDates.map((date, dateIndex) => {
                        const slot = (weekSchedule[dateIndex] || []).filter(
                          el => el.time === format(currentTime, 'HH:mm')
                        );
                        return (
                          <ScheduleCell
                            slotsAmount={slotsAmount}
                            slotHeight={slotHeight}
                            MIC_flag={MIC_flag}
                            timeIndex={timeIndex}
                            key={`${dateIndex}_${currentTime}`}
                            user={user}
                            slots={slot}
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
                return <></>;
              })}
            </tbody>
          </table>
        </div>
      </div>
      <SlotDetails
        setSlot={setSelectedSlotDetails}
        userId={userId}
        isOpen={openSlotDetails}
        handleClose={() => {
          setSelectedSlotDetails(null);
          setOpenSlotDetails(false);
        }}
        slots={selectedSlotDetails}
      />
    </div>
  );
}
