import Modal from '../../Modal/Modal';
import FormInput from '../../FormInput/FormInput';
import React, {useEffect, useState} from 'react';
import styles from './slotDetails.module.scss';
import {getSlotDetails} from '../../../helpers/subgroup/subgroup';
import {addMinutes, format} from 'date-fns';
import {getCourseById} from '../../../helpers/course/course';
const SlotDetails = ({isOpen, handleClose, slotId, appointmentDetails}) => {
  const [slot, setSlot] = useState(null);
  const [course, setCourse] = useState(null);
  const weekNames = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд'];
  const [selectedSlots, setSelectedSlots] = useState(Array.from({length: 7}, _ => []));
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSlotDetails(slotId);
      setSlot(data.data);

      if (slot && slot.CourseId) {
      }
    };
    if (slotId) {
      setSchedule([]);
      fetchData();
    }
  }, [slotId]);
  useEffect(() => {
    const fetchCourse = async () => {
      const courseData = await getCourseById(slot.CourseId);
      setCourse(courseData.data);
    };
    if (slot?.CourseId) fetchCourse();
  }, [slot]);
  useEffect(() => {
    const appointmentLength = slot?.Slots[0]?.AppointmentType?.name.includes('group') ? 3 : 2;
    for (let i = 0; i < slot?.Slots.length || 0; i++) {
      const startDate = slot?.Slots[i].time;
      const endTime = addMinutes(new Date(`1970 ${startDate}`), 30 * appointmentLength);

      schedule.push(
        `${weekNames[slot.Slots[i].weekDay]}: ${startDate} - ${format(endTime, 'HH:mm')}`
      );
      i += appointmentLength - 1;
    }
  }, [slot]);
  return (
    <>
      {isOpen && slot && slot.name && (
        <Modal open={isOpen} onClose={handleClose} className={styles.modal_wrapper}>
          <div className={styles.input__block}>
            <a href="data.link">{slot?.name}</a>
            <div className={styles.date_wrapper}>
              <span>Старт: {format(slot.startDate, 'dd.MM.yyyy')}</span>
              <br />
              <span>Кінець: {format(slot.endDate, 'dd.MM.yyyy')}</span>
            </div>
          </div>
          <FormInput
            title="Курс:"
            type="text"
            name="course"
            value={course && course?.name}
            placeholder="Course"
            disabled={true}
          />
          <FormInput
            title="Адміністратор:"
            type="text"
            name="course"
            value={slot?.User?.name}
            placeholder="Administrator"
            disabled={true}
          />
          <FormInput
            classname="input__bottom"
            title="Графік:"
            type="text"
            name="schedule"
            value={schedule.join('\n')}
            disabled={true}
            textArea={true}
            appointmentLength={schedule.length}
          />
          <FormInput
            classname="input__bottom"
            title="Повідомлення:"
            type="text"
            value={slot.description}
            disabled={true}
            textArea={true}
            appointmentLength={schedule.length}
          />
        </Modal>
      )}
    </>
  );
};

export default SlotDetails;
