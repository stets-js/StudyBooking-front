import Modal from '../../Modal/Modal';
import FormInput from '../../FormInput/FormInput';
import React, {useState} from 'react';
import styles from './slotDetails.module.scss';
import {format} from 'date-fns';
import EditButton from '../../Buttons/Edit';
import DeleteButton from '../../Buttons/Delete';
import {patchLesson} from '../../../helpers/lessons/lesson';
import {useDispatch} from 'react-redux';
import {updateSlotForWeek} from '../../../redux/action/weekScheduler.action';

const SlotDetails = ({isOpen, handleClose, setSlot, slot, userId}) => {
  const dispatch = useDispatch();
  const [isFBEdit, setIsFBEdit] = useState(false); // feedbackEdit
  const [prevFeedback, setPrevFeedback] = useState(slot?.feedback);
  if (!(slot && (slot.SubGroup || slot.Replacement))) return <></>;
  const subgroupMentors = (slot?.SubGroup?.SubgroupMentors || [])[0];
  return (
    <>
      {isOpen && slot && (
        <Modal open={isOpen} onClose={handleClose} className={styles.modal_wrapper}>
          <div>
            {!slot.ReplacementId && (
              <div className={styles.input__block}>
                <a href={slot?.SubGroup.link}>{slot?.SubGroup?.name}</a>
                {subgroupMentors?.TeacherType?.type}
                <div className={styles.date_wrapper}>
                  <span>Start: {format(slot?.SubGroup.startDate, 'dd.MM.yyyy')}</span>
                  <br />
                  <span>End: {format(slot?.SubGroup.endDate, 'dd.MM.yyyy')}</span>
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
              value={slot?.SubGroup?.description || slot?.Replacement?.SubGroup?.description}
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

            <FormInput
              classname="input__bottom"
              title="Feedback:"
              type="text"
              disabled={!isFBEdit}
              handler={e =>
                setSlot(prev => {
                  return {...prev, feedback: e};
                })
              }
              value={slot.feedback || ''}
              textArea={true}
            />
          </div>
          {!isFBEdit ? (
            <EditButton
              onClick={() => {
                setIsFBEdit(true);
                setPrevFeedback(slot.feedback);
              }}></EditButton>
          ) : (
            <div>
              <EditButton
                title={'Confirm'}
                onClick={async () => {
                  const res = await patchLesson(slot.id, {feedback: slot.feedback});
                  if (res) {
                    dispatch(updateSlotForWeek(slot));
                    setIsFBEdit(false);
                  }
                }}></EditButton>
              <DeleteButton
                title={'Cancel'}
                onClick={() => {
                  setIsFBEdit(false);
                  setSlot(prev => {
                    return {...prev, feedback: prevFeedback};
                  });
                }}></DeleteButton>
            </div>
          )}
        </Modal>
      )}
    </>
  );
};

export default SlotDetails;
