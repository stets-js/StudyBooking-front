import React from 'react';
import styles from '../../styles/SuperAdminPage.module.scss';
import Header from '../../components/Header/Header';
import path from '../../helpers/routerPath';
import {Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux';

const TeacherWrapper = ({hideLogo = false, hideLogin = false}) => {
  const id = useSelector(state => state.selectedUser.id);
  return (
    <>
      {/* TODO: Remove login box from header in case of teacher!! */}
      <Header
        hideLogo={hideLogo}
        hideLogin={hideLogin}
        endpoints={[
          {text: 'Timetable', path: id ? `/admin/teacher/${id}` : path.teacher},
          {
            text: 'My subgroups',
            path: id ? `${path.mySubgroups}${id}` : path.mySubgroups
          }
        ]}
      />
      <section className={styles.main_wrapper}>
        <Outlet />
      </section>
    </>
  );
};

export default TeacherWrapper;
