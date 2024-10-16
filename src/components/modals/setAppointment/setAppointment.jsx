import Modal from '../../Modal/Modal';
import FormInput from '../../FormInput/FormInput';
import React, {useEffect, useState} from 'react';
import styles from './setAppointment.module.scss';
import selectorStyles from '../../../styles/selector.module.scss';
import Select from 'react-select';

import Form from '../../Form/Form';
import {getUsers} from '../../../helpers/user/user';
import {addMinutes, format} from 'date-fns';
import {getSubGroups} from '../../../helpers/subgroup/subgroup';
import {useLocation, useParams} from 'react-router-dom';
import classNames from 'classnames';
import {useTranslation} from 'react-i18next';
const SetAppointment = ({
  lessonId,
  setSubGroup,
  subGroup,
  MIC_flag,
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
  const {t} = useTranslation('global');

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
    setSubGroup({value: null, label: null});
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
        `users=${JSON.stringify(teachersIds)}&role=teacher&sortBySubgroups=true`
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
            selectedSlots[i].forEach(slot => {
              if (slot.schedule) {
                const slotSchedule = slot.schedule;
                day += `${t(`daysOfWeek.${weekNames[slotSchedule.weekDayOrigin].toLowerCase()}`)}${
                  slotSchedule.weekDayOrigin !== slotSchedule.weekDayEnd
                    ? ' - ' + t(`daysOfWeek.${weekNames[slotSchedule.weekDayEnd].toLowerCase()}`)
                    : ''
                }: ${slotSchedule.start} - ${slotSchedule.end}\n`;
              }
            });
            // for (let j = 0; j < selectedSlots[i].length; j += appointmentLength) {
            //   // loop for case of several appointments on one day
            //   day += `${weekNames[i]}: `;
            //   const startTime = selectedSlots[i][j].time;
            //   const [hours, minutes] = selectedSlots[i][j + appointmentLength - 1].time.split(':');
            //   const endTime = addMinutes(new Date(1970, 0, 1, hours, minutes), 30);
            //   day += startTime + ' - ' + format(endTime, 'HH:mm');
            //   if (selectedSlots[i].length > j + appointmentLength + 1) day += '\n'; // addes new lines except last time range of the day
            // }
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
  useEffect(() => {
    if (subGroups.length > 0 && !subGroup?.label && subGroup?.value) {
      // case when replacing (there is info about group id only, so need to set label)
      setSubGroup(subGroups.find(sub => sub.value === subGroup.value));
    }
  }, [subGroup, subGroups]);
  const location = useLocation();

  const fetchQueryData = () => {
    const {lesson} = location.state || {};
    setLink(lesson?.link || '');
    console.log(lesson, 'ssss');
  };
  useEffect(() => {
    if (isOpen) fetchQueryData();
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={close}>
          <Form
            lessonId={lessonId}
            token={token}
            link={link}
            // case when MIC creating subgroup, in subGroup stores STRING, not object
            subgroupId={typeof subGroup === 'object' ? subGroup.value : subGroup}
            subgroupName={typeof subGroup === 'object' ? subGroup.label : subGroup}
            description={description}
            startDate={startDate}
            endDate={endDate}
            mentorId={selectedTeacher}
            adminId={selectedAdmin}
            selectedCourse={course.value}
            selectedCourseName={course.label}
            slots={JSON.stringify(selectedSlots)}
            type={{type: 'appointment'}}
            appointmentType={appointmentType}
            MIC_flag={MIC_flag}
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
              successMessage: `${t('admin.appointment.sucess')}${
                isReplacement
                  ? 'replacement'
                  : appointmentType === 1
                  ? 'group'
                  : appointmentType === 2
                  ? 'private'
                  : 'junior group'
              }`,
              failMessage: `${t('admin.appointment.err.failToCreate')}${
                appointmentType === 1 ? 'group' : appointmentType === 8 ? 'private' : 'junior group'
              }`
            }}>
            <label htmlFor="teacher" className={styles.input__label}>
              {t('modals.setApp.men')}
            </label>
            <Select
              name="teacher"
              className={classNames(selectorStyles.selector, selectorStyles.selector__fullwidth)}
              value={teachers.filter(el => el.value === selectedTeacher)}
              options={teachers}
              required
              key={Math.random() * 100 - 10}
              placeholder={t('modals.setApp.plachold1')}
              onChange={el => setSelectedTeacher(el.value)}
            />
            <label htmlFor="teacher" className={styles.input__label}>
              {t('modals.setApp.App')}
            </label>
            <Select
              name="appointer"
              className={classNames(selectorStyles.selector, selectorStyles.selector__fullwidth)}
              value={admins.filter(el => el.value === selectedAdmin)}
              options={admins}
              required
              key={Math.random() * 100 - 10}
              placeholder={t('modals.setApp.plachold2')}
              onChange={el => setSelectedAdmin(el.value)}
            />
            <FormInput
              title={t('modals.setApp.course') + ':'}
              type="text"
              name="course"
              value={course?.label}
              placeholder={t('modals.setApp.course')}
              disabled={true}
            />
            {!isReplacement && isOpen ? (
              <>
                <FormInput
                  title={t('modals.setApp.link')}
                  type="text"
                  name="link"
                  value={link}
                  placeholder={t('modals.setApp.plachold3')}
                  handler={setLink}
                />
                <div className={styles.input__block}>
                  <FormInput
                    classname="input__bottom"
                    title={t('modals.setApp.st')}
                    type="date"
                    name="startDate"
                    value={startDate}
                    isRequired={true}
                    disabled={true}
                  />
                  <FormInput
                    classname="input__bottom"
                    title={t('modals.setApp.end')}
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
                  title={t('modals.setApp.schedule')}
                  type="text"
                  name="schedule"
                  value={schedule.join('\n')}
                  disabled={true}
                  textArea={true}
                  appointmentLength={schedule.length}
                />
                {!MIC_flag ? (
                  <>
                    <label htmlFor="subGroupSelector" className={styles.input__label}>
                      {t('modals.setApp.subgroup')}
                    </label>
                    <Select
                      name="subGroupSelector"
                      className={styles.selector}
                      value={
                        subGroups &&
                        subGroups.length > 0 &&
                        subGroup?.value &&
                        subGroups.find(sub => sub.value === subGroup.value)
                      }
                      options={subGroups}
                      required
                      placeholder={t('modals.setApp.plachold4')}
                      onChange={el => setSubGroup(el)}
                    />
                  </>
                ) : (
                  <>
                    <FormInput
                      classname="input__bottom"
                      title={t('modals.setApp.newSub')}
                      type="text"
                      name="subgroup"
                      placeholder="Name - GoIteens_UA_Individual_Training_Course"
                      handler={setSubGroup}
                    />
                  </>
                )}
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
                  value={subGroup}
                  options={subGroups}
                  key={Math.random() * 100 - 10}
                  required
                  placeholder="Select subgroup"
                  onChange={el => setSubGroup(el)}
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
