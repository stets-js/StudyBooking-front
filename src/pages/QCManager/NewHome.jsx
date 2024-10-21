import React from 'react';
import ManagerList from '../../components/QCManager/ManagersList';
import styles from './manager.module.scss';

export default function NewHome() {
  return (
    <div className={styles.list__wrapper}>
      <ManagerList />
    </div>
  );
}
