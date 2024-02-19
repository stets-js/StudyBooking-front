import React, {useState} from 'react';
import styles from './LoginBox.module.scss';
import SettingsModal from '../modals/SettingsModal/SettingsModal';
import Login from '../modals/Login/Login';
import SignUp from '../modals/SignUp/SignUp';
import settingsIco from '../../img/icons/settings.png';
import {useDispatch, useSelector} from 'react-redux';
import logout from '../../img/logout.svg';

export default function LoginBox({loggedUser}) {
  const dispatch = useDispatch();
  const {
    isAuthenticated,
    user: {name, role}
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
        {modal === 'login' && <Login isOpen={isOpen} handleClose={() => setIsOpen(!isOpen)} />}
        {modal === 'signup' && <SignUp isOpen={isOpen} handleClose={() => setIsOpen(!isOpen)} />}
        {auth ? (
          <p className={styles.role}>Logged: {name}</p>
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
      {auth && (
        <button
          type="button"
          className={styles.logout}
          onClick={() => {
            localStorage.removeItem('booking');
            dispatch({
              type: 'LOGOUT'
            });
          }}>
          <img src={logout} alt="logout" />
        </button>
      )}
    </div>
  );
}
