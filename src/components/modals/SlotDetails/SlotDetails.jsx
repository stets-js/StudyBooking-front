import Modal from '../../Modal/Modal';
import FormInput from '../../FormInput/FormInput';
import React from 'react';
import styles from './slotDetails.module.scss';
import {format} from 'date-fns';
const SlotDetails = ({isOpen, handleClose, slot}) => {
  if (!(slot && (slot.SubGroup || slot.Replacement))) return <></>;
  const subgroupMentors = slot?.SubGroup?.SubgroupMentors[0];
  console.log(subgroupMentors);
  return (
    <>
      {isOpen && slot && (
        <Modal open={isOpen} onClose={handleClose} className={styles.modal_wrapper}>
          <div>
            {!slot.ReplacementId && (
              <div className={styles.input__block}>
                <a href={slot?.SubGroup.link}>{slot?.SubGroup?.name}</a>
                {subgroupMentors?.TeacherType.type}
                <div className={styles.date_wrapper}>
                  <span>Start: {format(slot.startDate, 'dd.MM.yyyy')}</span>
                  <br />
                  <span>End: {format(slot.endDate, 'dd.MM.yyyy')}</span>
                </div>
              </div>
            )}

            <FormInput
              title="Course:"
              type="text"
              name="course"
              value={
                slot.ReplacementId
                  ? slot.Replacement.SubGroup.Course.name
                  : slot?.SubGroup?.Course.name
              }
              placeholder="Course"
              disabled={true}
            />

            <FormInput
              title="Name:"
              type="text"
              name="subgroupName"
              value={slot.ReplacementId ? slot.Replacement.SubGroup.name : slot?.SubGroup.name}
              placeholder="Course"
              disabled={true}
            />
            <FormInput
              title="Appointer:"
              type="text"
              name="course"
              value={
                slot.ReplacementId
                  ? slot?.Replacement?.SubGroup?.Admin?.name
                  : slot?.SubGroup?.Admin?.name
              }
              placeholder="Administrator"
              disabled={true}
            />
            {!slot.ReplacementId && (
              <FormInput
                classname="input__bottom"
                title="Schedule:"
                type="text"
                name="schedule"
                value={subgroupMentors.schedule.split(',').join('\n')}
                disabled={true}
                textArea={true}
              />
            )}

            <FormInput
              classname="input__bottom"
              title="Description:"
              type="text"
              value={
                slot.ReplacementId
                  ? slot?.Replacement?.SubGroup?.description
                  : slot.SubGroup.description
              }
              disabled={true}
              textArea={true}
            />

            {slot.ReplacementId && (
              <FormInput
                classname="input__bottom"
                title="Description to replacement:"
                type="text"
                value={slot.Replacement.description}
                disabled={true}
                textArea={true}
              />
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default SlotDetails;
