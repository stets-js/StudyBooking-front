import React from 'react';
import {format} from 'date-fns';

import styles from './slotDetails.module.scss';

const HeaderLinks = ({link, name, start, end}) => {
  return (
    <div className={styles.links__wrapper}>
      <a href={link || '#'}>{name}</a>
      <div className={styles.links__end}>
        {format(start, 'dd.MM.yyyy')} - {format(end, 'dd.MM.yyyy')}
      </div>
    </div>
  );
};

export default HeaderLinks;
