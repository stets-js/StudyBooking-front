import React from 'react';

import TableHeader from '../TableComponent/TableHeader';
import Tbody from './TBody';

export default function ReportsTable({reports, updateData, teacherPage = false, offsetData}) {
  const headers = ['Course', 'Subgroup?', 'Mentor', 'SheetName', 'Mark?', 'Status', 'Action'];
  if (teacherPage) headers.splice(2, 1);
  return (
    <>
      <TableHeader headers={headers}></TableHeader>
      <Tbody
        offsetData={offsetData}
        reports={reports}
        teacherPage={teacherPage}
        updateData={updateData}></Tbody>
    </>
  );
}
