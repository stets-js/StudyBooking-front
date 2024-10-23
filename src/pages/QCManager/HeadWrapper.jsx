import React from 'react';
import styles from '../../styles/SuperAdminPage.module.scss';
import BgWrapper from '../../components/BgWrapper/BgWrapper';
import Header from '../../components/Header/Header';
import path from '../../helpers/routerPath';
import {Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux';

const HeadWrapper = () => {
  const userRole = useSelector(state => state.auth.user.role);
  return (
    <>
      <Header endpoints={[{text: 'Users', path: path.headQC}]} />
      <section className={styles.main_wrapper}>
        <BgWrapper title={userRole} />
        <Outlet />
      </section>
    </>
  );
};

export default HeadWrapper;
