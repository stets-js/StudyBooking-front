import React from 'react';
import styles from '../../styles/SuperAdminPage.module.scss';
import BgWrapper from '../../components/BgWrapper/BgWrapper';
import Header from '../../components/Header/Header';
import path from '../../helpers/routerPath';
import {Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

const SuperAdministrator = () => {
  const userRole = useSelector(state => state.auth.user.role);
  const {t} = useTranslation('global');

  return (
    <>
      <Header
        endpoints={[
          {text: t('superAdmin.header.users'), path: path.users},
          {text: t('superAdmin.header.courses'), path: path.courses},
          {text: t('superAdmin.header.lessons'), path: path.lessons},
          {text: t('superAdmin.header.appointment'), path: path.appointments},
          {text: t('superAdmin.header.mentors'), path: path.avaliableTable},
          {text: t('superAdmin.header.subgroups'), path: path.subgroups},
          {text: t('superAdmin.header.replacements'), path: path.replacements},
          {text: 'zoho', path: path.zoho},
          userRole === 'superAdmin'
            ? {text: t('superAdmin.header.spreadsheet'), path: path.spreadsheet}
            : {}
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
