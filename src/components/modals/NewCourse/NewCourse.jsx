import Modal from '../../Modal/Modal';
import React, {useState} from 'react';
import {postCourse} from '../../../helpers/course/course';
import {postGroup} from '../../../helpers/group/group';
import FormInput from '../../FormInput/FormInput';
import Form from '../../Form/Form';

const NewCourse = ({isOpen, handleClose}) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState(0);
  const [teamLead, setTeamLead] = useState(0);

  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <Form
            onSubmit={() => {
              handleClose();
              setName('');
            }}
            isDescription={true}
            type={{type: 'post'}}
            requests={{
              post: postCourse
            }}
            status={{
              successMessage: 'Successfully created course',
              failMessage: 'Failed to create course'
            }}
            name={name}
            group_number={number}
            team_lead={teamLead}
            title="New course">
            <FormInput
              title="Name:"
              type="text"
              name="name"
              max={50}
              value={name}
              placeholder="Name"
              isRequired={true}
              handler={setName}
            />
            <FormInput
              title="Group number:"
              type="number"
              name="group_number"
              min={0}
              value={number}
              placeholder="Group number"
              isRequired={true}
              handler={setNumber}
            />
            <FormInput
              title="Team lead:"
              type="number"
              name="team_lead"
              min={0}
              value={teamLead}
              placeholder="Team lead"
              isRequired={true}
              handler={setTeamLead}
            />
          </Form>
        </Modal>
      )}
    </>
  );
};

export default NewCourse;
