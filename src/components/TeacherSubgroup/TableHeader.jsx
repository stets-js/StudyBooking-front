import React from 'react';

import tableStyles from '../../styles/table.module.scss';

export default function TableHeader() {
  const headers = ['Name', 'Course', 'Appointer', 'Description', 'Schedule'];
  return (
    <div className={`${tableStyles.header} ${tableStyles.header__mySubgroup}`}>
      {headers.map(header => {
        return (
          <div
            key={header}
            className={`${tableStyles.cell__header} ${tableStyles.cell__header__mySubgroup}`}>
            {header}
          </div>
        );
      })}
    </div>
  );
}
