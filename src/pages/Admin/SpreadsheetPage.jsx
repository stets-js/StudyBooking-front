import React from 'react';
import {addBorders, resizeTable, updateTable} from '../../helpers/spreadsheet/spreadsheet';
import {defaults, error, success} from '@pnotify/core';
import styles from '../../styles/teacher.module.scss';

const Spreadsheet = () => {
  const handleClick = async action => {
    try {
      const res = await action();
      console.log(res);
      success({text: `successfully ${res.data.message}`, delay: 1000});
    } catch (e) {
      console.log(e);
      error({text: 'something went wrong :(', delat: 1000});
    }
  };
  return (
    <div>
      <button
        className={`${styles.button} ${styles.button__add}`}
        onClick={() => handleClick(updateTable)}>
        Update list
      </button>
      <button
        className={`${styles.button} ${styles.button__add}`}
        onClick={() => handleClick(resizeTable)}>
        Resize list
      </button>
      <button
        className={`${styles.button} ${styles.button__add}`}
        onClick={() => handleClick(addBorders)}>
        Add borders
      </button>
    </div>
  );
};

export default Spreadsheet;
