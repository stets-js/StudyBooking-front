import Modal from '../../Modal/Modal';
import React, {useState, useEffect} from 'react';
import {patchCourse, deleteCourse, getCourseById} from '../../../helpers/course/course';
import Form from '../../Form/Form';
import FormInput from '../../FormInput/FormInput';
import styles from '../../../styles/FormInput.module.scss';
import {getUsers} from '../../../helpers/user/user';
import Select from 'react-select';

const ChangeCourse = ({isOpen, handleClose, id, courseArray}) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState(0);
  const [teamLead, setTeamLead] = useState([{label: 'a', value: 0}]);
  const [teamLeadId, setTeamLeadId] = useState(0);
  const [author, setAuthor] = useState({label: '', value: 0});
  const [shortening, setShortening] = useState('');
  useEffect(() => {
    const fectchUsers = async () => {
      setTeamLead(
        (await getUsers('role=administrator')).data.map(el => {
          return {
            label: el.name,
            value: el.id
          };
        })
      );
    };
    fectchUsers();
  }, [id]);
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const courseData = (await getCourseById(id)).data;

          setName(courseData.name);
          setNumber(courseData.group_amount);
          setTeamLeadId(courseData.teamLeadId);
          setShortening(courseData.shortening);
        } catch (error) {}
      }
    };
    fetchData();
    try {
    } catch (error) {}
  }, [id, teamLead]);
  useEffect(() => {
    setAuthor(teamLead.filter(tl => tl.value === teamLeadId)[0]);
  }, [teamLeadId, teamLead, author]);

  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <Form
            type={{type: 'put', additionalType: 'delete'}}
            requests={{
              put: patchCourse,
              additional: id,
              delete: deleteCourse
            }}
            onSubmit={handleClose}
            status={{
              successMessage: 'Successfully changed course',
              failMessage: 'Failed to change course',
              successMessageDelete: 'Successfully deleted course',
              failMessageDelete: 'Failed to delete course'
            }}
            name={name}
            number={number}
            teamLeadId={teamLeadId}
            shortening={shortening}
            title="Change course's info">
            <FormInput
              title="Name:"
              type="text"
              name="name"
              value={name}
              placeholder="Name"
              isRequired={true}
              handler={setName}
            />
            <FormInput
              title="Shortening:"
              type="text"
              name="shortening"
              value={shortening}
              placeholder="Shortening"
              isRequired={true}
              handler={setShortening}
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
            <label htmlFor="teamLead" className={styles.input__label}>
              <p className={styles.input__title}>Administator: </p>
            </label>
            <Select
              key={'Rerender_element' + Math.random() * (1000 - 100)}
              defaultValue={teamLead.filter(tl => tl.value === teamLeadId)[0]}
              className={styles.selector}
              options={teamLead}
              name="teamLead"
              required
              onChange={choice => setTeamLeadId(choice.value)}
            />
          </Form>
        </Modal>
      )}
    </>
  );
};

export default ChangeCourse;
