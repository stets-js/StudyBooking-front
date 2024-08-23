import React, {useRef, useState} from 'react';
import {success, error} from '@pnotify/core';
import styles from './Helper.module.scss';
import leftArrow from '../../img/left-arrow.svg';
import UploadLink from './UploadLink';
import {useSelector} from 'react-redux';
import {useLocation} from 'react-router-dom';
import getPathDescription from '../../helpers/paths/getPathDescription';
import SelectPath from './SelectPath';
import {createBugOrIdea} from '../../helpers/bugOrIdea/bugOrIdea';

export default function Form({bugOrIdea = 1, title, describeIt, description, prevStep}) {
  const location = useLocation();
  const userRole = useSelector(state => state.auth.user.role);
  const userId = useSelector(state => state.auth.user.id);
  const userName = useSelector(state => state.auth.user.name);
  const [selectedPath, setSelectedPath] = useState(getPathDescription(location.pathname, userRole));

  //bug is 1 idea is 2
  const [data, setData] = useState({
    type: bugOrIdea === 1 ? 'bug' : 'idea',
    title: null,
    description: null,
    userId: userId,
    links: [],
    selectedPath,
    userName: userName,
    location: location.pathname
  });

  const submit = async () => {
    if (
      (data.type === 'bug' && data.title) ||
      (bugOrIdea === 'idea' && data.title && data.description)
    ) {
      try {
        const res = await createBugOrIdea(data);
        success('success');
      } catch (error) {}
      prevStep();
    } else {
      // error('Заповніть короткий опис');
    }
  };
  return (
    <form>
      <div className={styles.form}>
        <div className={styles.form__title__wrapper}>
          <button
            className={styles.form__back}
            onClick={() => {
              prevStep();
            }}>
            <img src={leftArrow} alt={'<-'} width={32} height={32}></img>
          </button>
          <span className={styles.form__title}> {title}</span>
        </div>

        <div className={styles.form__input__wrapper}>
          <label for="Name" className={styles.form__label}>
            Ваше Ім'я та Прізвище
          </label>
          <input
            id="Name"
            value={data.userName}
            onChange={e =>
              setData(prev => {
                return {...prev, userName: e.target.value};
              })
            }
            className={styles.form__textarea}
          />
        </div>
        <div className={styles.form__input__wrapper}>
          <label for="describeIT" className={styles.form__label}>
            {describeIt}
          </label>
          <textarea
            id="describeIT"
            onChange={e =>
              setData(prev => {
                return {...prev, title: e.target.value};
              })
            }
            required
            className={styles.form__textarea}
          />
        </div>
        {bugOrIdea !== 1 ? (
          <div className={styles.form__input__wrapper}>
            <label for="description" className={styles.form__label}>
              {description}
            </label>
            <textarea
              id="description"
              className={styles.form__textarea}
              required
              onChange={e =>
                setData(prev => {
                  return {...prev, description: e.target.value};
                })
              }
            />
          </div>
        ) : (
          <SelectPath selectedPath={selectedPath} setSelectedPath={setSelectedPath}></SelectPath>
        )}

        <UploadLink data={data} setData={setData}></UploadLink>
        <button className={styles.button} onClick={() => submit()}>
          Відправити
        </button>
      </div>
    </form>
  );
}
