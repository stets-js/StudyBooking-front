import React from 'react';
import NewReport from '../../components/QCManager/NewReport';
import {useState} from 'react';
import {getReports} from '../../helpers/manager/qcmanager';
import {useEffect} from 'react';
import ReportsTable from '../../components/QCManager/ReportsTable';
import ImportReports from '../../components/QCManager/ImportReports';

export default function ManagerHome() {
  const [reports, setReports] = useState([]);
  const [offsetData, setOffsetData] = useState({
    total: 0,
    limit: 20,
    offset: 0
  });
  const fetchAllReports = async () => {
    const data = await getReports();
    setReports(data.data);
  };
  useEffect(() => {
    fetchAllReports();
  }, []);
  return (
    <div>
      <ImportReports setReports={setReports}></ImportReports>
      {/* <NewReport fetchAllReports={fetchAllReports} /> */}
      <ReportsTable
        reports={reports}
        offsetData={offsetData}
        updateData={fetchAllReports}></ReportsTable>
    </div>
  );
}
