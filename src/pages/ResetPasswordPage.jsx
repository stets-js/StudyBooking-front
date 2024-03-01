import React, {useEffect, useState} from 'react';
import FormInput from '../components/FormInput/FormInput';
import styles from '../styles/teacher.module.scss';
import {useDispatch} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {resetPassword} from '../helpers/auth/auth';
import {success, error} from '@pnotify/core';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const token = useParams('token').token;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    if (newPassword.length >= 3) {
      try {
        const res = await resetPassword({newPassword, token});
        // redirect to homePage
        if (res) {
          success({text: 'Successfuly changed password', delay: 1000});
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              token: res.token
            }
          });
          navigate('/');
        }
      } catch (e) {
        error({text: 'Something went wrong', delay: 1000});
        console.log(e);
      }
    }
  };
  return (
    <div>
      <h2>Forgot password?</h2>
      <div className={styles.reset_wrapper}>
        <FormInput
          title="New password"
          value={newPassword}
          placeholder={'Start typing'}
          handler={setNewPassword}>
          {' '}
        </FormInput>
        <button
          className={styles.reset_button}
          onClick={() => handleSubmit()}
          disabled={newPassword.length < 3}>
          Reset
        </button>
      </div>
    </div>
  );
}
