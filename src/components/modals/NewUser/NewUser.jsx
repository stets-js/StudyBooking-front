import styles from './NewUser.module.scss';
import Modal from '../../Modal/Modal';
import FormInput from '../../FormInput/FormInput';
import Select from 'react-select';
import React, {useEffect, useState} from 'react';
import {postUser, patchUser, deleteUser, getUserById} from '../../../helpers/user/user';
import {success} from '@pnotify/core';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Form from '../../Form/Form';
import {forgotPassword} from '../../../helpers/auth/auth';
import {
  addAdmin,
  addMentor,
  addSuperAdmin,
  deleteAdmin,
  deleteMentor,
  deleteSuperAdmin,
  updateAdmin,
  updateMentors,
  updateSuperAdmins
} from '../../../redux/action/usersPage.action';
import {useDispatch} from 'react-redux';
import TeamLeadsBlock from './TeamLeadsBlock';

const NewUser = ({isOpen, handleClose, title = 'New user: ', edit, roles, item}) => {
  const dispatch = useDispatch();
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
  const [teamLeaders, setTeamLeaders] = useState([]);
  useEffect(() => {
    if (!edit) {
      setCity(item.city);
      setPhone(item.phone);
      setRating(item.rating);
      setRole(item.role);
      setName('');
      setRating(5);
      setEmail('');
      setPassword('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, edit]);
  const fetchUserById = async id => {
    const {data} = await getUserById(id);
    if (data) {
      setName(data.name);
      setCity(data.city);
      setPhone(data.phone);
      setRating(data.rating);
      setEmail(data.email);
      setRole(data.role);
      setTeamLeaders(data.MentorTeams);
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
            changeCourses
            requests={{
              user: edit
                ? data => {
                    patchUser(data);
                    dispatch(
                      role === 3
                        ? updateSuperAdmins(data)
                        : role === 2
                        ? updateAdmin(data)
                        : updateMentors(data)
                    );
                  }
                : async data => {
                    const res = await postUser(data);
                    dispatch(
                      role === 3
                        ? addSuperAdmin(res.data.data)
                        : role === 2
                        ? addAdmin(res.data.data)
                        : addMentor(res.data.data)
                    );
                  },
              delete: id => {
                deleteUser(id);
                dispatch(
                  role === 3
                    ? deleteSuperAdmin(id)
                    : role === 2
                    ? deleteAdmin(id)
                    : deleteMentor(id)
                );
              },
              additional: item.id
            }}
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
                  placeholder={'+380-(096)-12-34567'}
                  required={true}
                  value={phone}
                  className={styles.phone}
                  inputStyle={{height: '45px', borderRadius: '25px', backgroundColor: '#d9d9d9'}}
                  buttonStyle={{borderRadius: '25px', borderRight: '0', backgroundColor: '#bdbdbd'}}
                  onChange={phone => setPhone(phone)}
                />
              </div>
              <FormInput
                title="City:"
                type="text"
                name="city"
                value={city}
                placeholder="City"
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
              <TeamLeadsBlock
                teamLeaders={teamLeaders}
                mentorId={item.id}
                updateUser={mentorId => fetchUserById(mentorId)}
              />
            )}
            {edit && (
              <button
                className={styles.forgotPassword}
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
