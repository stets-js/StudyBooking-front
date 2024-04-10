import styles from './ChangeManagerCourses.module.scss';
import teacherStyles from '../../../styles/teacher.module.scss';
import Modal from '../../Modal/Modal';
import React, {useState, useEffect} from 'react';
import Switch from 'react-switch';
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
import {getTeacherTypes} from '../../../helpers/teacher/teacher-type';

const ChangeManagerCourses = ({
  isOpen,
  handleClose,
  teacherId,
  filteringCourses,
  setFilteringCourses,
  forFilters = false
}) => {
  const dispatch = useDispatch();
  const courses = useSelector(state => state.courses.courses);
  const teacherCourses = useSelector(state => state.courses.teacherCourses) || [];
  const [teacherTypes, setTeacherTypes] = useState([]);
  const [teacherTypesId, setTeacherTypesId] = useState({tech: null, soft: null});
  const fetchTeacherTypes = async () => {
    const res = await getTeacherTypes();
    setTeacherTypes(res.data);
    if (teacherTypes.length > 0) {
      setTeacherTypesId({
        tech: teacherTypes.filter(type => type.type === 'tech')[0].id,
        soft: teacherTypes.filter(type => type.type === 'soft')[0].id
      });
    }
  };
  useEffect(() => {
    const fetchAllCourses = async () => {
      if (!forFilters) {
        const teachersCrs = await getTeacherCourses(teacherId);
        dispatch(setTeacherCourses(teachersCrs.data));
      }
    };
    fetchAllCourses();
    fetchTeacherTypes();
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
  const handleTeacherTypeChange = async ({element, teacherId, teacherCourse}) => {
    const TeacherTypeId = element ? teacherTypesId['tech'] : teacherTypesId['soft'];
    try {
      await patchTeacherCourse(teacherId, teacherCourse.courseId, {TeacherTypeId});
      dispatch(updateTeacherCourse({...teacherCourse, TeacherTypeId}));
    } catch (error) {}
  };
  if (forFilters && !isOpen) return <></>;
  return (
    <>
      <Modal open={isOpen} onClose={handleClose}>
        <h1 className={styles.title}>Teacher courses</h1>
        <h3 className={styles.managerLinkTitle}>
          {forFilters
            ? `Pick courses for filtering, and close this window
          to apply changes:`
            : 'Choose courses'}
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
                  {!forFilters &&
                    teacherCourses.some(el => {
                      return el.courseId === course.id;
                    }) && (
                      <div className={styles.switch_wrapper}>
                        <Switch
                          checked={teacherCourse?.TeacherTypeId === teacherTypesId['tech']}
                          // checked={flag}
                          className={teacherStyles.remove_svg_switch}
                          // onChange={()=>{setFlag(!flag)}}
                          onChange={element => {
                            handleTeacherTypeChange({element, teacherId, teacherCourse});
                          }}></Switch>
                        <span className={teacherStyles.switch_label}>tech</span>
                      </div>
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
