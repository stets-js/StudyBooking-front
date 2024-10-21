import styles from '../Manager.module.scss';
import Modal from '../../Modal/Modal';
import FormInput from '../../FormInput/FormInput';
import React, {useEffect, useState} from 'react';
import {postUser, patchUser, deleteUser, getUserById} from '../../../helpers/user/user';
import {success} from '@pnotify/core';
import 'react-phone-input-2/lib/style.css';
import Form from '../../Form/Form';
import {forgotPassword} from '../../../helpers/auth/auth';

import {useTranslation} from 'react-i18next';

const NewUserQC = ({isOpen, handleClose, title, edit, roles, item, updateList}) => {
  const {t} = useTranslation('global');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const role = 4; // QC manager
  useEffect(() => {
    if (!edit) {
      setName('');
      setEmail('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, edit]);
  const fetchUserById = async id => {
    const {data} = await getUserById(id);
    if (data) {
      setName(data.name);

      setEmail(data.email);
    }
  };
  useEffect(() => {
    if (isOpen && edit) {
      fetchUserById(item.id);
    }
  }, [isOpen, edit]);

  const handlePasswordReset = async () => {
    try {
      await forgotPassword(email);
      success({text: 'email sent successfully!', delay: 1000});
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <Form
            type={{type: 'user', additionalType: edit}} // additionalType - delete
            requests={{
              user: edit
                ? async data => {
                    await patchUser(data);
                    await updateList();
                  }
                : async data => {
                    const res = await postUser(data);
                    await updateList();
                  },
              delete: id => {
                deleteUser(id);
              },
              additional: edit && item.id
            }}
            onSubmit={() => {
              handleClose();
            }}
            edit={edit}
            role_id={role}
            name={name}
            role={role}
            email={email}
            userId={!edit ? undefined : item.id}
            status={{
              successMessage: 'Successfully created user',
              failMessage: 'Failed to create user',
              successMessageDelete: `Deleted user ${item?.name}!`
            }}
            title={title || t('superAdmin.users.addUserModal')}>
            <FormInput
              title={t('superAdmin.users.addUserModal.name') + ':'}
              type="text"
              name="name"
              max={50}
              value={name}
              placeholder={t('superAdmin.users.addUserModal.name')}
              isRequired={true}
              handler={setName}
            />

            <FormInput
              classname="input__bottom"
              title={t('superAdmin.users.addUserModal.email') + ':'}
              type="text"
              name="email"
              max={50}
              value={email}
              placeholder={t('superAdmin.users.addUserModal.email')}
              isRequired={true}
              handler={setEmail}
            />

            {edit && (
              <button
                className={styles.forgotPassword}
                title={t('superAdmin.users.addUserModal.pwd')}
                type="button"
                name="password"
                placeholder={t('superAdmin.users.addUserModal.pwd')}
                isRequired={true}
                onClick={() => {
                  handlePasswordReset();
                }}>
                {t('superAdmin.users.addUserModal.forgotPwd')}
              </button>
            )}
          </Form>
        </Modal>
      )}
    </>
  );
};

export default NewUserQC;
