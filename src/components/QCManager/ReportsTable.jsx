import React from 'react';

import TableHeader from '../TableComponent/TableHeader';
import Tbody from './TBody';

export default function ReportsTable({reports}) {
  const headers = ['Course', 'Subgroup', 'Mentor', 'Date', 'Mark', 'Status', 'Action'];

  return (
    <>
      <TableHeader headers={headers}></TableHeader>
      <Tbody reports={reports}></Tbody>
    </>
  );
}
