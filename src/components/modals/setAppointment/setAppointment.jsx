import Modal from '../../Modal/Modal';
import FormInput from '../../FormInput/FormInput';
import React, {useEffect, useState} from 'react';
import styles from './setAppointment.module.scss';
import Select from 'react-select';

import Form from '../../Form/Form';
import {getUsers} from '../../../helpers/user/user';
import {addMinutes, addMonths, format} from 'date-fns';
import {useSelector} from 'react-redux';
const SetAppointment = ({
  isOpen,
  handleClose,
  selectedSlots,
  teachersIds,
  course,
  appointmentType,
  setSelectedCourse
}) => {
  teachersIds = JSON.parse(teachersIds);
  const [link, setLink] = useState('');
  const [subGroup, setSubGroup] = useState('');
  const [description, setDescription] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [startDate, setStartDate] = useState(format(Date.now(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(
    format(addMonths(Date.now(), !appointmentType ? 6 : 1), 'yyyy-MM-dd')
  );
  const [selectedTeacher, setSelectedTeacher] = useState(teachersIds[0]);
  const weekNames = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд'];
  const [schedule, setSchedule] = useState([]);
  const appointmentLength = !appointmentType ? 3 : 2;
  const fetchTeachers = async () => {
    try {
      const teachersData = await getUsers(`users=${JSON.stringify(teachersIds)}`);

      setTeachers(
        teachersData.data.map(el => {
          return {label: el.name, value: el.id};
        })
      );
      setSelectedTeacher(teachers[0].value);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  useEffect(() => {
    try {
      if (isOpen) {
        if (teachersIds.length > 0) {
          fetchTeachers();
        }

        for (let i = 0; i <= 6; i++) {
          let day = '';
          if (selectedSlots[i].length > 0) {
            console.log(i);
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
  const adminId = useSelector(state => state.auth.user.id) || 0;
  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={close}>
          <Form
            link={link}
            subGroup={subGroup}
            description={description}
            startDate={startDate}
            endDate={endDate}
            userId={selectedTeacher}
            selectedAdmin={adminId}
            selectedCourse={course.value}
            slots={JSON.stringify(selectedSlots)}
            type={{type: 'appointment'}}
            appointmentType={appointmentType}
            isSetAppointment={true}
            // requests={}
            onSubmit={() => {
              handleClose();
              window.location.reload();
            }}
            status={{
              successMessage: `Successfully created ${appointmentType === 0 ? 'group' : 'private'}`,
              failMessage: `Failed to create ${appointmentType === 0 ? 'group' : 'private'}`
            }}>
            <Select
              className={styles.selector}
              defaultValue={teachers[0]}
              options={teachers}
              key={Math.random() * 100 - 10}
              placeholder="Select teacher"
              onChange={el => setSelectedTeacher(el.value)}
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
                appointmentLength={schedule.length}
              />
              <FormInput
                classname="input__bottom"
                title="Підгрупа:"
                type="text"
                name="subgroup"
                handler={setSubGroup}
                isRequired={true}
              />
            </div>
            <div className={styles.input__block}>
              <FormInput
                classname="input__bottom"
                title="Початок:"
                type="date"
                name="schedule"
                handler={setStartDate}
                value={startDate}
                isRequired={true}
              />
              <FormInput
                classname="input__bottom"
                handler={setEndDate}
                title="Кінець:"
                type="date"
                name="schedule"
                // if appointmentType is group +6 month, else +1
                value={endDate}
                isRequired={true}
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
