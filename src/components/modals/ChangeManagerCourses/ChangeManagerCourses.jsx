import styles from './ChangeManagerCourses.module.scss';
// import teacherStyles from '../../../styles/teacher.module.scss';
import Modal from '../../Modal/Modal';
import React, {useEffect} from 'react';
// import Switch from 'react-switch';
import {RadioButton, RadioGroup} from '@trendmicro/react-radio';

import {
  getTeacherCourses,
  postTeacherCourse,
  deleteTeacherCourse,
  patchTeacherCourse
} from '../../../helpers/course/course';
import {useDispatch, useSelector} from 'react-redux';
import {
  addTeacherCourses,
  setTeacherCourses,
  updateTeacherCourse
} from '../../../redux/action/course.action';
import {useTranslation} from 'react-i18next';

const ChangeManagerCourses = ({
  isOpen,
  handleClose,
  teacherId,
  filteringCourses,
  setFilteringCourses,
  setOffset,
  forFilters = false
}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation('global');

  const courses = useSelector(state => state.courses.courses);
  const teacherCourses = useSelector(state => state.courses.teacherCourses) || [];
  // const [teacherTypes, setTeacherTypes] = useState([]);
  // const [teacherTypesId, setTeacherTypesId] = useState({tech: 2, soft: 1});
  // const fetchTeacherTypes = async () => {
  //   const res = await getTeacherTypes();
  //   setTeacherTypes(res.data);
  //   if (teacherTypes.length > 0) {
  //     setTeacherTypesId({
  //       tech: teacherTypes.filter(type => type.type === 'tech')[0].id,
  //       soft: teacherTypes.filter(type => type.type === 'soft')[0].id
  //     });
  //   }
  // };
  useEffect(() => {
    const fetchAllCourses = async () => {
      if (!forFilters) {
        const teachersCrs = await getTeacherCourses(teacherId);
        dispatch(setTeacherCourses(teachersCrs.data));
      }
    };
    fetchAllCourses();
    // fetchTeacherTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherId, dispatch]);

  const handleCheckboxChange = async (courseId, id) => {
    if (!forFilters) {
      if (teacherCourses.some(el => el.courseId === courseId)) {
        await deleteTeacherCourse(id, courseId);
        dispatch(setTeacherCourses(teacherCourses.filter(el => el.courseId !== courseId)));
      } else {
        const res = await postTeacherCourse(id, courseId);

        dispatch(addTeacherCourses(res.data));
      }
    } else {
      setFilteringCourses(prevCourses => {
        if (prevCourses.includes(courseId)) {
          return prevCourses.filter(el => el !== courseId);
        } else {
          return [...prevCourses, courseId];
        }
      });
    }
  };
  // const [flag, setFlag] = useState(0)
  const handleTeacherTypeChange = async ({teacherId, teacherCourse, TeacherTypeId}) => {
    try {
      await patchTeacherCourse(teacherId, teacherCourse.courseId, {TeacherTypeId});
      dispatch(updateTeacherCourse({...teacherCourse, TeacherTypeId}));
    } catch (error) {}
  };
  if (forFilters && !isOpen) return <></>;
  return (
    <>
      <Modal open={isOpen} onClose={handleClose}>
        <h1 className={styles.title}>{t('modals.courses.title')}</h1>
        <h3 className={styles.managerLinkTitle}>
          {forFilters ? t('modals.courses.action1') : t('modals.courses.action2')}
          {/* Teacher :TODO: make href */}
          {/* <a className={styles.managerLink} href={`/user/${managerInfo.id}/planning`}>
            {managerInfo.name}
          </a> */}
        </h3>
        <div className={styles.coursesBox}>
          {courses.length > 0 &&
            courses.map(course => {
              const teacherCourse = (teacherCourses || []).filter(
                el => el.courseId === course.id
              )[0];
              return (
                <div key={course.id} className={styles.checkBoxDiv}>
                  <div className={styles.checkBoxLabel}>
                    <input
                      className={styles.checkBox}
                      type="checkbox"
                      key={Math.random() * 1000 - 10}
                      checked={
                        !forFilters
                          ? teacherCourse && teacherCourse.courseId
                          : (filteringCourses || []).length > 0 &&
                            filteringCourses.some(el => {
                              return el === course.id;
                            })
                      }
                      onChange={() => handleCheckboxChange(course.id, teacherId)}
                    />
                    {course.name}
                  </div>
                  {!forFilters && teacherCourse && (
                    <>
                      <div className={styles.radio__group}>
                        <RadioGroup
                          name="teacherType"
                          value={String(teacherCourse.TeacherTypeId)}
                          onChange={event => {
                            handleTeacherTypeChange({
                              teacherId,
                              teacherCourse,
                              TeacherTypeId: +event.target.value
                            });
                          }}
                          className={styles.radio__group}>
                          <RadioButton value="1" className={styles.radio__button}>
                            soft
                          </RadioButton>
                          <RadioButton value="2" className={styles.radio__button}>
                            tech
                          </RadioButton>
                          <RadioButton value="3" className={styles.radio__button}>
                            ulti
                          </RadioButton>
                        </RadioGroup>
                        {/* 
                        <span className={teacherStyles.switch_label}>tech</span> */}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
        </div>
        {/* <button className={styles.input__submit} onClick={handleSave}>
          Save
        </button> */}
      </Modal>
    </>
  );
};

export default ChangeManagerCourses;
