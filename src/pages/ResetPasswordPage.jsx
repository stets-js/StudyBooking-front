import React, {useEffect, useState} from 'react';
import FormInput from '../components/FormInput/FormInput';
import styles from '../styles/teacher.module.scss';
import {useParams} from 'react-router-dom';
import {resetPassword} from '../helpers/auth/auth';
export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const token = useParams('token').token;
  const handleSubmit = async () => {
    if (newPassword.length > 3) {
      try {
        const res = await resetPassword({newPassword, token});
        // redirect to homePage
      } catch (error) {
        console.log(error);
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
