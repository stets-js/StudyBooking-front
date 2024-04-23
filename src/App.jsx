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

const App = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const jwtExp = useSelector(state => state.auth.user.exp);
  const userRole = useSelector(state => state.auth.user.role);
  const token = useSelector(state => state.auth.token);
  const auth = isAuthenticated && jwtExp * 1000 > Date.now() && token;
  if (isAuthenticated && !auth) {
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
                  <Route path={`mySubGroups/:teacherId`} element={<TeacherSubgroupPage />} />
                  <Route path={`addMySubgroup/:teacherId`} element={<AddMySubgroup />} />
                </Route>
                <Route path={path.subgroups} element={<SubGroupPage />} />
                <Route path={path.replacements} element={<ReplacementsPage />} />
              </Route>
            </>
          ) : auth && userRole === 'teacher' ? (
            <>
              <Route path={path.home} element={<Navigate to={`${path.teacher}`} />}></Route>
              <Route path={path.home} element={<TeacherWrapper />}>
                <Route path={path.teacher} element={<TeacherPage />}></Route>
                <Route path={path.addMySubgroup} element={<AddMySubgroup />}></Route>
                <Route path={path.mySubgroups} element={<TeacherSubgroupPage />}></Route>
                <Route path={path.info} element={<Info />}></Route>
              </Route>
            </>
          ) : (
            <>
              <Route path={path.all} element={<Navigate to={path.home} />} />
              <Route path={path.home} element={<HomePage />} />
            </>
          )}
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
