import Modal from '../../Modal/Modal';
import FormInput from '../../FormInput/FormInput';
import React, {useEffect, useState} from 'react';
import styles from './slotDetails.module.scss';
import {getSlotDetails} from '../../../helpers/subgroup/subgroup';
import {format} from 'date-fns';
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

  return (
    <>
      {isOpen && (slot || replacementDetails) && (
        <Modal open={isOpen} onClose={handleClose} className={styles.modal_wrapper}>
          <div>
            {!isReplacement && (
              <div className={styles.input__block}>
                <a href="data.link">{slot?.name}</a>
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
              value={slot ? slot.Course.name : replacementDetails?.SubGroup?.Course.name}
              placeholder="Course"
              disabled={true}
            />

            <FormInput
              title="Name:"
              type="text"
              name="subgroupName"
              value={!isReplacement ? slot?.name : replacementDetails?.SubGroup?.name}
              placeholder="Course"
              disabled={true}
            />
            <FormInput
              title="Appointer:"
              type="text"
              name="course"
              value={slot?.Admin?.name || replacementDetails?.SubGroup?.Admin?.name}
              placeholder="Administrator"
              disabled={true}
            />
            {!isReplacement && (
              <FormInput
                classname="input__bottom"
                title="Schedule:"
                type="text"
                name="schedule"
                value={slot?.schedule.split(',').join('\n')}
                disabled={true}
                textArea={true}
              />
            )}

            <FormInput
              classname="input__bottom"
              title="Description:"
              type="text"
              value={!isReplacement ? slot.description : replacementDetails?.SubGroup?.description}
              disabled={true}
              textArea={true}
            />
            {isReplacement && (
              <FormInput
                classname="input__bottom"
                title="Description to replacement:"
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
