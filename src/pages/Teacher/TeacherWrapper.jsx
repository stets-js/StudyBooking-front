import React from 'react';
import Header from '../../components/Header/Header';
import path from '../../helpers/routerPath';
import {Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux';

const TeacherWrapper = ({
  hideLogo = false,
  hideLogin = false,
  bottom_padding = false,
  mic = false
}) => {
  const id = useSelector(state => state.selectedUser.id);
  let endpoints = [
    {
      text: 'Timetable',
      path: id || mic ? `/${mic ? 'mic' : 'admin'}/teacher/calendar/${id}` : path.teacher
    },
    {
      text: 'My subgroups',
      path: id ? `${path.mySubgroups}${id}` : path.mySubgroups
    }
  ];
  if (!mic) {
    endpoints.push(
      {
        text: 'Add my subgroup',
        path: id ? `${path.addMySubgroup}${id}` : path.addMySubgroup
      },
      {text: 'Information', path: id ? `${path.info}${id}` : path.info},
      {text: 'Statistics', path: id ? `${path.statistics}${id}` : path.statistics},
      {text: 'Lessons', path: id ? `${path.MyLesson}${id}` : path.MyLesson}
    );
  }

  if (id) {
    endpoints.push({text: 'Reports', path: id ? `${path.report}${id}` : path.report});
  }
  return (
    <>
      <Header
        hideLogo={hideLogo}
        hideLogin={hideLogin}
        endpoints={endpoints}
        bottom_padding={bottom_padding}
      />
      <section>
        <Outlet />
      </section>
    </>
  );
};

export default TeacherWrapper;
