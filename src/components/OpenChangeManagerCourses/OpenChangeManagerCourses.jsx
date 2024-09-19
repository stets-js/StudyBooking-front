import {useTranslation} from 'react-i18next';
import styles from './OpenChangeManagerCourses.module.scss';

const OpenChangeManagerCourses = ({OpenChangeManagerCoursesFunc, curState}) => {
  const {t} = useTranslation('global');

  return (
    <button
      className={styles.input__submit}
      // onClick={OpenChangeManagerCoursesFunc(!curState)}
      onClick={e => {
        e.preventDefault();
        OpenChangeManagerCoursesFunc(!curState);
      }}>
      {t('modals.courses.button')}
    </button>
  );
};

export default OpenChangeManagerCourses;
