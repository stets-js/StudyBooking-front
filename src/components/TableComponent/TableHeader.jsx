import React from 'react';

import tableStyles from '../../styles/table.module.scss';
import classNames from 'classnames';

export default function TableHeader({headers}) {
  return (
    <div className={`${tableStyles.header} ${tableStyles.header__mySubgroup}`}>
      {headers.map(header => {
        return (
          <div
            key={header}
            className={classNames(tableStyles.cell__header, tableStyles.cell__header__mySubgroup)}>
            {header}
          </div>
        );
      })}
    </div>
  );
}
