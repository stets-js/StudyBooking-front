import Modal from '../../Modal/Modal';
import FormInput from '../../FormInput/FormInput';
import React, {useEffect, useState} from 'react';
import styles from './setAppointment.module.scss';
import Select from 'react-select';

import Form from '../../Form/Form';
import {getUsers} from '../../../helpers/user/user';
import {addMinutes, format} from 'date-fns';
import {useSelector} from 'react-redux';
import {getSubGroups} from '../../../helpers/subgroup/subgroup';
const SetAppointment = ({
  isOpen,
  handleClose,
  selectedSlots,
  teachersIds,
  course,
  appointmentType,
  startDate,
  endDate,
  isReplacement,
  onSubmit
}) => {
  teachersIds = JSON.parse(teachersIds);
  const [link, setLink] = useState('');
  const [subGroup, setSubGroup] = useState('');
  const [description, setDescription] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(teachersIds[0]);
  const weekNames = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд'];
  const [schedule, setSchedule] = useState([]);
  const [subGroups, setSubGroups] = useState([]);
  const [selectedSubGroup, setSelectedSubGroup] = useState(0);
  const appointmentLength = !appointmentType ? 3 : 2;
  const freeVariables = () => {
    setTeachers([]);
    setDescription('');
    setSchedule([]);
    setSubGroup([]);
    setSelectedSubGroup(0);
  };
  const fetchTeachers = async () => {
    try {
      getUsers(`users=${JSON.stringify(teachersIds)}`).then(teachersData => {
        setTeachers(
          teachersData.data.map(el => {
            return {label: el.name, value: el.id};
          })
        );
        setSelectedTeacher(teachers[0]?.value || teachersIds[0]);
      });
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
            for (let j = 0; j < selectedSlots[i].length; j += appointmentLength) {
              // loop for case of several appointments on one day
              day += `${weekNames[i]}: `;
              const startTime = selectedSlots[i][j].time;
              const endTime = addMinutes(
                new Date(`1970 ${selectedSlots[i][j + appointmentLength - 1].time}`),
                30
              );
              day += startTime + ' - ' + format(endTime, 'HH:mm');
              if (selectedSlots[i].length > j + appointmentLength + 1) day += '\n'; // addes new lines except last time range of the day
            }
            schedule.push(day);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [isOpen]);
  useEffect(() => {
    const fetchSubGroups = async () => {
      try {
        const res = await getSubGroups();
        setSubGroups(
          res.data.map(el => {
            return {label: el.name, value: el.id};
          })
        );
      } catch (error) {}
    };
    if (isReplacement && isOpen) {
      fetchSubGroups();
    }
  }, [isReplacement, isOpen]);
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
            isReplacement={isReplacement}
            selectedSubGroup={selectedSubGroup.value}
            schedule={schedule}
            // requests={}
            onSubmit={() => {
              onSubmit();
              handleClose();
              freeVariables();
              // window.location.reload();
            }}
            status={{
              successMessage: `Successfully created ${
                isReplacement ? 'replacement' : appointmentType === 0 ? 'group' : 'private'
              }`,
              failMessage: `Failed to create ${appointmentType === 0 ? 'group' : 'private'}`
            }}>
            <label htmlFor="teacher" className={styles.input__label}>
              Ментор:
            </label>
            <Select
              name="teacher"
              className={styles.selector}
              value={teachers.filter(el => el.value === selectedTeacher)}
              options={teachers}
              required
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
            {!isReplacement && isOpen ? (
              <>
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
                    title="Початок:"
                    type="date"
                    name="startDate"
                    value={startDate}
                    isRequired={true}
                    disabled={true}
                  />
                  <FormInput
                    classname="input__bottom"
                    title="Кінець:"
                    type="date"
                    name="EndDate"
                    disabled={true}
                    // if appointmentType is group +6 month, else +1
                    value={endDate}
                    isRequired={true}
                  />
                </div>
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
                    title="Потік:"
                    type="text"
                    name="subgroup"
                    handler={setSubGroup}
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
              </>
            ) : (
              <>
                <br />
                <label htmlFor="subGroupSelector" className={styles.input__label}>
                  Потік:
                </label>
                <Select
                  name="subGroupSelector"
                  className={styles.selector}
                  value={selectedSubGroup}
                  options={subGroups}
                  key={Math.random() * 100 - 10}
                  required
                  placeholder="Select subgroup"
                  onChange={el => setSelectedSubGroup(el)}
                />
                <div className={styles.input__block}>
                  <FormInput
                    classname="input__bottom"
                    title="Початок:"
                    type="date"
                    name="schedule"
                    value={startDate}
                    isRequired={true}
                    disabled={true}
                  />
                  <FormInput
                    classname="input__bottom"
                    title="Кінець:"
                    type="date"
                    name="schedule"
                    disabled={true}
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
              </>
            )}
          </Form>
        </Modal>
      )}
    </>
  );
};

export default SetAppointment;
