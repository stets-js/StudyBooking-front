import React, {useEffect, useState} from 'react';
import {useConfirm} from 'material-ui-confirm';

import FormInput from '../../FormInput/FormInput';
import Modal from '../../Modal/Modal';
import styles from './slotDetails.module.scss';
import {getTopics, patchLesson} from '../../../helpers/lessons/lesson';
import HeaderLinks from './HeaderLinks';
import {useTranslation} from 'react-i18next';
import InfoButton from '../../Buttons/Info';
import DeleteButton from '../../Buttons/Delete';

const SlotDetails = ({isOpen, handleClose, slots, userId}) => {
  const [topics, setTopics] = useState([]);
  const confirm = useConfirm();
  const {t} = useTranslation('global');

  const [slot, setSlot] = useState(Array.isArray(slots) ? slots[0] : slots);

  const [subgroupData, setSubgropData] = useState(null);
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
  useEffect(() => {
    setSlot(Array.isArray(slots) ? slots[0] : slots);
  }, [slots]);
  useEffect(() => {
    setSubgropData(slot?.SubGroup);
  }, [slot]);
  if (!(slot && (slot.SubGroup || slot.Replacement))) return <></>;

  const subgroupMentors = (slot?.SubGroup?.SubgroupMentors || []).find(
    el => el.mentorId === +userId
  );
  const handleStatusChange = async () => {
    confirm({
      description: t('confirms.slotDetails.desc'),
      confirmationText: t('confirms.slotDetails.yes'),
      cancellationText: t('confirms.slotDetails.no'),
      confirmationButtonProps: {autoFocus: true}
    })
      .then(async () => {
        const data = await patchLesson(slot.id, {status: 'canceled'});
        // const data = await confirmProjectToBlock(marathon._id, blockId, projectId);
        // setMyProject(data);
        console.log(data);
        if (data.statusText === 'OK') {
          console.log('changed');
          setSlot(prev => ({...prev, status: 'canceled'}));
        }
      })
      .catch(e => console.log('no ' + e));
  };
  console.log(slot);
  return (
    <>
      {isOpen && slot && subgroupData && (
        <Modal open={isOpen} onClose={handleClose} className={styles.modal_wrapper}>
          <div>
            {Array.isArray(slots) && slots.length > 1 ? (
              <div>
                {(Array.isArray(slots) ? slots : [slots]).map(slot => (
                  <HeaderLinks
                    link={slot?.SubGroup?.link}
                    name={slot?.SubGroup?.name}
                    start={slot?.SubGroup?.startDate}
                    end={slot?.SubGroup?.endDate}></HeaderLinks>
                ))}
              </div>
            ) : (
              <HeaderLinks
                link={subgroupData?.link}
                name={subgroupData?.name}
                start={subgroupData?.startDate}
                end={subgroupData?.endDate}></HeaderLinks>
            )}

            <FormInput
              title={t('teacher.timetable.slotDetails.course')}
              type="text"
              name="course"
              value={subgroupData.Course.name}
              placeholder="Course"
              disabled={true}
            />

            <FormInput
              title={t('teacher.timetable.slotDetails.name')}
              type="text"
              name="subgroupName"
              value={
                slot.ReplacementId
                  ? subgroupData?.name
                  : (Array.isArray(slots) ? slots : [slots])
                      .map(slot => slot?.SubGroup?.name)
                      .join(', ')
              }
              placeholder="Subgroup name"
              disabled={true}
            />
            <FormInput
              title={t('teacher.timetable.slotDetails.appointer')}
              type="text"
              name="course"
              value={subgroupData?.Admin?.name}
              placeholder="Administrator"
              disabled={true}
            />
            {!slot.ReplacementId && (
              <FormInput
                classname="input__bottom"
                title={t('teacher.timetable.slotDetails.schedule')}
                type="text"
                name="schedule"
                appointmentLength={(() => {
                  let count = 0;
                  (Array.isArray(slots) ? slots : [slots]).map(
                    slot => (count += subgroupMentors.schedule.split('\n').length)
                  );
                  return count + (Array.isArray(slots) ? slots : [slots]).length / 2;
                })()}
                value={
                  Array.isArray(slots)
                    ? slots
                        .map(slot => {
                          return (
                            `${slot?.SubGroup?.name}: \n` +
                            subgroupMentors.schedule
                              .split('\n')
                              .map(sc => {
                                return sc ? `\t${sc}\n` : '';
                              })
                              .join('')
                          );
                        })
                        .join('')
                    : subgroupMentors.schedule
                        .split(',')
                        .map(oneDay => {
                          let oneDaySchedule =
                            t(`daysOfWeek.${oneDay.slice(0, 3).toLowerCase()}`) + oneDay.slice(3);
                          return oneDaySchedule;
                        })
                        .join('\n')
                  // subgroupMentors.schedule.
                }
                disabled={true}
                textArea={true}
              />
            )}

            <FormInput
              classname="input__bottom"
              title={t('teacher.timetable.slotDetails.desc')}
              type="text"
              value={subgroupData?.description}
              disabled={true}
              textArea={true}
            />

            {slot.ReplacementId && (
              <FormInput
                classname="input__bottom"
                title={t('teacher.timetable.slotDetails.repl_desc')}
                type="text"
                value={slot.Replacement.description}
                disabled={true}
                textArea={true}
              />
            )}
            <div className={styles.status}>
              {t('status.text')}: {t('status.' + slot.status)}
            </div>
            <div>
              {/* <InfoButton text={t('buttons.compl')} /> */}
              {slot.status !== 'canceled' && (
                <DeleteButton
                  onClick={handleStatusChange}
                  classname={'fullWidth'}
                  text={t('buttons.not_compl')}
                />
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default SlotDetails;
