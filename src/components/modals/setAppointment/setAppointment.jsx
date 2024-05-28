import Modal from '../../Modal/Modal';
import FormInput from '../../FormInput/FormInput';
import React, {useEffect, useState} from 'react';
import styles from './setAppointment.module.scss';
import Select from 'react-select';

import Form from '../../Form/Form';
import {getUsers} from '../../../helpers/user/user';
import {addMinutes, format} from 'date-fns';
import {getSubGroups} from '../../../helpers/subgroup/subgroup';
import {useParams} from 'react-router-dom';
const SetAppointment = ({
  lessonId,
  setSubGroup,
  subGroup,
  appointmentFlag,
  isOpen,
  handleClose,
  selectedSlots,
  teachersIds,
  course,
  appointmentType,
  startDate,
  endDate,
  isReplacement,
  onSubmit,
  teacherType
}) => {
  const {token} = useParams();
  teachersIds = JSON.parse(teachersIds);
  const [link, setLink] = useState('');

  const [description, setDescription] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(teachersIds[0]);
  const [selectedAdmin, setSelectedAdmin] = useState({});
  const [admins, setAdmins] = useState([]);
  const weekNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [schedule, setSchedule] = useState([]);
  const [subGroups, setSubGroups] = useState([]);
  const appointmentLength = appointmentType === 1 ? 3 : 2; // 0 - is group (3 slots), 1 and 2 is indiv/jun_group (2 slots)
  const freeVariables = () => {
    setTeachers([]);
    setDescription('');
    setSchedule([]);
    setSubGroup(null);
  };
  const fetchAdmins = async () => {
    try {
      const res = await getUsers(`role=administrator`);

      setAdmins(
        res.data.map(el => {
          return {label: el.name, value: el.id};
        })
      );
    } catch (e) {
      console.error('Error fetching teachers:', e);
    }
  };
  const fetchTeachers = async () => {
    try {
      getUsers(
        `users=${JSON.stringify(teachersIds)}&sortBySubgroups=true`
        // &sortBySubgroups=${teacherType === 2 ? 'tech' : 'soft'}
      ).then(teachersData => {
        setTeachers(
          teachersData.data.map(el => {
            return {label: `${el.name} (${el.subgroupCount})`, value: el.id};
          })
        );
        setSelectedTeacher(teachers[0]?.value || teachersIds[0]);
      });
    } catch (e) {
      console.error('Error fetching teachers:', e);
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
      fetchAdmins();
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  useEffect(() => {
    const fetchSubGroups = async () => {
      try {
        const res = await getSubGroups(`CourseId=${course.value}`);
        setSubGroups(
          res.data.map(el => {
            return {label: el.name, value: el.id};
          })
        );
      } catch (error) {}
    };
    if (isOpen) {
      fetchSubGroups();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            lessonId={lessonId}
            token={token}
            link={link}
            subgroupId={subGroup}
            description={description}
            startDate={startDate}
            endDate={endDate}
            mentorId={selectedTeacher}
            adminId={selectedAdmin}
            selectedCourse={course?.value}
            slots={JSON.stringify(selectedSlots)}
            type={{type: appointmentFlag}}
            appointmentType={appointmentType}
            isReplacement={isReplacement}
            schedule={schedule}
            TeacherTypeId={teacherType}
            // requests={}
            onSubmit={() => {
              onSubmit();
              handleClose();
              freeVariables();
              // window.location.reload();
            }}
            status={{
              successMessage: `Successfully created ${
                isReplacement
                  ? 'replacement'
                  : appointmentType === 1
                  ? 'group'
                  : appointmentType === 2
                  ? 'private'
                  : 'junior group'
              }`,
              failMessage: `Failed to create ${
                appointmentType === 1 ? 'group' : appointmentType === 8 ? 'private' : 'junior group'
              }`
            }}>
            <label htmlFor="teacher" className={styles.input__label}>
              Mentor:
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
            <label htmlFor="teacher" className={styles.input__label}>
              Appointer:
            </label>
            <Select
              name="appointer"
              className={styles.selector}
              value={admins.filter(el => el.value === selectedAdmin)}
              options={admins}
              required
              key={Math.random() * 100 - 10}
              placeholder="Select appointer"
              onChange={el => setSelectedAdmin(el.value)}
            />
            <FormInput
              title="Course:"
              type="text"
              name="course"
              value={course?.label}
              placeholder="Course"
              disabled={true}
            />
            {!isReplacement && isOpen ? (
              <>
                <FormInput
                  title="Link to group chat:"
                  type="text"
                  name="link"
                  placeholder="link"
                  isRequired={true}
                  handler={setLink}
                />
                <div className={styles.input__block}>
                  <FormInput
                    classname="input__bottom"
                    title="Start:"
                    type="date"
                    name="startDate"
                    value={startDate}
                    isRequired={true}
                    disabled={true}
                  />
                  <FormInput
                    classname="input__bottom"
                    title="End:"
                    type="date"
                    name="EndDate"
                    disabled={true}
                    // if appointmentType is group +6 month, else +1
                    value={endDate}
                    isRequired={true}
                  />
                </div>

                <FormInput
                  classname="input__bottom"
                  title="Schedule:"
                  type="text"
                  name="schedule"
                  value={schedule.join('\n')}
                  disabled={true}
                  textArea={true}
                  appointmentLength={schedule.length}
                />
                <label htmlFor="subGroupSelector" className={styles.input__label}>
                  Subgroup:
                </label>
                <Select
                  name="subGroupSelector"
                  className={styles.selector}
                  value={subGroups.filter(el => el.value === subGroup)}
                  options={subGroups}
                  key={Math.random() * 100 - 10}
                  required
                  placeholder="Select subgroup"
                  onChange={el => setSubGroup(el.value)}
                />
                {/* <FormInput
                  classname="input__bottom"
                  title="Description:"
                  type="text"
                  name="description"
                  textArea={true}
                  handler={setDescription}
                /> */}
              </>
            ) : (
              <>
                <br />
                <label htmlFor="subGroupSelector" className={styles.input__label}>
                  Subgroup:
                </label>
                <Select
                  name="subGroupSelector"
                  className={styles.selector}
                  value={subGroups.filter(el => el.value === subGroup)}
                  options={subGroups}
                  key={Math.random() * 100 - 10}
                  required
                  placeholder="Select subgroup"
                  onChange={el => setSubGroup(el.value)}
                />
                <div className={styles.input__block}>
                  <FormInput
                    classname="input__bottom"
                    title="Start:"
                    type="date"
                    name="startDate"
                    value={startDate}
                    isRequired={true}
                    disabled={true}
                  />
                  <FormInput
                    classname="input__bottom"
                    title="End:"
                    type="date"
                    name="endDate"
                    disabled={true}
                    value={endDate}
                    isRequired={true}
                  />
                </div>
                <FormInput
                  classname="input__bottom"
                  title={`${isReplacement ? 'Replacement description:' : 'Description:'}`}
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
