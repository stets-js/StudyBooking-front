import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {error, success} from '@pnotify/core';

import styles from './Login.module.scss';
import Modal from '../../Modal/Modal';
import FormInput from '../../FormInput/FormInput';
import {loginUser} from '../../../helpers/manager/manager';
import {loginMIC} from '../../../helpers/user/user';
import {forgotPassword} from '../../../helpers/auth/auth';

const root = document.querySelector('#root');

const Login = ({MIC_flag, isOpen, handleClose}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPasswordFlag, setForgotPasswordFlag] = useState(false);
  // const [remember, setRemember] = useState("");

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      if (MIC_flag) {
        const res = await loginMIC({login: email, password});
        console.log(res);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            token: res.data,
            MIC: true
          }
        });
      } else {
        console.log('hello');
        const res = await loginUser({email, password});
        console.log(res);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            token: res
          }
        });
      }
      handleClose();
      setEmail('');
      setPassword('');
    } catch (err) {
      error({delay: 1000, text: err.response.data.message ?? 'Something went wrong'});
    }
  };
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
              title={!MIC_flag ? 'Email:' : 'Login:'}
              type={!MIC_flag ? 'email' : 'login'}
              name={!MIC_flag ? 'email' : 'login'}
              value={email}
              placeholder={!MIC_flag ? 'Email' : 'Login'}
              isRequired={true}
              handler={setEmail}
            />

            {!forgotPasswordFlag && (
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
            )}
            <p>
              <button
                className={styles.forgot}
                onClick={e => {
                  e.preventDefault();
                  setForgotPasswordFlag(!forgotPasswordFlag);
                }}>
                {!forgotPasswordFlag ? 'Забули пароль?' : 'Повернутися'}
              </button>
            </p>
            {!forgotPasswordFlag ? (
              <button
                type="submit"
                onClick={e => {
                  handleSubmit(e);
                  document.body.style.overflow = 'auto';
                  root.style.overflow = 'auto';
                }}
                className={styles.login}>
                Log in
              </button>
            ) : (
              <button
                onClick={e => {
                  e.preventDefault();
                  forgotPassword(email);
                  success({text: 'Лист був відправлений на пошту!'});
                  setForgotPasswordFlag(!forgotPasswordFlag);
                }}
                className={styles.login}>
                Reset password
              </button>
            )}
          </form>
        </Modal>
      )}
    </>
  );
};

export default Login;
