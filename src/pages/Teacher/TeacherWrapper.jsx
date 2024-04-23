import React from 'react';
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
          {
            text: 'Timetable',
            path: id ? `/admin/teacher/calendar/${id}` : path.teacher
          },
          {
            text: 'My subgroups',
            path: id ? `${path.mySubgroups}${id}` : path.mySubgroups
          },
          {
            text: 'Add my subgroup',
            path: id ? `${path.addMySubgroup}${id}` : path.addMySubgroup
          },
          {text: 'Info', path: id ? `${path.info}${id}` : path.info}
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
