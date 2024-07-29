import React from 'react';
import logo from '../../img/goiteensLOGO.png';
import styles from './Footer.module.scss';
import {useFooterRef} from './FooterProvider';

export default function Footer() {
  const {footerRef} = useFooterRef();
  return (
    <footer ref={footerRef} className={styles['footer']}>
      <div className={styles['footerContentWrapper']}>
        <a
          className={styles['footerLink']}
          href="https://goiteens.ua/"
          rel="noopener noreferrer nofollow"
          target="_blank">
          <img src={logo} alt="logo" className={styles['footerImg']} />
        </a>
        <div className={styles['textWrapper']}>
          <p className={styles['footerEmail']}>example@gmail.com</p>
          <p className={styles['footerPhone']}>+38 011 111 1111</p>
          <div className={styles['infoWrapper']}>
            <span className={styles['infoText']}>© copyright GoITeens 2024</span>
            <span className={styles['infoText']}>privacy policy</span>
            <span className={styles['infoText']}>terms of service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
