import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';

import './styles/App.scss';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import {ConfirmProvider} from 'material-ui-confirm';
import path from './helpers/routerPath';

import HomePage from './pages/HomePage/HomePage';

import SuperAdministratorPage from './pages/Admin/SuperadminPage';
import UsersPage from './pages/Admin/UsersPage';

import Footer from './components/Footer/Footer';
import {useDispatch, useSelector} from 'react-redux';
import CoursesPage from './pages/Admin/CoursesPage';
import TeacherPage from './pages/Teacher/TeacherPage';
import Appointment from './pages/Admin/AppointmentSelector';
import AvaliableTable from './pages/Admin/AvaiblePage';
import axios from 'axios';
import Cookies from 'js-cookie';
import SubGroupPage from './pages/Admin/SubGroupPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ReplacementsPage from './pages/Admin/ReplacementPage';
import TeacherWrapper from './pages/Teacher/TeacherWrapper';
import TeacherSubgroupPage from './pages/Teacher/TeacherSubgroupsPage';
import Spreadsheet from './pages/Admin/SpreadsheetPage';
import AddMySubgroup from './pages/Teacher/AddMySubgroup';
import Info from './pages/Teacher/Info';
import MICWrapper from './pages/MIC/MICWrapper';
import MentorsPage from './pages/MIC/MentorsChooser';
import LessonsPage from './pages/Admin/LessonsPage';
import StatisticPage from './pages/Teacher/StatisticPage';
import MyLessonPage from './pages/Teacher/MyLessonPage';
import EditMySubgroup from './pages/Teacher/EditMySubgroup';

const App = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const jwtExp = useSelector(state => state.auth.user.exp);
  const userRole = useSelector(state => state.auth.user.role);
  const MIC_user = useSelector(state => state.auth.MIC);
  const auth = isAuthenticated && (jwtExp * 1000 > Date.now() || MIC_user?.name !== undefined);
  if (isAuthenticated && !auth) {
    console.log('logout :(');
    dispatch({
      type: 'LOGOUT'
    });
    dispatch({
      type: 'REMOVE_SELECTED_USER'
    });
  }
  // useEffect(() => {
  axios.interceptors.request.use(
    function (config) {
      config.headers.Authorization = 'Bearer ' + Cookies.get('token');
      if (MIC_user?.name) {
        config.headers = {...config.headers, mic: true};
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  // }, [token]);
  return (
    <>
      {/* ConfrimProvider just for subGroup confirmation of deleting  */}
      <ConfirmProvider>
        <Routes>
          {auth && ['administrator', 'superAdmin'].includes(userRole) ? (
            //  userRole.toLowerCase().includes('admin')
            // for admin and superAdmin
            <>
              <Route path={path.home} element={<Navigate to={`${path.superAdmin}`} />}></Route>

              <Route path={path.superAdmin} element={<Navigate to={path.users} />} />
              <Route path={path.superAdmin} element={<SuperAdministratorPage />}>
                {userRole === 'superAdmin' && (
                  <Route path={path.spreadsheet} element={<Spreadsheet></Spreadsheet>} />
                )}
                <Route path={path.lessons} element={<LessonsPage />} />
                <Route path={path.users} element={<UsersPage />} />
                <Route path={path.courses} element={<CoursesPage />} />
                <Route path={path.appointments} element={<Appointment />} />
                <Route path={path.avaliableTable} element={<AvaliableTable />} />
                <Route
                  path={path.superAdmin + path.teacher}
                  element={
                    <TeacherWrapper hideLogo={true} hideLogin={true} bottom_padding={true} />
                  }>
                  <Route path={`calendar/:teacherId`} element={<TeacherPage />} />
                  <Route path={`${path.mySubgroups}:teacherId`} element={<TeacherSubgroupPage />} />
                  <Route path={`${path.addMySubgroup}:teacherId`} element={<AddMySubgroup />} />
                  <Route path={`${path.editMySubgroup}:teacherId`} element={<EditMySubgroup />} />
                  <Route path={`${path.info}:teacherId`} element={<Info />} />
                  <Route path={`${path.MyLesson}:teacherId`} element={<MyLessonPage />} />
                  <Route path={`${path.statistics}:teacherId`} element={<StatisticPage />} />
                </Route>
                <Route path={path.subgroups} element={<SubGroupPage />} />
                <Route path={path.replacements} element={<ReplacementsPage />} />
              </Route>
            </>
          ) : auth && userRole === 'teacher' ? (
            <>
              <Route path={path.home} element={<Navigate to={`${path.teacher}`} />}></Route>
              <Route path={path.home} element={<TeacherWrapper />}>
                <Route path={path.teacher} element={<TeacherPage />} />
                <Route path={path.addMySubgroup} element={<AddMySubgroup />} />
                <Route path={path.mySubgroups} element={<TeacherSubgroupPage />} />
                <Route path={path.info} element={<Info />} />
                <Route path={path.statistics} element={<StatisticPage></StatisticPage>} />
                <Route path={path.editMySubgroup} element={<EditMySubgroup />} />
                {/* <Route path={path.MyLesson} element={<MyLessonPage></MyLessonPage>}></Route> */}
              </Route>
            </>
          ) : auth && MIC_user?.name ? (
            <>
              <Route
                path={path.MIC}
                element={<Navigate to={`${path.MIC + path.appointments}`} />}
              />
              <Route path={path.MIC} element={<MICWrapper />}>
                <>
                  <Route path={path.appointments} element={<Appointment MIC_flag />} />
                  <Route path={path.mentors} element={<MentorsPage />} />
                  <Route
                    path={path.MIC + path.teacher}
                    element={
                      <TeacherWrapper mic hideLogo={true} hideLogin={true} bottom_padding={true} />
                    }>
                    <Route path={`calendar/:teacherId`} element={<TeacherPage MIC_flag />} />
                    <Route
                      path={`${path.mySubgroups}:teacherId`}
                      element={<TeacherSubgroupPage />}
                    />
                  </Route>
                </>
              </Route>
            </>
          ) : (
            <>
              <Route path={path.all} element={<Navigate to={path.home} />} />
              <Route path={path.home} element={<HomePage />} />
            </>
          )}

          <Route path={path.MIC} element={<MICWrapper />}>
            {auth && (
              <>
                <Route
                  path={path.appointments}
                  element={<Appointment appointmentFlag={'appointment_MIC'}></Appointment>}></Route>
                <Route path={path.mentors} element={<MentorsPage></MentorsPage>}></Route>
                <Route
                  path={path.MIC + path.teacher}
                  element={
                    <TeacherWrapper mic hideLogo={true} hideLogin={true} bottom_padding={true} />
                  }>
                  <Route path={`calendar/:teacherId`} element={<TeacherPage />} />
                  <Route path={`${path.mySubgroups}:teacherId`} element={<TeacherSubgroupPage />} />
                </Route>
              </>
            )}
          </Route>
          <Route
            path={path.resetPassword}
            element={<ResetPasswordPage></ResetPasswordPage>}></Route>
        </Routes>

        <Footer />
      </ConfirmProvider>
    </>
  );
};

export default App;
