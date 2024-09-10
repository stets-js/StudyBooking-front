import React from 'react';
import NewReport from '../../components/QCManager/NewReport';
import {useState} from 'react';
import {getReports} from '../../helpers/manager/qcmanager';
import {useEffect} from 'react';
import ReportsTable from '../../components/QCManager/ReportsTable';
import ImportReports from '../../components/QCManager/ImportReports';

export default function ManagerHome() {
  return (
    <div>
      <ImportReports></ImportReports>
      {/* <NewReport fetchAllReports={fetchAllReports} /> */}
      <ReportsTable></ReportsTable>
    </div>
  );
}
