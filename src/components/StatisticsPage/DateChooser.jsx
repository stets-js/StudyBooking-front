import React from 'react';
import styles from './statistics.module.scss';
import classNames from 'classnames';
import FormInput from '../FormInput/FormInput';

export default function DateChooser({dates, setDates}) {
  return (
    <div className={styles.date__wrapper}>
      <div className={styles.date__item}>
        <FormInput
          type="date"
          title={'Start'}
          value={dates.start}
          handler={e => {
            setDates(prev => {
              return {...prev, start: e};
            });
          }}></FormInput>
      </div>
      <div className={styles.date__item}>
        <FormInput
          type="date"
          title={'End'}
          value={dates.end}
          handler={e => {
            setDates(prev => {
              return {...prev, end: e};
            });
          }}></FormInput>
      </div>
    </div>
  );
}
