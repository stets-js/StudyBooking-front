import Modal from '../../Modal/Modal';
import React, {useEffect, useState} from 'react';
import FormInput from '../../FormInput/FormInput';
import Form from '../../Form/Form';
import styles from './NewMySubgroup.module.scss';
import {createSubgroupMentor, updateSubGroup} from '../../../helpers/subgroup/subgroup';
import {bulkLessonCreate} from '../../../helpers/lessons/lesson';

const NewMySubgroup = ({isOpen, handleClose, slots, info}) => {
  const [schedule, setSchedule] = useState('');
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const calculateSchedule = () => {
    let tmpSchedule = '';
    slots.forEach(slot => {
      if (slot.rowSpan)
        tmpSchedule += `${weekDays[slot.weekDay]}: ${slot.time} - ${slot.timeEnd}\n`;
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
                await slots
                  .filter(slot => slot.rowSpan !== 0)
                  .forEach(slot => bulkLessonCreate(slot));
                // bulkSlotCreate(slots);
                await createSubgroupMentor({
                  subgroupId: info.subGroup.value,
                  mentorId: info.mentorId,
                  TeacherTypeId: info.teacherType,
                  schedule
                });
                await updateSubGroup({
                  id: info.subGroup.value,
                  body: {startDate: info.startDate, endDate: info.endDate}
                });
              }
            }}
            slots={JSON.stringify(slots)}
            status={{
              successMessage: 'Successfully created subgroup',
              failMessage: 'Failed to create subgroup'
            }}
            title="New subgroup">
            <FormInput
              title="Name:"
              type="text"
              name="name"
              max={50}
              value={info.subGroup.label}
              placeholder="Name"
              isRequired={true}
              disabled={1}
            />{' '}
            <div className={styles.input__block}>
              <FormInput
                title="Course:"
                type="text"
                name="course"
                max={50}
                value={info.selectedCourse.label}
                placeholder="Course"
                isRequired={true}
                disabled={1}
              />{' '}
              <FormInput
                title="Type:"
                type="text"
                name="type"
                max={50}
                value={info.teacherType === 2 ? 'Tech' : 'Soft'}
                placeholder="Type"
                isRequired={true}
                disabled={1}
              />{' '}
            </div>{' '}
            <FormInput
              title="Schedule:"
              type="text"
              name="schedule"
              max={50}
              value={schedule}
              placeholder="Name"
              isRequired={true}
              textArea={1}
              disabled={1}
            />{' '}
            <div className={styles.input__block}>
              <FormInput
                classname="input__bottom"
                title="Start:"
                type="date"
                name="startDate"
                value={info.startDate}
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
