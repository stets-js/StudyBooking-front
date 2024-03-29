import React from 'react';
import styles from '../../styles/SuperAdminPage.module.scss';
import teacherStyles from '../../styles/teacher.module.scss';
import Header from '../../components/Header/Header';
import path from '../../helpers/routerPath';
import {Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux';

const TeacherWrapper = ({hideLogo = false, hideLogin = false, bottom_padding = false}) => {
  const id = useSelector(state => state.selectedUser.id);
  return (
    <>
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
        bottom_padding={bottom_padding}
      />
      <section>
        <Outlet />
      </section>
    </>
  );
};

export default TeacherWrapper;
