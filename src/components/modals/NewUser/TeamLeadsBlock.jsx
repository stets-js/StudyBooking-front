import styles from './NewUser.module.scss';
import selectorStyles from '../../../styles/selector.module.scss';
import Modal from '../../Modal/Modal';
import FormInput from '../../FormInput/FormInput';
import Select from 'react-select';
import React, {useEffect, useState} from 'react';
import Clear from '../../../img/clear.svg';
import {useSelector} from 'react-redux';
import EditButton from '../../Buttons/Edit';
import {addMentorToAdminTeam, removeMentorToAdminTeam} from '../../../helpers/user/user';

const TeamLeadsBlock = ({teamLeaders, mentorId, updateUser}) => {
  const [isAddTl, setIsAddTl] = useState(false);
  const admins = useSelector(state => state.usersPage.admins);
  const superAdmins = useSelector(state => state.usersPage.superAdmins);
  const [selectedAdmin, setSelectedAdmin] = useState(false);

  const handleAdd = async mentorId => {
    const res = await addMentorToAdminTeam({mentorId, adminId: selectedAdmin.value});
    if (res) updateUser(mentorId);
  };
  const handleDelete = async (mentorId, adminId) => {
    const res = await removeMentorToAdminTeam({mentorId, adminId});
    if (res) updateUser(mentorId);
  };
  return (
    <div className={styles.teamLeaders}>
      <label className={styles.teamLeaders__label}>
        TeamLeaders:{' '}
        <button
          className={styles.teamLeaders__add}
          onClick={e => {
            e.preventDefault();
            setIsAddTl(!isAddTl);
          }}>
          +
        </button>
      </label>
      {isAddTl && (
        <div className={styles.teamLeaders__add__wrapper}>
          <Select
            styles={{marginTop: '0'}}
            className={selectorStyles.selector}
            onChange={e => setSelectedAdmin(e)}
            options={[...admins, ...superAdmins].map(admin => {
              return {label: admin.name, value: admin.id};
            })}></Select>
          <EditButton
            text="Create"
            onClick={() => {
              handleAdd(mentorId);
            }}></EditButton>
        </div>
      )}
      <div className={styles.teamLeaders__wrapper}>
        {teamLeaders.map(tl => (
          <p className={styles.teamLeaders__card}>
            {tl.Admin.name}
            <button
              onClick={e => {
                e.preventDefault();
                handleDelete(mentorId, tl.Admin.id);
              }}>
              <img className={styles.teamLeaders__delete} src={Clear} alt="x" />
            </button>
          </p>
        ))}
      </div>
    </div>
  );
};

export default TeamLeadsBlock;
