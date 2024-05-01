import React from 'react';
import {addBorders, resizeTable, updateTable} from '../../helpers/spreadsheet/spreadsheet';
import {error, success} from '@pnotify/core';
import styles from '../../styles/teacher.module.scss';
import {Link} from 'react-router-dom';
import EditButton from '../../components/Buttons/Edit';

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
          target="_blank"
          to={
            'https://docs.google.com/spreadsheets/d/1sK-u4d-rjwRZ4MN78ag_o8f2fhUDAgBKdA5XXDMk2YI/edit#gid=0'
          }>
          <p className={styles.ul_items_text}>Spreadsheet link</p>
        </Link>
      </h2>
      <br />
      {[
        {title: 'Update list', func: updateTable},
        {title: 'Resize list', func: resizeTable},
        {title: 'Add borders', func: addBorders}
      ].map(el => {
        return <EditButton onClick={() => handleClick(el.func)} text={el.title}></EditButton>;
      })}
    </div>
  );
};

export default Spreadsheet;
