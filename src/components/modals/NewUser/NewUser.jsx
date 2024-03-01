import styles from './NewUser.module.scss';
import Modal from '../../Modal/Modal';
import FormInput from '../../FormInput/FormInput';
import Select from '../../Select/Select';
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
  ...item
}) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(1); // for now one is default teacher
  useEffect(() => {
    setName(item.name);
    setRating(item.rating);
    setEmail(item.email);
    setRole(item.role);
  }, [isOpen]);

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
            userId={item.id}
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
            <Select
              title="Role:"
              request={getRoles}
              setValue={setRole}
              value={role}
              administrator={isAdmin}></Select>
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
