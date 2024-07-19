import React from 'react';
import NewReport from '../../components/QCManager/NewReport';
import {useState} from 'react';
import {getReports} from '../../helpers/manager/qcmanager';
import {useEffect} from 'react';
import ReportsTable from '../../components/QCManager/ReportsTable';

export default function ManagerHome() {
  const [reports, setReports] = useState([]);

  const fetchAllReports = async () => {
    const data = await getReports();
    setReports(data.data);
  };
  useEffect(() => {
    fetchAllReports();
  }, []);
  return (
    <div>
      <NewReport fetchAllReports={fetchAllReports} />
      <ReportsTable reports={reports} updateData={fetchAllReports}></ReportsTable>
    </div>
  );
}
