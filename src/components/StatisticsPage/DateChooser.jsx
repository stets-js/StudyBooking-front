import React from 'react';
import styles from './statistics.module.scss';
import classNames from 'classnames';
import FormInput from '../FormInput/FormInput';
import {useTranslation} from 'react-i18next';

export default function DateChooser({dates, setDates}) {
  const {t} = useTranslation('global');

  return (
    <div className={styles.date__wrapper}>
      <div className={styles.date__item}>
        <FormInput
          type="date"
          title={t('teacher.statistics.start')}
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
          title={t('teacher.statistics.end')}
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
