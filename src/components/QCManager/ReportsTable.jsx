import React from 'react';

import TableHeader from '../TableComponent/TableHeader';
import Tbody from './TBody';

export default function ReportsTable({reports, updateData, teacherPage = false}) {
  const headers = ['Course', 'Subgroup', 'Mentor', 'Date', 'Mark', 'Status', 'Action'];
  if (teacherPage) headers.splice(2, 1);
  return (
    <>
      <TableHeader headers={headers}></TableHeader>
      <Tbody reports={reports} teacherPage={teacherPage} updateData={updateData}></Tbody>
    </>
  );
}
