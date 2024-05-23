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
          {text: 'Users', path: path.users},
          {text: 'Courses', path: path.courses},
          {text: 'Lessons', path: path.lessons},
          {text: 'Appointment', path: path.appointments},
          {text: 'Available mentors', path: path.avaliableTable},
          {text: 'Subgroups', path: path.subgroups},
          {text: 'Replacements', path: path.replacements},
          userRole === 'superAdmin' ? {text: 'Spreadsheet', path: path.spreadsheet} : {}
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
