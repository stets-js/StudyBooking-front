import React, {useEffect, useState} from 'react';
import {error, success} from '@pnotify/core';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';

import CloudinaryUploadWidget from '../../components/Cloudinary/UploadWidget';
import {getUserById, patchUser} from '../../helpers/user/user';
import FormInput from '../../components/FormInput/FormInput';
import styles from '../../styles/teacher.module.scss';
import PhoneInput from 'react-phone-input-2';
import EditButton from '../../components/Buttons/Edit';
import DeleteButton from '../../components/Buttons/Delete';

export default function Info() {
  const {teacherId} = useParams() || null;
  let userId = useSelector(state => state.auth.user.id);
  if (teacherId) userId = teacherId; //case when admin is logged in and wants to see another teachers schedule
  const [user, setUser] = useState();
  const [backupUser, setBackupUser] = useState({}); // for saving user data before editing, so i can roll back data if not success
  const [editActive, setEditActive] = useState(false);
  const fetchUserData = async id => {
    try {
      const res = await getUserById(id);
      setUser(res.data);
    } catch (error) {}
  };
  useEffect(() => {
    if (userId) fetchUserData(userId);
  }, [userId]);

  const updateUser = async () => {
    try {
      const res = await patchUser(user);
      if (!res) setUser(backupUser);
      else {
        success({text: 'Updated info :)', delay: 1000});
      }
    } catch (e) {
      error({text: 'Sorry, something went wrong :(', delay: 1000});
      setUser(backupUser);
    }
  };
  return (
    <>
      <div className={styles.info__wrapper}>
        <div className={styles.info__name_block}>
          <div className={styles.info__avatar__wrapper}>
            <img src={user?.photoUrl} alt="avatar" className={styles.info__avatar__photo}></img>
            <CloudinaryUploadWidget setUser={setUser} className={styles.info__avatar__button} />
          </div>
          <div>
            <FormInput
              type={'text'}
              title={'Name:'}
              value={user?.name}
              disabled={!editActive}
              width={'90%'}
              handler={e => setUser({...user, name: e})}></FormInput>
            <FormInput
              type={'text'}
              title={'Email:'}
              value={user?.email}
              disabled={true}
              width={'90%'}
              handler={e => setUser({...user, email: e})}></FormInput>
          </div>
        </div>
        <div className={styles.info__inline}>
          <FormInput
            type={'text'}
            title={'City:'}
            value={user?.city}
            disabled={!editActive}
            width={'90%'}
            handler={e => setUser({...user, city: e})}></FormInput>
          <div className={`${styles.info__item} ${styles.phone__wrapper}`}>
            <span className={styles.phone__label}>Phone:</span>
            <PhoneInput
              label="Phone"
              name={'phone'}
              preferredCountries={['ua']}
              placeholder={'(096)-12-34567'}
              required={true}
              value={user?.phone}
              className={styles.phone}
              inputStyle={{height: '45px', borderRadius: '25px', backgroundColor: '#d9d9d9'}}
              buttonStyle={{borderRadius: '25px', borderRight: '0', backgroundColor: '#bdbdbd'}}
              onChange={phone => setUser({...user, phone})}
              disabled={!editActive}
            />
          </div>
        </div>
        <div className={styles.info__item}>
          <FormInput
            textArea
            title={'Description:'}
            value={user?.description}
            disabled={!editActive}
            width={'90%'}
            handler={e => setUser({...user, description: e})}></FormInput>
        </div>
        {!editActive ? (
          <EditButton
            onClick={() => {
              setBackupUser(user);
              setEditActive(true);
            }}></EditButton>
        ) : (
          <div className={styles.button__wrapper}>
            <EditButton
              onClick={() => {
                setEditActive(false);
                updateUser();
              }}
              text={'Confirm'}></EditButton>
            <DeleteButton
              onClick={() => {
                setEditActive(false);
                setUser(backupUser);
              }}
              text={'Cancel'}></DeleteButton>
          </div>
        )}
      </div>
    </>
  );
}
