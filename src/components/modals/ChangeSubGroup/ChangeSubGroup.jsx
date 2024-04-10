import Modal from '../../Modal/Modal';
import React, {useState, useEffect} from 'react';

import Form from '../../Form/Form';
import {getSlotDetails} from '../../../helpers/subgroup/subgroup';
import FormInput from '../../FormInput/FormInput';

const ChangeSubGroup = ({isOpen, handleClose, id, setRender}) => {
  const [element, setElement] = useState({});

  const fetchData = async () => {
    try {
      console.log(id);
      const data = await getSlotDetails(id);
      setElement(data.data);
      console.log(id, element);
      // fetchUsersForReplacemenmt();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (id && isOpen) {
      fetchData();
    }
  }, [id]);

  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <Form
            id={id}
            type={{type: 'subGroup'}}
            status={{
              successMessage: 'Edited subgroup!',
              failMessage: 'Failed to edit  subgroup!'
            }}
            name={element.name}
            description={element.description}
            link={element.link}
            title="Subgroup edit"
            onSubmit={() => {
              handleClose();
              setRender(true);
            }}>
            <FormInput
              title="Name"
              value={element.name}
              placeholder={'Wait..'}
              handler={e =>
                setElement(prevElement => ({
                  ...prevElement,
                  name: e
                }))
              }></FormInput>
            <FormInput
              title="Descripion"
              value={element.description}
              placeholder={'Wait..'}
              handler={e =>
                setElement(prevElement => ({
                  ...prevElement,
                  description: e
                }))
              }></FormInput>
            <FormInput
              title="Link to CRM/LMS"
              value={element.link}
              placeholder={'Wait..'}
              handler={e =>
                setElement(prevElement => ({
                  ...prevElement,
                  link: e
                }))
              }></FormInput>
            <br />
          </Form>
        </Modal>
      )}
    </>
  );
};

export default ChangeSubGroup;
