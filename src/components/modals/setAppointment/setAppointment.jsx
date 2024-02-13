import Modal from '../../Modal/Modal';
import FormInput from '../../FormInput/FormInput';
import React, {useEffect, useState} from 'react';
import styles from './setAppointment.module.scss';

import Form from '../../Form/Form';
const SetAppointment = ({
  isOpen,
  handleClose,
  selectedSlots,
  teachersIds,
  course,
  appointmentType
}) => {
  const [link, setLink] = useState('');
  const weekNames = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд'];
  const [schedule, setSchedule] = useState([]);
  const appointmentLength = !appointmentType ? 3 : 2;
  console.log(teachersIds);
  useEffect(() => {
    try {
      if (isOpen) {
        for (let i = 0; i < 6; i++) {
          let day = '';
          if (selectedSlots[i].length > 0) {
            day += `${weekNames[i]}: `;
            // for (let j = 0; j < selectedSlots[i].length; j++) {
            day += selectedSlots[i][0] + ' - ' + selectedSlots[i][appointmentLength - 1];
            // }
            schedule.push(day);
          }
        }
      }
    } catch (error) {}
  }, [isOpen]);

  const close = () => {
    setSchedule([]);
    handleClose();
  };

  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={close}>
          <Form
            type={{type: 'appointment'}}
            isSetAppointment={true}
            // requests={}
            onSubmit={() => {
              handleClose();
            }}
            status={{
              successMessage: 'Successfully created user',
              failMessage: 'Failed to create user'
            }}>
            <FormInput
              title="Курс:"
              type="text"
              name="course"
              value={course.label}
              placeholder="Course"
              disabled={true}
            />
            <FormInput
              title="Посилання на CRM/LMS:"
              type="text"
              name="link"
              placeholder="link"
              isRequired={true}
              handler={setLink}
            />
            <div className={styles.input__block}>
              <FormInput
                classname="input__bottom"
                title="Графік:"
                type="text"
                name="schedule"
                value={schedule.join('\n')}
                disabled={true}
                textArea={true}
              />
              <FormInput
                classname="input__bottom"
                title="Password:"
                type="password"
                name="password"
                max={50}
                handler={setLink}
              />
            </div>
            <p>{teachersIds.join(' ')}</p>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default SetAppointment;
