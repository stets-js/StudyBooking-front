import React from 'react';
import NewReport from '../../components/QCManager/NewReport';
import {useState} from 'react';
import {getReports} from '../../helpers/manager/qcmanager';
import {useEffect} from 'react';
import ReportsTable from '../../components/QCManager/ReportsTable';
import ImportReports from '../../components/QCManager/ImportReports';

export default function ManagerHome() {
  const [needToUpdate, setNeedToUpdate] = useState(false);
  return (
    <div>
      <ImportReports update={() => setNeedToUpdate(true)}></ImportReports>
      {/* <NewReport fetchAllReports={fetchAllReports} /> */}
      <ReportsTable needToUpdate={needToUpdate} setNeedToUpdate={setNeedToUpdate}></ReportsTable>
    </div>
  );
}
