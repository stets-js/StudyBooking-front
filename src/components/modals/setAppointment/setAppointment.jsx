import Modal from '../../Modal/Modal';
import FormInput from '../../FormInput/FormInput';
import React, {useEffect, useState} from 'react';
import styles from './setAppointment.module.scss';
import Select from 'react-select';

import Form from '../../Form/Form';
import {getUserById, getUsers} from '../../../helpers/user/user';
import {addMinutes, format} from 'date-fns';
const SetAppointment = ({
  isOpen,
  handleClose,
  selectedSlots,
  teachersIds,
  course,
  appointmentType
}) => {
  const [link, setLink] = useState('');
  const [subGroup, setSubGroup] = useState('');
  const [description, setDescription] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [startDate, setStartDate] = useState(Date());
  const [endDate, setEndDate] = useState(Date());
  const weekNames = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд'];

  const [schedule, setSchedule] = useState([]);

  const appointmentLength = !appointmentType ? 3 : 2;
  const fetchTeachers = async () => {
    try {
      console.log(teachersIds);
      const teachersData = await getUsers({users: teachersIds});

      setTeachers(
        teachersData.data.map(el => {
          return {label: el.name, value: el.id};
        })
      );
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  useEffect(() => {
    try {
      if (isOpen) {
        if (teachersIds.length > 0) {
          console.log('hello');
          fetchTeachers();
        }

        for (let i = 0; i < 6; i++) {
          let day = '';
          if (selectedSlots[i].length > 0) {
            day += `${weekNames[i]}: `;
            // for (let j = 0; j < selectedSlots[i].length; j++) {
            const startTime = selectedSlots[i][0];
            const endTime = addMinutes(
              new Date(`1970 ${selectedSlots[i][appointmentLength - 1]}`),
              30
            );
            day += startTime + ' - ' + format(endTime, 'HH:mm');
            // }
            schedule.push(day);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [isOpen]);
  useEffect(() => {});
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
            <Select
              className={styles.selector}
              defaultValue={teachers[0]}
              options={teachers}
              key={Math.random() * 100 - 10}
              placeholder="Select teacher"
            />
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
                title="Підгрупа:"
                type="text"
                name="subgroup"
                max={50}
                handler={setSubGroup}
              />
            </div>
            <div className={styles.input__block}>
              <FormInput
                classname="input__bottom"
                title="Початок:"
                type="date"
                name="schedule"
                handler={setStartDate}
              />
              <FormInput
                classname="input__bottom"
                handler={setEndDate}
                title="Кінець:"
                type="date"
                name="schedule"
              />
            </div>
            <FormInput
              classname="input__bottom"
              title="Повідомлення:"
              type="text"
              name="description"
              textArea={true}
              handler={setDescription}
            />
          </Form>
        </Modal>
      )}
    </>
  );
};

export default SetAppointment;
