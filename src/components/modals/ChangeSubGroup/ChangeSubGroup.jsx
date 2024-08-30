import Modal from '../../Modal/Modal';
import React, {useState, useEffect} from 'react';
import {success, error} from '@pnotify/core';
import Select from 'react-select';
import {useSelector} from 'react-redux';
import classNames from 'classnames';

import Form from '../../Form/Form';
import {getSlotDetails, getSubgroupJSON, updateSubGroup} from '../../../helpers/subgroup/subgroup';
import FormInput from '../../FormInput/FormInput';
import MentorTable from './mentorTable';
import EditButton from '../../Buttons/Edit';
import DeleteButton from '../../Buttons/Delete';
import SelectorStyles from '../../../styles/selector.module.scss';
import buttonStyles from '../../Buttons/buttons.module.scss';
import InfoButton from '../../Buttons/Info';
import formInputStyles from '../../../styles/FormInput.module.scss';
const ChangeSubGroup = ({isOpen, handleClose, id}) => {
  const [element, setElement] = useState({});
  const [editActive, setEditActive] = useState(false);
  const courses = useSelector(state => state.courses.courses).map(el => ({
    label: el.name,
    value: el.id
  }));

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
              failMessage: 'Failed to edit subgroup!'
            }}
            name={element.name}
            description={element.description}
            CourseId={element.CourseId}
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
            {!editActive ? (
              <FormInput
                title="Course:"
                value={courses.find(course => course.value === element.CourseId)?.label}
                placeholder={'Wait..'}
                disabled
              />
            ) : (
              <>
                <p className={formInputStyles.input__title}>Course: </p>
                <Select
                  onChange={e => setElement(prev => ({...prev, CourseId: e.value}))}
                  options={courses}
                  className={classNames(
                    SelectorStyles.selector,
                    SelectorStyles.selector__fullwidth
                  )}
                  value={courses.find(course => course.value === element.CourseId)}></Select>
              </>
            )}
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
              title="Link to group chat"
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
                <MentorTable
                  subgroupMentors={element.SubgroupMentors}
                  setSubgroupMentors={setElement}
                  subgroupId={element.id}
                  isEdit={editActive}></MentorTable>
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
                            link: element.link,
                            CourseId: element.CourseId
                          }
                        });
                        if (res) {
                          success({text: 'Updated subgroup!', delay: 1000});
                        }
                        // if (res) {
                        //   handleClose();
                        // }
                      }}
                      text={'Confirm'}></EditButton>
                    <DeleteButton
                      onClick={() => {
                        setEditActive(false);
                      }}
                      text={'Cancel'}></DeleteButton>
                  </>
                )}
                <InfoButton
                  onClick={async () => {
                    const res = await getSubgroupJSON({id: element.id});
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${element.name}.json`);
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode.removeChild(link);
                  }}
                  text={'Download'}></InfoButton>
              </div>
            </div>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default ChangeSubGroup;
