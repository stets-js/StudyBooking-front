import Modal from '../../Modal/Modal';
import React, {useEffect, useState} from 'react';
import FormInput from '../../FormInput/FormInput';
import Form from '../../Form/Form';
import {bulkSlotCreate} from '../../../helpers/slot/slot';

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
              post: bulkSlotCreate
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
            />
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
            />

            {/* <FormInput
              title="Description:"
              type="text"
              name="description"
              value={subgroup.description}
              textArea={true}
              placeholder="Description"
              isRequired={true}
              handler={e => {
                setSubgroup({...subgroup, description: e});
              }}
            /> */}
          </Form>
        </Modal>
      )}
    </>
  );
};

export default NewMySubgroup;
