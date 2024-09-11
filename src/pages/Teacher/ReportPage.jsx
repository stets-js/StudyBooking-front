import React, {useEffect, useState} from 'react';

import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import ReportsTable from '../../components/QCManager/ReportsTable';
import {getReports} from '../../helpers/manager/qcmanager';

export default function ReportPage() {
  const [reports, setReports] = useState([]);
  const [offsetData, setOffsetData] = useState({
    total: 0,
    limit: 20,
    offset: 0
  });

  return (
    <>
      <ReportsTable teacherPage></ReportsTable>
    </>
  );
}
