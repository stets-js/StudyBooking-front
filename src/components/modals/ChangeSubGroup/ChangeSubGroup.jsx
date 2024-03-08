import Modal from '../../Modal/Modal';
import React, {useState, useEffect} from 'react';
import Select from 'react-select';

import styles from '../../../styles/teacher.module.scss';
import Form from '../../Form/Form';
import {getSlotDetails} from '../../../helpers/subgroup/subgroup';
import FormInput from '../../FormInput/FormInput';
import {getUsersForSubGroupReplacements} from '../../../helpers/user/user';

const ChangeSubGroup = ({isOpen, handleClose, id, setRender}) => {
  const [element, setElement] = useState({});
  const [mentorsForReplacements, setMentorsForReplacements] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState({});

  const fetchUsersForReplacemenmt = async () => {
    try {
      if (element.id && element.CourseId) {
        const users = await getUsersForSubGroupReplacements(element.id, element.CourseId);
        setMentorsForReplacements(
          users.data.map(el => {
            return {value: el.id, label: el.name};
          })
        );
        setSelectedMentor(mentorsForReplacements.find(el => el.value === element.id));
      } else {
        setMentorsForReplacements([]);
      }
    } catch (error) {}
  };
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
  useEffect(() => {
    if (element.id) {
      fetchUsersForReplacemenmt();
    }
  }, [element.id]);
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
            {/* <label htmlFor="mentors" className={styles.input__label}>
              Замінити викладача
            </label>
            
            <Select
              name="mentors"
              className={styles.selector}
              options={mentorsForReplacements}
              value={selectedMentor}
              onChange={e => setSelectedMentor(e)}></Select> */}
          </Form>
        </Modal>
      )}
    </>
  );
};

export default ChangeSubGroup;
