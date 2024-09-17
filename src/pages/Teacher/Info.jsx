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
import classNames from 'classnames';
import {getDocumentType} from '../../helpers/document/document-type';
import {getUserDocuments} from '../../helpers/document/user-document';
import TableHeader from '../../components/TableComponent/TableHeader';
import InfoTableBody from '../../components/InfoPage/TableBody';
import {useTranslation} from 'react-i18next';

export default function Info() {
  const {t} = useTranslation('global');

  const {teacherId} = useParams() || null;
  let userId = useSelector(state => state.auth.user.id);
  if (teacherId) userId = teacherId; //case when admin is logged in and wants to see another teachers schedule
  const [user, setUser] = useState();
  const [backupUser, setBackupUser] = useState({}); // for saving user data before editing, so i can roll back data if not success
  const [editActive, setEditActive] = useState(false);
  const [focusToSlack, setFocusToSlack] = useState(false);
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
        success({text: t('teacher.information.notify.success'), delay: 1000});
      }
    } catch (e) {
      error({text: t('teacher.information.notify.err '), delay: 1000});
      setUser(backupUser);
    }
  };
  const [documentType, setDocumentType] = useState([]);
  const [userDocuments, setUserDocuments] = useState([]);
  const getDocTypes = async () => {
    const {data} = await getDocumentType();
    setDocumentType(data);
  };

  const getUserDocs = async () => {
    try {
      const {data} = await getUserDocuments(userId);
      setUserDocuments(data);
    } catch (error) {}
  };
  useEffect(() => {
    getDocTypes();
    getUserDocs();
  }, []);

  console.log(user);
  return (
    <>
      <div className={styles.info__wrapper}>
        <div className={styles.info__container}>
          <div className={styles.info__name_block}>
            <div className={styles.info__avatar__wrapper}>
              <img
                src={
                  user?.photoUrl ||
                  'https://res.cloudinary.com/dn4cdsmqr/image/upload/v1721042678/avatars/egknva7gyyvqf2qlkbaj.jpg'
                }
                alt="avatar"
                className={styles.info__avatar__photo}></img>
              {editActive && (
                <CloudinaryUploadWidget
                  className={styles.info__avatar__button}
                  onSuccess={result => {
                    setUser(prev => {
                      patchUser({id: prev.id, photoUrl: result.info.secure_url});
                      return {...prev, photoUrl: result.info.secure_url};
                    });
                  }}
                />
              )}
            </div>
            <div>
              <FormInput
                type={'text'}
                title={t('teacher.information.profile.name')}
                value={user?.name}
                disabled={!editActive}
                width={'90%'}
                handler={e => setUser({...user, name: e})}></FormInput>
              <FormInput
                type={'text'}
                title={t('teacher.information.profile.email')}
                value={user?.email}
                disabled={true}
                width={'90%'}
                handler={e => setUser({...user, email: e})}></FormInput>
            </div>
          </div>
          <div className={styles.info__inline}>
            <FormInput
              type={'text'}
              title={t('teacher.information.profile.city')}
              value={user?.city}
              width={'100%'}
              label_classname={'no_margin'}
              disabled={!editActive}
              handler={e => setUser({...user, city: e})}></FormInput>
            <div className={focusToSlack ? styles.bot__focus_slack : ''}>
              <FormInput
                type={'text'}
                title={t('teacher.information.profile.slack')}
                value={user?.slack}
                disabled={!editActive}
                width={'100%'}
                label_classname={'no_margin'}
                placeholder={'slack'}
                handler={e => setUser({...user, slack: e})}></FormInput>
            </div>

            <div className={`${styles.info__item} ${styles.phone__wrapper}`}>
              <span className={styles.phone__label}>{t('teacher.information.profile.phone')}</span>
              <PhoneInput
                label={t('teacher.information.profile.phone')}
                name={'phone'}
                preferredCountries={['ua']}
                placeholder={'+380-(096)-12-34567'}
                required={true}
                value={user?.phone}
                className={styles.phone}
                inputStyle={{height: '45px', borderRadius: '25px', backgroundColor: '#d9d9d9'}}
                buttonStyle={{borderRadius: '25px', borderRight: '0', backgroundColor: '#bdbdbd'}}
                onChange={phone => setUser({...user, phone})}
                disabled={!editActive}
              />
            </div>
            <FormInput
              type={'text'}
              title={t('teacher.information.profile.telegram')}
              value={user?.telegram}
              disabled={!editActive}
              width={'100%'}
              label_classname={'no_margin'}
              placeholder={'@...'}
              handler={e => setUser({...user, telegram: e})}></FormInput>
            <FormInput
              type={'number'}
              title={t('teacher.information.profile.experience')}
              value={user?.expirience}
              disabled={!editActive}
              label_classname={'no_margin'}
              width={'100%'}
              placeholder={0}
              handler={e => setUser({...user, expirience: e})}></FormInput>
            {teacherId && (
              <div className={styles.bot__wrapper}>
                <label className={classNames(styles.input__label, styles.bot__label)}>
                  {t('teacher.information.profile.bots')}
                </label>
                <div className={styles.bot__pictures}>
                  <a
                    className={styles.ul_item_link}
                    href="https://t.me/test_notifications_booking_bot?email=siper@gmail.com"
                    target="_blank"
                    rel="noreferrer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      fill="black"
                      class="bi bi-telegram"
                      viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09" />
                    </svg>
                  </a>

                  <button
                    onClick={() => {
                      if (!user.slack) {
                        setEditActive(true);
                        setFocusToSlack(true);
                      } else {
                        success({text: 'Already integrated!'});
                      }
                    }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      fill="black"
                      class="bi bi-slack"
                      viewBox="0 0 16 16">
                      <path d="M3.362 10.11c0 .926-.756 1.681-1.681 1.681S0 11.036 0 10.111.756 8.43 1.68 8.43h1.682zm.846 0c0-.924.756-1.68 1.681-1.68s1.681.756 1.681 1.68v4.21c0 .924-.756 1.68-1.68 1.68a1.685 1.685 0 0 1-1.682-1.68zM5.89 3.362c-.926 0-1.682-.756-1.682-1.681S4.964 0 5.89 0s1.68.756 1.68 1.68v1.682zm0 .846c.924 0 1.68.756 1.68 1.681S6.814 7.57 5.89 7.57H1.68C.757 7.57 0 6.814 0 5.89c0-.926.756-1.682 1.68-1.682zm6.749 1.682c0-.926.755-1.682 1.68-1.682S16 4.964 16 5.889s-.756 1.681-1.68 1.681h-1.681zm-.848 0c0 .924-.755 1.68-1.68 1.68A1.685 1.685 0 0 1 8.43 5.89V1.68C8.43.757 9.186 0 10.11 0c.926 0 1.681.756 1.681 1.68zm-1.681 6.748c.926 0 1.682.756 1.682 1.681S11.036 16 10.11 16s-1.681-.756-1.681-1.68v-1.682h1.68zm0-.847c-.924 0-1.68-.755-1.68-1.68s.756-1.681 1.68-1.681h4.21c.924 0 1.68.756 1.68 1.68 0 .926-.756 1.681-1.68 1.681z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className={classNames(styles.info__item, styles.info__label)}>
            {t('teacher.information.profile.courses')}{' '}
            <span>{(user?.teachingCourses || []).map(el => el.name).join(', ')}</span>
          </div>
          <div className={styles.info__item}>
            <FormInput
              textArea
              title={t('teacher.information.profile.description')}
              value={user?.description}
              disabled={!editActive}
              handler={e => setUser({...user, description: e})}></FormInput>
          </div>
          {!editActive ? (
            <div className={styles.info__button__wrapper}>
              <EditButton
                onClick={() => {
                  setBackupUser(user);
                  setEditActive(true);
                }}></EditButton>
            </div>
          ) : (
            <div className={styles.info__button__wrapper}>
              <EditButton
                onClick={() => {
                  setEditActive(false);
                  updateUser();
                  setFocusToSlack(false);
                }}
                text={t('buttons.confirm')}></EditButton>
              <DeleteButton
                onClick={() => {
                  setEditActive(false);
                  setUser(backupUser);
                  setFocusToSlack(false);
                }}
                text={t('buttons.cancel')}></DeleteButton>
            </div>
          )}
        </div>
      </div>

      <div className={styles.info__wrapper}>
        <div className={styles.info__container}>
          <TableHeader
            headers={t('teacher.information.table.header', {
              returnObjects: true
            })}></TableHeader>
          <InfoTableBody
            documents={documentType}
            userDocuments={userDocuments}
            setUserDocuments={setUserDocuments}></InfoTableBody>
        </div>
      </div>
    </>
  );
}
