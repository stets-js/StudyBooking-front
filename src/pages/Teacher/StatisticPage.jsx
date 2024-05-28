import React, {useEffect, useState} from 'react';
import {error, success} from '@pnotify/core';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';

export default function StatisticPage() {
  const {teacherId} = useParams() || null;
  let userId = useSelector(state => state.auth.user.id);
  if (teacherId) userId = teacherId; //case when admin is logged in and wants to see another teachers schedule
  const [lessons, setLessons] = useState();
  const fetchData = async () => {};

  return <>Statistic</>;
}
