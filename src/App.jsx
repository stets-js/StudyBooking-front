import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';

import './styles/App.scss';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

import path from './helpers/routerPath';

import HomePage from './pages/HomePage/HomePage';

import SuperAdministratorPage from './pages/Admin/SuperadminPage';
import UsersPage from './pages/Admin/UsersPage';

import Footer from './components/Footer/Footer';
import {useSelector} from 'react-redux';
import CoursesPage from './pages/Admin/CoursesPage';
import TeacherPage from './pages/Teacher/TeacherPage';
import Appointment from './pages/Admin/AppointmentSelector';
const App = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const userRole = useSelector(state => state.auth.user.role);
  const userId = useSelector(state => state.auth.user.id);
  return (
    <>
      <Routes>
        {isAuthenticated && userRole === 'administrator' ? (
          <>
            <Route path={path.home} element={<Navigate to={`${path.superAdmin}`} />}></Route>

            <Route path={path.superAdmin} element={<Navigate to={path.users} />} />
            <Route path={path.superAdmin} element={<SuperAdministratorPage />}>
              <Route path={path.users} element={<UsersPage />} />
              <Route path={path.courses} element={<CoursesPage />} />
              <Route path={path.appointments} element={<Appointment />} />
            </Route>
          </>
        ) : isAuthenticated && userRole === 'teacher' ? (
          <>
            <Route path={path.home} element={<Navigate to={`${path.teacher}`} />}></Route>
            <Route path={path.teacher} element={<TeacherPage />}></Route>
          </>
        ) : (
          <>
            <Route path={path.all} element={<Navigate to={path.home} />} />
            <Route path={path.home} element={<HomePage />} />
          </>
        )}
      </Routes>

      <Footer />
    </>
  );
};

export default App;
