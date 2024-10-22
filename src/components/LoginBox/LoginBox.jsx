import React, {useEffect, useState} from 'react';
import styles from './LoginBox.module.scss';
import Login from '../modals/Login/Login';
import SignUp from '../modals/SignUp/SignUp';
import {useDispatch, useSelector} from 'react-redux';
import logout from '../../img/logout.svg';
import {useLocation} from 'react-router-dom';

export default function LoginBox({loggedUser, MIC_flag = false}) {
  const dispatch = useDispatch();
  const {
    isAuthenticated,
    user: {name},
    MIC
  } = loggedUser;
  const jwtExp = useSelector(state => state.auth.user.exp);
  const jwtExpMIC = useSelector(state => state.auth.MIC.exp);
  const auth = isAuthenticated && (jwtExp * 1000 > Date.now() || jwtExpMIC);
  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState('');

  const location = useLocation();
  const [resetActivate, setResetActivate] = useState(location.state?.fromResetPage);
  console.log(resetActivate);
  useEffect(() => {
    if (resetActivate) {
      console.log(321);
      setIsOpen(true);
      setModal('login');
      setResetActivate(false);
    }
  }, [resetActivate]);

  return (
    <div className={styles.loginBox}>
      <div
        className={styles.loginBoxWrapper}
        onClick={e => {
          e.target.dataset.modal && setModal(e.target.dataset.modal);
        }}>
        {modal === 'login' && (
          <Login MIC_flag={MIC_flag} isOpen={isOpen} handleClose={() => setIsOpen(!isOpen)} />
        )}
        {modal === 'signup' && <SignUp isOpen={isOpen} handleClose={() => setIsOpen(!isOpen)} />}
        {auth ? (
          <>
            <span className={styles.role}>Logged: {name || MIC?.name}</span>
            {auth && (
              <button
                type="button"
                className={styles.logout}
                onClick={() => {
                  localStorage.removeItem('booking');
                  dispatch({
                    type: 'LOGOUT'
                  });
                  dispatch({
                    type: 'REMOVE_SELECTED_USER'
                  });
                }}>
                <img src={logout} alt="logout" />
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            data-modal="login"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            className={styles.login}>
            Log in
          </button>
        )}
      </div>
    </div>
  );
}
