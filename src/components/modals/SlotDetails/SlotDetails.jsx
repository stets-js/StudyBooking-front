import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {format} from 'date-fns';
import {useDispatch} from 'react-redux';
import {success} from '@pnotify/core';

import FormInput from '../../FormInput/FormInput';
import selectorStyles from '../../../styles/selector.module.scss';
import Modal from '../../Modal/Modal';
import styles from './slotDetails.module.scss';
import EditButton from '../../Buttons/Edit';
import DeleteButton from '../../Buttons/Delete';
import {getTopics, patchLesson} from '../../../helpers/lessons/lesson';
import {updateSlotForWeek} from '../../../redux/action/weekScheduler.action';
import classNames from 'classnames';

const SlotDetails = ({isOpen, handleClose, setSlot, slot, userId}) => {
  const [topics, setTopics] = useState([]);

  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false); // feedbackEdit
  const [prevFeedback, setPrevFeedback] = useState(slot?.feedback);
  const fetchData = async () => {
    const res = await getTopics();
    if (res)
      setTopics(
        res.data.data.map(element => {
          return {label: element.topic, value: element.id};
        })
      );
  };
  useEffect(() => {
    fetchData();
  }, []);
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
            <p className={styles.topic__label}>Topic</p>
            <Select
              name="Topic"
              isDisabled={!isEdit}
              className={classNames(selectorStyles.selector, selectorStyles.selector__fullwidth)}
              value={topics.filter(el => el.value === slot.LessonTopicId)}
              options={topics}
              required
              key={Math.random() * 100 - 10}
              placeholder="Select Topic"
              onChange={el =>
                setSlot(prev => {
                  return {...prev, LessonTopicId: el.value};
                })
              }
            />
            <FormInput
              classname="input__bottom"
              title="Feedback:"
              type="text"
              disabled={!isEdit}
              handler={e =>
                setSlot(prev => {
                  return {...prev, feedback: e};
                })
              }
              value={slot.feedback || ''}
              textArea={true}
            />
          </div>
          {!isEdit ? (
            <EditButton
              onClick={() => {
                setIsEdit(true);
                setPrevFeedback(slot.feedback);
              }}></EditButton>
          ) : (
            <div>
              <EditButton
                text={'Confirm'}
                onClick={async () => {
                  const res = await patchLesson(slot.id, {
                    feedback: slot.feedback,
                    LessonTopicId: slot.LessonTopicId
                  });
                  if (res) {
                    dispatch(updateSlotForWeek(slot));
                    setIsEdit(false);
                    success({text: 'Updated lesson!', delay: 1000});
                  }
                }}></EditButton>
              <DeleteButton
                text={'Cancel'}
                onClick={() => {
                  setIsEdit(false);
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
