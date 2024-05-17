import React from 'react';
import {useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';

import TeacherTable from '../../components/TeacherTable/TeacherTable';

export default function TeacherPage() {
  const {teacherId} = useParams() || null;
  let userId = useSelector(state => state.auth.user.id);
  let isAdmin = false;
  if (teacherId) {
    userId = teacherId;
    isAdmin = true;
  } //case when admin is logged in and wants to see another teachers schedule
  return <TeacherTable isAdmin={isAdmin} userId={userId}></TeacherTable>;
}
