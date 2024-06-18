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
import HeaderLinks from './HeaderLinks';

const SlotDetails = ({isOpen, handleClose, slots, userId}) => {
  const [topics, setTopics] = useState([]);
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false); // feedbackEdit
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
  const [slot, setSlot] = useState(Array.isArray(slots) ? slots[0] : slots);
  useEffect(() => {
    setSlot(Array.isArray(slots) ? slots[0] : slots);
  }, [slots]);
  if (!(slot && (slot.SubGroup || slot.Replacement))) return <></>;
  const subgroupMentors = (slot?.SubGroup?.SubgroupMentors || [])[0];
  console.log(slot?.SubGroup);
  return (
    <>
      {isOpen && slot && (
        <Modal open={isOpen} onClose={handleClose} className={styles.modal_wrapper}>
          <div>
            {!slot.ReplacementId && (
              <div>
                {(Array.isArray(slots) ? slots : [slots]).map(slot => (
                  <HeaderLinks
                    link={slot?.SubGroup.link}
                    name={slot?.SubGroup?.name}
                    start={slot?.SubGroup.startDate}
                    end={slot?.SubGroup.endDate}></HeaderLinks>
                ))}
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
              value={
                slot.ReplacementId
                  ? slot.Replacement.SubGroup.name
                  : (Array.isArray(slots) ? slots : [slots])
                      .map(slot => slot?.SubGroup.name)
                      .join(', ')
              }
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
                appointmentLength={(() => {
                  let count = 0;
                  (Array.isArray(slots) ? slots : [slots]).map(
                    slot => (count += slot.SubGroup.SubgroupMentors[0].schedule.split('\n').length)
                  );
                  return count + (Array.isArray(slots) ? slots : [slots]).length / 2;
                })()}
                value={
                  Array.isArray(slots)
                    ? slots
                        .map(slot => {
                          return (
                            `${slot.SubGroup.name}: \n` +
                            slot?.SubGroup?.SubgroupMentors[0].schedule
                              .split('\n')
                              .map(sc => {
                                return sc ? `\t${sc}\n` : '';
                              })
                              .join('')
                          );
                        })
                        .join('')
                    : slot?.SubGroup?.SubgroupMentors[0].schedule
                  // subgroupMentors.schedule.split(',').join('\n')
                }
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
            {/* <p className={styles.topic__label}>Topic</p> */}
            {/* <Select
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
            /> */}
            <FormInput
              classname="input__bottom"
              title="Feedback:"
              type="text"
              disabled={1}
              value={slot?.Feedback?.report || ''}
              textArea={true}
            />
          </div>
          {/* {!isEdit ? (
            <EditButton
              onClick={() => {
                setIsEdit(true);
              }}></EditButton>
          ) : (
            <div>
              <EditButton
                text={'Confirm'}
                onClick={async () => {
                  const res = await patchLesson(slot.id, {
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
                }}></DeleteButton>
            </div>
          )} */}
        </Modal>
      )}
    </>
  );
};

export default SlotDetails;
