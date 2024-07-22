import React from 'react';
import {addBorders, resizeTable, updateTable} from '../../helpers/spreadsheet/spreadsheet';
import {error, success} from '@pnotify/core';
import styles from '../../styles/teacher.module.scss';
import {Link} from 'react-router-dom';
import EditButton from '../../components/Buttons/Edit';
import TableHeader from '../../components/TableComponent/TableHeader';
import TableBody from '../../components/Spreedsheets/Tbody';

const Spreadsheet = () => {
  const handleClick = async action => {
    try {
      const res = await action();
      success({text: `successfully ${res.data.message}`, delay: 1000});
    } catch (e) {
      console.log(e);
      error({text: 'something went wrong :(', delat: 1000});
    }
  };
  const headers = ['Назва вигрузки', 'Лінка', 'Діапазон часу', 'Дія'];
  return (
    <div>
      <TableHeader headers={headers}></TableHeader>
      <TableBody></TableBody>
    </div>
  );
};

export default Spreadsheet;
