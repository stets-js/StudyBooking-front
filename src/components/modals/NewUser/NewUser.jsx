import styles from './NewUser.module.scss';
import Modal from '../../Modal/Modal';
import FormInput from '../../FormInput/FormInput';
import Select from '../../Select/Select';
import React, {useEffect, useState} from 'react';
import {getRoles, postUser, patchUser} from '../../../helpers/user/user';

import Form from '../../Form/Form';

const NewUser = ({isOpen, handleClose, isAdmin, title = 'New user: ', edit, ...item}) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  console.log(item);
  useEffect(() => {
    setName(item.name);
    setRating(item.rating);
    setEmail(item.email);
    setRole(item.role);
  }, [item]);
  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <Form
            type={{type: 'user'}}
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
            id={item.id}
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

            <div className={styles.input__block}>
              <FormInput
                classname="input__bottom"
                title="Email:"
                type="email"
                name="email"
                max={50}
                value={email}
                placeholder="Email"
                isRequired={true}
                handler={setEmail}
              />
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
            </div>
            <Select
              title="Role:"
              request={getRoles}
              setValue={setRole}
              value={role}
              administrator={isAdmin}></Select>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default NewUser;
