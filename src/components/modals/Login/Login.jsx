import styles from './Login.module.scss';
import Modal from '../../Modal/Modal';
import FormInput from '../../FormInput/FormInput';
import React, {useState} from 'react';
import {loginUser} from '../../../helpers/manager/manager';
import {useDispatch} from 'react-redux';
import {error} from '@pnotify/core';
import {loginMIC} from '../../../helpers/user/user';

const Login = ({MIC, isOpen, handleClose}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [remember, setRemember] = useState("");

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      if (MIC) {
        const res = await loginMIC({login: email, password});
        console.log(res);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            token: {...res, MIC: true}
          }
        });
      } else {
        const res = await loginUser({email, password});
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            token: res
          }
        });
        handleClose();
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      console.log(err);
      error(err);
    }
  };
  console.log(MIC);
  return (
    <>
      {isOpen && (
        <Modal
          open={isOpen}
          onClose={handleClose}
          classname_wrapper={'login__wrapper'}
          classname_box={'login__box'}>
          <h3 className={styles.title}>Log In</h3>
          <form>
            <FormInput
              classname={styles.title}
              title={!MIC ? 'Email:' : 'Login:'}
              type={!MIC ? 'email:' : 'login:'}
              name={!MIC ? 'email:' : 'login:'}
              value={email}
              placeholder={!MIC ? 'Email:' : 'Login:'}
              isRequired={true}
              handler={setEmail}
            />

            <FormInput
              title="Password:"
              type="password"
              name="password"
              value={password}
              min={5}
              placeholder="Password"
              isRequired={true}
              handler={setPassword}
            />

            <button
              type="submit"
              onClick={e => {
                handleSubmit(e);
              }}
              className={styles.login}>
              Log in
            </button>
          </form>
        </Modal>
      )}
    </>
  );
};

export default Login;
