import Modal from '../../Modal/Modal';
import React, {useEffect, useState} from 'react';
import FormInput from '../../FormInput/FormInput';
import Form from '../../Form/Form';
import styles from './NewMySubgroup.module.scss';
import {createSubgroupMentor, updateSubGroup} from '../../../helpers/subgroup/subgroup';
import {bulkLessonCreate} from '../../../helpers/lessons/lesson';
import {useTranslation} from 'react-i18next';

const NewMySubgroup = ({isOpen, handleClose, slots, setSlots, info}) => {
  const {t} = useTranslation('global');

  const [schedule, setSchedule] = useState('');
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const calculateSchedule = () => {
    let tmpSchedule = '';
    slots.forEach(slot => {
      if (slot.rowSpan && !slot.skip) {
        tmpSchedule += `${t(`daysOfWeek.${weekDays[slot.weekDay].toLowerCase()}`)}: ${
          slot.time[0]
        } - ${slot.timeEnd}\n`;
      }
    });
    setSchedule(tmpSchedule);
  };
  useEffect(() => {
    if (isOpen) calculateSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <Form
            onSubmit={() => {
              handleClose();
            }}
            type={{type: 'post'}}
            requests={{
              post: async () => {
                // bulkSlotCreate(slots);
                const res = await createSubgroupMentor({
                  subgroupId: info.subGroup.value,
                  mentorId: info.mentorId,
                  TeacherTypeId: info.teacherType,
                  schedule
                });
                if (res) {
                  await slots
                    .filter(slot => slot.rowSpan !== 0 && !slot.skip)
                    .forEach(slot => {
                      bulkLessonCreate(slot);
                    });
                  await updateSubGroup({
                    id: info.subGroup.value,
                    body: {startDate: info.startDate, endDate: info.endDate}
                  });
                  setSlots([]);
                }
              }
            }}
            slots={JSON.stringify(slots)}
            status={{
              successMessage: 'Successfully created subgroup',
              failMessage: 'Failed to create subgroup'
            }}
            title={t('modals.newSub.title')}>
            <FormInput
              title={t('modals.newSub.name')}
              type="text"
              name="name"
              max={50}
              value={info.subGroup.label}
              placeholder={t('modals.newSub.name')}
              isRequired={true}
              disabled={1}
            />
            <div className={styles.input__block}>
              <FormInput
                title={t('modals.newSub.course')}
                type="text"
                name="course"
                max={50}
                value={info.selectedCourse.label}
                placeholder={t('modals.newSub.course')}
                isRequired={true}
                disabled={1}
              />{' '}
              <FormInput
                title={t('modals.newSub.type')}
                type="text"
                name="type"
                max={50}
                value={info.teacherType === 2 ? 'Tech' : 'Soft'}
                placeholder={t('modals.newSub.type')}
                isRequired={true}
                disabled={1}
              />{' '}
            </div>{' '}
            <FormInput
              title={t('modals.newSub.schedule')}
              type="text"
              name="schedule"
              max={50}
              value={schedule}
              placeholder={t('modals.newSub.schedule')}
              isRequired={true}
              textArea={1}
              disabled={1}
            />{' '}
            <div className={styles.input__block}>
              <FormInput
                classname="input__bottom"
                title={t('modals.newSub.st')}
                type="date"
                name="startDate"
                value={info.startDate}
                isRequired={true}
                disabled={true}
              />

              <FormInput
                classname="input__bottom"
                title={t('modals.newSub.end')}
                type="date"
                name="EndDate"
                disabled={true}
                // if appointmentType is group +6 month, else +1
                value={info.endDate}
                isRequired={true}
              />
            </div>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default NewMySubgroup;
