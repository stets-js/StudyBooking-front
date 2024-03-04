import styles from './NewUser.module.scss';
import Modal from '../../Modal/Modal';
import FormInput from '../../FormInput/FormInput';
import Select from 'react-select';
import React, {useEffect, useState} from 'react';
import {getRoles, postUser, patchUser} from '../../../helpers/user/user';
import {defaults, error, success} from '@pnotify/core';

import Form from '../../Form/Form';
import {forgotPassword} from '../../../helpers/auth/auth';

const NewUser = ({
  isOpen,
  handleClose,
  isAdmin,
  title = 'New user: ',
  edit,
  SetNeedToRender,
  roles,
  ...item
}) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // console.log(roles.find(el => el.label === 'teacher'));
  const [role, setRole] = useState(
    // (1);
    roles.find(el => el.label === 'teacher')?.value || 1
  );
  useEffect(() => {
    setName(item.name);
    setRating(item.rating);
    setEmail(item.email);
    setRole(item.role);
  }, [isOpen]);

  useEffect(() => {
    if (!edit) {
      setName('');
      setRating(0);
      setEmail('');
    }
  }, [edit]);
  const handlePasswordReset = async () => {
    try {
      const res = await forgotPassword(email);
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
            type={{type: 'user'}}
            SetNeedToRender={SetNeedToRender}
            requests={{user: edit ? patchUser : postUser}}
            onSubmit={() => {
              handleClose();
            }}
            edit={edit}
            role_id={role}
            name={name}
            role={role}
            email={email}
            password={password}
            rating={rating}
            userId={!edit ? undefined : item.id}
            status={{
              successMessage: 'Successfully created user',
              failMessage: 'Failed to create user'
            }}
            title={title}>
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
              title="Rating:"
              type="text"
              name="rating"
              max={50}
              value={rating}
              placeholder="Rating"
              isRequired={true}
              handler={setRating}
            />

            <FormInput
              classname="input__bottom"
              title="Email:"
              type="text"
              name="email"
              max={50}
              value={email}
              placeholder="Email"
              isRequired={true}
              handler={setEmail}
            />
            {!edit && (
              <FormInput
                classname="input__bottom"
                title="Password:"
                type="password"
                name="password"
                max={50}
                value={password}
                placeholder="Password"
                isRequired={true}
                handler={setPassword}
              />
            )}
            {!edit && (
              <Select
                title="Role:"
                className={styles.selector}
                options={roles}
                value={roles.find(el => el.value === role)}
                key={Math.random() * 1000 - 10}
                onChange={el => setRole(el.value)}></Select>
            )}
            {edit && (
              <button
                className={`${styles.input__block} ${styles.forgotPassword}`}
                title="Password:"
                type="button"
                name="password"
                placeholder="Password"
                isRequired={true}
                onClick={() => {
                  handlePasswordReset();
                }}>
                Forgot password
              </button>
            )}
          </Form>
        </Modal>
      )}
    </>
  );
};

export default NewUser;
