import Modal from '../../Modal/Modal';
import FormInput from '../../FormInput/FormInput';
import React, {useEffect, useState} from 'react';
import styles from './slotDetails.module.scss';
import {getSlotDetails} from '../../../helpers/subgroup/subgroup';
import {addMinutes, format} from 'date-fns';
import {getCourseById} from '../../../helpers/course/course';
import {getReplacementDetails} from '../../../helpers/replacement/replacement';
const SlotDetails = ({
  isOpen,
  handleClose,
  subGroupId,
  appointmentDetails,
  replacementId,
  isReplacement
}) => {
  const [slot, setSlot] = useState(null);
  const [course, setCourse] = useState(null);
  const [replacementDetails, setReplacementDetails] = useState(null);
  useEffect(() => {
    const fetchSubGroupDetails = async () => {
      try {
        const data = await getSlotDetails(subGroupId);
        setSlot(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchReplacementDetails = async () => {
      const data = await getReplacementDetails(replacementId);
      setReplacementDetails(data.data);
    };

    if (!isReplacement) {
      if (subGroupId) {
        fetchSubGroupDetails();
      }
    } else {
      if (replacementId) fetchReplacementDetails();
    }
  }, [subGroupId, replacementId]);
  useEffect(() => {
    const fetchCourse = async () => {
      const courseData = await getCourseById(
        !isReplacement ? slot.CourseId : replacementDetails?.SubGroup?.CourseId
      );
      setCourse(courseData.data);
    };
    if ((!isReplacement && slot?.CourseId) || replacementDetails?.SubGroup?.CourseId) fetchCourse();
  }, [slot]);
  return (
    <>
      {isOpen && (slot || replacementDetails) && (
        <Modal open={isOpen} onClose={handleClose} className={styles.modal_wrapper}>
          <div>
            {!isReplacement && (
              <div className={styles.input__block}>
                <a href="data.link">{slot?.name}</a>
                <div className={styles.date_wrapper}>
                  <span>Старт: {format(slot.startDate, 'dd.MM.yyyy')}</span>
                  <br />
                  <span>Кінець: {format(slot.endDate, 'dd.MM.yyyy')}</span>
                </div>
              </div>
            )}

            <FormInput
              title="Курс:"
              type="text"
              name="course"
              value={course && course?.name}
              placeholder="Course"
              disabled={true}
            />

            <FormInput
              title="Назва потока:"
              type="text"
              name="subgroupName"
              value={!isReplacement ? slot?.name : replacementDetails?.SubGroup?.name}
              placeholder="Course"
              disabled={true}
            />
            <FormInput
              title="Призначення:"
              type="text"
              name="course"
              value={slot?.Admin?.name}
              placeholder="Administrator"
              disabled={true}
            />
            {!isReplacement && (
              <FormInput
                classname="input__bottom"
                title="Графік:"
                type="text"
                name="schedule"
                value={slot?.schedule.split(',').join('\n')}
                disabled={true}
                textArea={true}
              />
            )}

            <FormInput
              classname="input__bottom"
              title="Повідомлення до потока:"
              type="text"
              value={!isReplacement ? slot.description : replacementDetails?.SubGroup?.description}
              disabled={true}
              textArea={true}
            />
            {isReplacement && (
              <FormInput
                classname="input__bottom"
                title="Повідомлення до заміни:"
                type="text"
                value={replacementDetails?.description}
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
