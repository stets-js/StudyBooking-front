import Modal from '../../Modal/Modal';
import React, {useState, useEffect} from 'react';

import Form from '../../Form/Form';
import {getReplacementDetails} from '../../../helpers/replacement/replacement';
import FormInput from '../../FormInput/FormInput';

const ChangeReplacement = ({isOpen, handleClose, id, setRender}) => {
  const [element, setElement] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReplacementDetails(id);
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
            type={{type: 'replacement'}}
            status={{
              successMessage: 'Відредаговано заміну!',
              failMessage: 'Не вийщло відредагувати заміну!'
            }}
            description={element.description}
            link={element.link}
            title="Редагування потока"
            onSubmit={() => {
              handleClose();
              setRender(true);
            }}>
            <FormInput
              title="Description:"
              value={element.description}
              handler={e => {
                setElement({...element, description: e});
              }}></FormInput>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default ChangeReplacement;
