import Modal from '../../Modal/Modal';
import React, {useEffect, useState} from 'react';
import {postCourse} from '../../../helpers/course/course';
import FormInput from '../../FormInput/FormInput';
import Form from '../../Form/Form';
import {getUsers} from '../../../helpers/user/user';
import Select from 'react-select';
import styles from '../../../styles/FormInput.module.scss';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

const NewCourse = ({isOpen, handleClose}) => {
  const {t} = useTranslation('global');

  const userId = useSelector(state => state.auth.user.id);
  const [name, setName] = useState('');
  const [teamLead, setTeamLead] = useState({label: '', value: null});
  const [selectedTeamLead, setSelectedTeamLead] = useState(userId);
  const [shortening, setShortening] = useState('');
  useEffect(() => {
    try {
      getUsers('role=administrator').then(data => {
        setTeamLead(
          data?.data.map(el => {
            return {label: el.name, value: el.id};
          })
        );
      });
    } catch (error) {}
  }, []);

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
            team_lead_id={selectedTeamLead}
            shortening={shortening}
            title={t('modals.newCourse.title')}>
            <FormInput
              title={t('modals.newCourse.name') + ':'}
              type="text"
              name="name"
              max={50}
              value={name}
              placeholder={t('modals.newCourse.name')}
              isRequired={true}
              handler={setName}
            />
            <FormInput
              title={t('modals.newCourse.short') + ':'}
              type="text"
              name="Shortening"
              max={50}
              value={shortening}
              placeholder={t('modals.newCourse.short')}
              isRequired={true}
              handler={setShortening}
            />

            <label htmlFor="teamLead" className={styles.input__label}>
              <p className={styles.input__title}>{t('modals.newCourse.admin')} </p>
            </label>
            <Select
              defaultValue={teamLead.filter(user => user.value === userId)}
              className={styles.selector}
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
