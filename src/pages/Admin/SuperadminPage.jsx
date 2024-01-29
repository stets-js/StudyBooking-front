import React from 'react';
import styles from './SuperAdminPage.module.scss';
import BgWrapper from '../../components/BgWrapper/BgWrapper';
import Header from '../../components/Header/Header';
import path from '../../helpers/routerPath';
import {Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux';

const SuperAdministrator = () => {
  const userRole = useSelector(state => state.auth.user.role);

  return (
    <>
      <Header endpoints={[{text: 'users', path: path.users}]} />
      <section className={styles.main_wrapper}>
        <BgWrapper title={userRole} />
        <Outlet />
      </section>
    </>
  );
};

export default SuperAdministrator;
