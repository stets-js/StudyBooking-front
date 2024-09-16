import React from 'react';
import styles from './Manager.module.scss';
import TableHeader from '../TableComponent/TableHeader';
import Tbody from './TBody';

export default function ReportsTable({teacherPage = false}) {
  const headers = ['Course', 'Subgroup?', 'Mentor', 'SheetName', 'Mark?', 'Status', 'Action'];
  if (teacherPage) headers.splice(2, 1);
  return (
    <>
      <TableHeader headers={headers}></TableHeader>
      <Tbody teacherPage={teacherPage}></Tbody>
    </>
  );
}
