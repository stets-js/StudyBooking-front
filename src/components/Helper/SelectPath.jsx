import React, {useEffect} from 'react';
import Select from 'react-select';
import styles from './Helper.module.scss';

import {useSelector} from 'react-redux';
import {useLocation} from 'react-router-dom';
import getPathDescription from '../../helpers/paths/getPathDescription';
import {getOptions} from '../../helpers/paths/getOptions';

export default function SelectPath({selectedPath, setSelectedPath}) {
  //bug is 1 idea is 2

  const location = useLocation();
  const userRole = useSelector(state => state.auth.user.role);
  const options = getOptions(userRole);
  useEffect(() => {
    setSelectedPath(getPathDescription(location.pathname, userRole));
  }, [location]);
  console.log(options);
  console.log(options.filter(el => el.label === selectedPath)[0]);
  return (
    <Select
      className={styles.form__select}
      options={options}
      value={options.filter(el => el.label === selectedPath)[0]}
      onChange={e => setSelectedPath(e.label)}></Select>
  );
}
