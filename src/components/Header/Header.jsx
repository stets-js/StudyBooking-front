import React from 'react';
import logo from '../../img/goiteensLOGO.png';
import LoginBox from '../LoginBox/LoginBox';
import Navigation from '../Navigation/Navigation';
import styles from './Header.module.scss';
import {useSelector} from 'react-redux';

export default function Header({
  MIC_flag = false,
  endpoints = [],
  user,
  hideLogo,
  hideLogin,
  bottom_padding,
  role = 'admin'
}) {
  const loggedUser = useSelector(state => state.auth);
  return (
    <header className={`${styles.header} ${bottom_padding ? styles.nav_header : ''}`}>
      {!hideLogo && (
        <a
          className={styles['logoLink']}
          href="/"
          rel="noopener noreferrer nofollow"
          target="_self">
          <img src={logo} alt="logo" className={styles['logoImg']} />
        </a>
      )}
      {loggedUser.isAuthenticated && <Navigation role={role} user={user} links={endpoints} />}
      {!hideLogin && <LoginBox loggedUser={loggedUser} MIC_flag={MIC_flag} />}
    </header>
  );
}
