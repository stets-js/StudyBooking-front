import React from 'react';
import TableHeader from '../../components/TableComponent/TableHeader';
import TableBody from '../../components/Spreedsheets/Tbody';

const Spreadsheet = () => {
  const headers = ['Назва вигрузки', 'Лінка', 'Діапазон часу', 'Дія'];
  return (
    <div>
      <TableHeader headers={headers}></TableHeader>
      <TableBody></TableBody>
    </div>
  );
};

export default Spreadsheet;
