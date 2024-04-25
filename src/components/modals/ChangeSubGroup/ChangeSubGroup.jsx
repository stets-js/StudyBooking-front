import Modal from '../../Modal/Modal';
import React, {useState, useEffect} from 'react';

import Form from '../../Form/Form';
import {getSlotDetails, updateSubGroup} from '../../../helpers/subgroup/subgroup';
import FormInput from '../../FormInput/FormInput';
import MentorTable from './mentorTable';
import EditButton from '../../Buttons/Edit';
import DeleteButton from '../../Buttons/Delete';
import buttonStyles from '../../Buttons/buttons.module.scss';
const ChangeSubGroup = ({isOpen, handleClose, id, setRender}) => {
  const [element, setElement] = useState({});
  const [editActive, setEditActive] = useState(false);
  const fetchData = async () => {
    try {
      const data = await getSlotDetails(id);
      setElement(data.data);
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
  console.log(element);
  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <Form
            editButton // flag for not showing save button
            id={element.id}
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
              // setRender(true);
            }}>
            <FormInput
              title="Name"
              value={element.name}
              placeholder={'Wait..'}
              disabled={!editActive}
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
              disabled={!editActive}
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
              disabled={!editActive}
              handler={e =>
                setElement(prevElement => ({
                  ...prevElement,
                  link: e
                }))
              }></FormInput>
            <br />
            {element.SubgroupMentors && (
              <div>
                <MentorTable subgroupMentors={element.SubgroupMentors}></MentorTable>
                {/* {element.SubgroupMentors.map(mentor => {
                  return (
                    <div>
                      {mentor.User.name} {mentor.TeacherType.type} {mentor.schedule}
                    </div>
                  );
                })} */}
              </div>
            )}
            <div>
              <div
                className={`${buttonStyles.button__wrapper} ${buttonStyles.button__wrapper__subgroup}`}>
                {!editActive ? (
                  <EditButton
                    onClick={() => {
                      setEditActive(true);
                    }}></EditButton>
                ) : (
                  <>
                    <EditButton
                      onClick={async () => {
                        setEditActive(false);
                        // updateUser();
                        const res = await updateSubGroup({
                          id: element.id,
                          body: {
                            name: element.name,
                            description: element.description,
                            link: element.link
                          }
                        });
                        if (res) {
                          handleClose();
                          setRender(true);
                        }
                      }}
                      text={'Confirm'}></EditButton>
                    <DeleteButton
                      onClick={() => {
                        setEditActive(false);
                      }}
                      text={'Cancel'}></DeleteButton>
                  </>
                )}
              </div>
            </div>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default ChangeSubGroup;
