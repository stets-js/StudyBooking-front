import React from 'react';
import {useState} from 'react';
import styles from '../../styles/SuperAdminPage.module.scss';
import Courses from '../../components/Courses/Courses';
import NewCourses from '../../components/modals/NewCourse/NewCourse';
import FormInput from '../../components/FormInput/FormInput';

const CoursesPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterName, setFilterName] = useState('');

  const handleClose = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.main_wrapper}>
      <div className={`${styles.main_title} ${styles.header_wrapper}`}>Manage courses </div>
      <button
        className={styles.add_btn}
        data-modal="new-user"
        onClick={() => {
          setIsOpen(!isOpen);
        }}>
        New
      </button>
      <NewCourses isOpen={isOpen} handleClose={() => handleClose()} />
      <div className={styles.filter_block}>
        <FormInput
          title={'Сортування за назвою'}
          placeholder={'Назва..'}
          classname={'green'}
          value={filterName}
          handler={setFilterName}></FormInput>
      </div>
      <div className={styles.main_wrapper2}>
        <Courses filterName={filterName} text={'Courses'} isOpenModal={isOpen} />
      </div>
    </div>
  );
};

export default CoursesPage;
