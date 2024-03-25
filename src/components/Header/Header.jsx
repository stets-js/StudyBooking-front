import React from 'react';
import logo from '../../img/goiteensLOGO.png';
import LoginBox from '../LoginBox/LoginBox';
import Navigation from '../Navigation/Navigation';
import styles from './Header.module.scss';
import {useSelector} from 'react-redux';

export default function Header({endpoints = [], user, hideLogo, hideLogin}) {
  const loggedUser = useSelector(state => state.auth);
  return (
    <header className={styles.header}>
      {!hideLogo && (
        <a
          className={styles['logoLink']}
          href="/"
          rel="noopener noreferrer nofollow"
          target="_self">
          <img src={logo} alt="logo" className={styles['logoImg']} />
        </a>
      )}
      <Navigation user={user} links={endpoints} />
      {!hideLogin && <LoginBox loggedUser={loggedUser} />}
    </header>
  );
}
