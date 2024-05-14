import React, {useState} from 'react';
import styles from './LoginBox.module.scss';
import Login from '../modals/Login/Login';
import SignUp from '../modals/SignUp/SignUp';
import {useDispatch, useSelector} from 'react-redux';
import logout from '../../img/logout.svg';

export default function LoginBox({loggedUser, MIC}) {
  const dispatch = useDispatch();
  const {
    isAuthenticated,
    user: {name}
  } = loggedUser;
  const jwtExp = useSelector(state => state.auth.user.exp);
  const auth = isAuthenticated && jwtExp * 1000 > Date.now();

  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState('');

  return (
    <div className={styles.loginBox}>
      <div
        className={styles.loginBoxWrapper}
        onClick={e => {
          e.target.dataset.modal && setModal(e.target.dataset.modal);
        }}>
        {modal === 'login' && (
          <Login MIC={MIC} isOpen={isOpen} handleClose={() => setIsOpen(!isOpen)} />
        )}
        {modal === 'signup' && <SignUp isOpen={isOpen} handleClose={() => setIsOpen(!isOpen)} />}
        {auth ? (
          <>
            <span className={styles.role}>Logged: {name}</span>
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
