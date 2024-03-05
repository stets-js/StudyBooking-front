import Modal from '../../Modal/Modal';
import React, {useState, useEffect} from 'react';

import Form from '../../Form/Form';
import {getSlotDetails} from '../../../helpers/subgroup/subgroup';
import FormInput from '../../FormInput/FormInput';

const ChangeSubGroup = ({isOpen, handleClose, id, setRender}) => {
  const [element, setElement] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(id);
        const data = await getSlotDetails(id);
        setElement(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (id) fetchData();
  }, [id]);
  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <Form
            id={id}
            type={{type: 'subGroup'}}
            status={{
              successMessage: 'Відредаговано потік!',
              failMessage: 'Не вийщло відредагувати потік!'
            }}
            name={element.name}
            description={element.description}
            link={element.link}
            title="Редагування потока "
            onSubmit={() => {
              handleClose();
              setRender(true);
            }}>
            <FormInput
              title="Назва"
              value={element.name}
              placeholder={'Wait..'}
              handler={e =>
                setElement(prevElement => ({
                  ...prevElement,
                  name: e
                }))
              }></FormInput>
            <FormInput
              title="Опис"
              value={element.description}
              placeholder={'Wait..'}
              handler={e =>
                setElement(prevElement => ({
                  ...prevElement,
                  description: e
                }))
              }></FormInput>
            <FormInput
              title="Посилання на CRM/LMS"
              value={element.link}
              placeholder={'Wait..'}
              handler={e =>
                setElement(prevElement => ({
                  ...prevElement,
                  link: e
                }))
              }></FormInput>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default ChangeSubGroup;
