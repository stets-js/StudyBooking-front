import React from 'react';
import {useState, useEffect} from 'react';
import {getCourses} from '../../helpers/course/course';
import styles from '../Groups/Groups.module.scss';
import ChangeCourse from '../modals/ChangeCourse/ChangeCourse';
import {Fade} from 'react-awesome-reveal';

export default function Courses({text, isOpenModal, role, filterName}) {
  const [courses, setCorses] = useState([]);
  const [id, setId] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleClose = () => {
    setIsOpen(!isOpen);
  };
  const getCoursesData = async () => {
    const res = await getCourses()
      .then(res => (res.data ? res.data : setErrorMessage('Example error message!')))
      .catch(error => setErrorMessage(error.message));

    setCorses(res);
    return res;
  };
  useEffect(() => {
    getCoursesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isOpenModal]);

  const filteredCourses = courses.filter(element =>
    element.name.toLowerCase().includes(filterName.toLowerCase())
  );
  return (
    <>
      {errorMessage && <p className="error"> {errorMessage} </p>}
      <div className={styles.wrapperCourses}>
        <ChangeCourse
          isOpen={isOpen}
          handleClose={() => handleClose()}
          id={id}
          courseArray={courses}
        />
        <p className={styles.mini_title}>{text}</p>
        {filteredCourses?.length > 0 && (
          <ul className={styles.main_wrapper}>
            <Fade cascade triggerOnce duration={100} direction="up">
              {filteredCourses.map(item => {
                return (
                  <li className={styles.ul_items} key={item.name}>
                    <p className={styles.ul_items_text}>{item.name}</p>
                    {/* <button className={styles.ul_items_btn} onClick={ <ChangeUser
              isOpen={isOpen}
              handleClose={() => handleClose()}
              id={id}
            />}/> */}
                    <button
                      className={styles.ul_items_btn}
                      data-modal="change-user"
                      onClick={() => {
                        setIsOpen(!isOpen);
                        setId(item.id);
                        // setName(item.name);
                      }}
                    />
                  </li>
                );
              })}
            </Fade>
          </ul>
        )}
      </div>
    </>
  );
}
