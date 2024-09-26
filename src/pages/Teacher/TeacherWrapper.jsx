import React from 'react';
import Header from '../../components/Header/Header';
import path from '../../helpers/routerPath';
import {Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

const TeacherWrapper = ({
  hideLogo = false,
  hideLogin = false,
  bottom_padding = false,
  mic = false
}) => {
  const {t} = useTranslation('global');

  const id = useSelector(state => state.selectedUser.id);
  let endpoints = [
    {
      text: t('teacher.header.timetable'),
      path: id || mic ? `/${mic ? 'mic' : 'admin'}/teacher/calendar/${id}` : path.teacher
    },
    {
      text: t('teacher.header.mySubgroups'),
      path: id ? `${path.mySubgroups}${id}` : path.mySubgroups
    }
  ];
  if (!mic) {
    endpoints.push(
      {
        text: t('teacher.header.addMySubgroup'),
        path: id ? `${path.addMySubgroup}${id}` : path.addMySubgroup
      },
      {text: t('teacher.header.information'), path: id ? `${path.info}${id}` : path.info},
      {text: t('teacher.header.statistics'), path: id ? `${path.statistics}${id}` : path.statistics}
    );
  }

  if (id) {
    //admins only
    endpoints.push(
      {text: t('teacher.header.reports'), path: id ? `${path.report}${id}` : path.report},
      {text: t('teacher.header.lessons'), path: id ? `${path.MyLesson}${id}` : path.MyLesson}
    );
  }
  return (
    <>
      <Header
        role="mentor"
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
