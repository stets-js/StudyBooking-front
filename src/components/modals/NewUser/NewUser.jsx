import styles from './NewUser.module.scss';
import Modal from '../../Modal/Modal';
import FormInput from '../../FormInput/FormInput';
import Select from 'react-select';
import React, {useEffect, useState} from 'react';
import {postUser, patchUser, deleteUser} from '../../../helpers/user/user';
import {success} from '@pnotify/core';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
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
  item
}) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  // console.log(roles.find(el => el.label === 'teacher'));
  const [role, setRole] = useState(
    // (1);
    roles.find(el => el.label === 'teacher')?.value || 1
  );
  useEffect(() => {
    setName(item.name);
    setCity(item.city);
    setPhone(item.phone);
    setRating(item.rating);
    setEmail(item.email);
    setRole(item.role);
    setPassword('');
  }, [isOpen]);

  useEffect(() => {
    if (!edit) {
      setName('');
      setRating(5);
      setEmail('');
      setPassword('');
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
            type={{type: 'user', additionalType: edit}} // additionalType - delete
            SetNeedToRender={SetNeedToRender}
            requests={{user: edit ? patchUser : postUser, delete: deleteUser, additional: item.id}}
            onSubmit={() => {
              SetNeedToRender(true); // for optimizating my be develop switch case of choosing exactly which one call fetchAdmin/fetchTeacher/fetchSuperAdmin
              handleClose();
            }}
            edit={edit}
            role_id={role}
            name={name}
            role={role}
            email={email}
            password={password}
            rating={rating}
            city={city}
            phone={phone}
            userId={!edit ? undefined : item.id}
            status={{
              successMessage: 'Successfully created user',
              failMessage: 'Failed to create user',
              successMessageDelete: `Deleted user ${item.name}!`
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
              <div className={styles.phone__wrapper}>
                <span className={styles.phone__label}>Phone:</span>
                <PhoneInput
                  label="Phone"
                  name={'phone'}
                  preferredCountries={['ua']}
                  placeholder={'(096)-12-34567'}
                  required={true}
                  value={phone}
                  className={styles.phone}
                  inputStyle={{height: '45px', borderRadius: '25px', backgroundColor: '#d9d9d9'}}
                  buttonStyle={{borderRadius: '25px', borderRight: '0', backgroundColor: '#bdbdbd'}}
                  onChange={phone => setPhone(phone)}
                />
              </div>
              <FormInput
                classname="input__bottom"
                title="City:"
                type="text"
                name="city"
                max={50}
                value={city}
                placeholder="City"
                isRequired={true}
                handler={setCity}
              />
            </div>
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
            {/* {!edit && (
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
            )} */}
            {!edit && (
              <Select
                title="Role:"
                className={styles.selector}
                options={roles}
                required={true}
                value={roles.find(el => el.value === role)}
                key={Math.random() * 1000 - 10}
                placeholder={'Role'}
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
