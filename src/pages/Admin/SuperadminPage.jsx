import React from 'react';
import styles from '../../styles/SuperAdminPage.module.scss';
import BgWrapper from '../../components/BgWrapper/BgWrapper';
import Header from '../../components/Header/Header';
import path from '../../helpers/routerPath';
import {Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux';

const SuperAdministrator = () => {
  const userRole = useSelector(state => state.auth.user.role);

  return (
    <>
      <Header
        endpoints={[
          {text: 'users', path: path.users},
          {text: 'courses', path: path.courses},
          {text: 'Appointments', path: path.appointments},
          {text: 'Available Table', path: path.avaliableTable},
          {text: 'Потоки', path: path.subgroups}
        ]}
      />
      <section className={styles.main_wrapper}>
        <BgWrapper title={userRole} />
        <Outlet />
      </section>
    </>
  );
};

export default SuperAdministrator;
