import React, {useEffect, useState} from 'react';

import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import ReportsTable from '../../components/QCManager/ReportsTable';
import {getReports} from '../../helpers/manager/qcmanager';

export default function ReportPage() {
  const {teacherId} = useParams() || null;
  let userId = useSelector(state => state.auth.user.id);
  if (teacherId) userId = teacherId; //case when admin is logged in and wants to see another teachers schedule
  const [reports, setReports] = useState([]);

  const fetchAllReports = async () => {
    const data = await getReports('?mentorId=' + userId);

    setReports(data.data);
  };
  useEffect(() => {
    fetchAllReports();
  }, []);
  return (
    <>
      <ReportsTable
        reports={reports}
        teacherPage
        setReports={setReports}
        updateData={fetchAllReports}></ReportsTable>
    </>
  );
}
