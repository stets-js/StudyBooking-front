import Modal from '../../Modal/Modal';
import React, {useState, useEffect} from 'react';
import {patchCourse, deleteCourse, getCourseById} from '../../../helpers/course/course';
import Form from '../../Form/Form';
import FormInput from '../../FormInput/FormInput';
import styles from '../../../styles/FormInput.module.scss';
import {getUsers} from '../../../helpers/user/user';
import Select from 'react-select';
import {useTranslation} from 'react-i18next';

const ChangeCourse = ({isOpen, handleClose, id, courseArray}) => {
  const {t} = useTranslation('global');

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
            title={t('admin.courses.modal.title')}>
            <FormInput
              title={t('admin.courses.modal.name') + ':'}
              type="text"
              name="name"
              value={name}
              placeholder={t('admin.courses.modal.name')}
              isRequired={true}
              handler={setName}
            />
            <FormInput
              title={t('admin.courses.modal.short') + ':'}
              type="text"
              name="shortening"
              value={shortening}
              placeholder={t('admin.courses.modal.short')}
              isRequired={true}
              handler={setShortening}
            />
            <FormInput
              title={t('admin.courses.modal.amount') + ':'}
              type="number"
              name="group_number"
              min={0}
              value={number}
              disabled={1}
              placeholder={t('admin.courses.modal.amount')}
              isRequired={true}
              handler={setNumber}
            />
            <label htmlFor="teamLead" className={styles.input__label}>
              <p className={styles.input__title}>{t('admin.courses.modal.admin')}: </p>
            </label>
            <Select
              key={'Rerender_element' + Math.random() * 100 - 1}
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
