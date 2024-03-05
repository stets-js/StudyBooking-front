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
          {text: 'Користувачі', path: path.users},
          {text: 'Курси', path: path.courses},
          {text: 'Призначення', path: path.appointments},
          {text: 'Доступні ментори', path: path.avaliableTable},
          {text: 'Потоки', path: path.subgroups},
          {text: 'Заміни', path: path.replacements}
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
