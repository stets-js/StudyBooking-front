import React from 'react';
import {addBorders, resizeTable, updateTable} from '../../helpers/spreadsheet/spreadsheet';
import {defaults, error, success} from '@pnotify/core';
import styles from '../../styles/teacher.module.scss';
import {Link} from 'react-router-dom';

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
  return (
    <div>
      <h2>
        <Link
          className={styles.ul_items_link}
          target="_self"
          to={
            'https://docs.google.com/spreadsheets/d/1sK-u4d-rjwRZ4MN78ag_o8f2fhUDAgBKdA5XXDMk2YI/edit#gid=0'
          }>
          <p className={styles.ul_items_text}>Spreadsheet link</p>
        </Link>
      </h2>
      <br />
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
