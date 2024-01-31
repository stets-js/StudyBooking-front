import Modal from '../../Modal/Modal';
import React, {useEffect, useState} from 'react';
import {postCourse} from '../../../helpers/course/course';
import FormInput from '../../FormInput/FormInput';
import Form from '../../Form/Form';
import {getUsers} from '../../../helpers/user/user';
import Select from 'react-select';

const NewCourse = ({isOpen, handleClose}) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState(0);
  const [teamLead, setTeamLead] = useState({label: '', value: null});
  const [selectedTeamLead, setSelectedTeamLead] = useState(0);
  useEffect(() => {
    getUsers().then(data =>
      setTeamLead(
        data.data.map(el => {
          return {label: el.name, value: el.id};
        })
      )
    );
  }, []);

  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <Form
            onSubmit={() => {
              handleClose();
              setName('');
              setNumber(0);
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
            team_lead_id={selectedTeamLead}
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
            <br />
            <br />
            <Select
              options={teamLead}
              name="teamLead"
              required
              onChange={choice => setSelectedTeamLead(choice.value)}
            />
          </Form>
        </Modal>
      )}
    </>
  );
};

export default NewCourse;
