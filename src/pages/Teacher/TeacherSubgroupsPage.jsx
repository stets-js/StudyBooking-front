import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {getSubGroups} from '../../helpers/subgroup/subgroup';
import {useSelector} from 'react-redux';
import {format} from 'date-fns';
import styles from '../../styles/teacher.module.scss';
import {getCourses} from '../../helpers/course/course';
import FormInput from '../../components/FormInput/FormInput';
import {useParams} from 'react-router-dom';
export default function TeacherSubgroupPage() {
  const [subgroups, setSubgroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const {teacherId} = useParams() || null;
  const [filterName, setFilterName] = useState('');
  const [filterCourse, setFilterCourse] = useState([]);
  const userId = useSelector(state => state.auth.user.id);
  const fetchSubgroups = async () => {
    try {
      const data = await getSubGroups(`mentorId=${teacherId ? teacherId : userId}`);
      setSubgroups(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(
        res.data.map(course => {
          return {label: course.name, value: course.id};
        })
      );
    } catch (error) {}
  };
  useEffect(() => {
    if (userId) {
      fetchSubgroups();
      fetchCourses();
    }
  }, []);

  const filteredSubgroups = subgroups.filter(group => {
    return (
      group.name.toLowerCase().includes(filterName.toLowerCase()) &&
      (filterCourse.length > 0 ? filterCourse.map(el => el.value).includes(group.CourseId) : true)
    );
  });
  console.log(filterCourse);
  return (
    <>
      <div className={styles.filters}>
        <FormInput
          width={'100%'}
          className={styles.filters__item}
          classname={`green`}
          type="text"
          placeholder="Filter by name"
          value={filterName}
          handler={setFilterName}
        />
        <Select
          className={`${styles.selector} ${styles.selector__filtering} ${styles.filters__item}`}
          isClearable
          value={filterCourse}
          options={courses}
          placeholder="Select course"
          isMulti
          onChange={e => setFilterCourse(e)}
        />
      </div>
      <table className={styles.calendar}>
        <thead className={styles.tableHeader}>
          <tr>
            <th className={`${styles.sticky} ${styles.cell} ${styles.cell__mySubgroup}`}>Name</th>
            <th className={`${styles.sticky} ${styles.cell} ${styles.cell__mySubgroup}`}>Course</th>
            <th className={`${styles.sticky} ${styles.cell} ${styles.cell__mySubgroup}`}>
              Appointer
            </th>

            <th
              className={`${styles.sticky} ${styles.cell} ${styles.cell__mySubgroup} ${styles.cell__mySubgroup__description}`}>
              Descripion
            </th>
            <th className={`${styles.sticky} ${styles.cell} ${styles.cell__mySubgroup}`}>
              Schedule
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredSubgroups.length > 0 &&
            filteredSubgroups.map(group => {
              return (
                <tr key={group.id}>
                  <td className={`${styles.cell} ${styles.cell__mySubgroup}`}>{group.name}</td>
                  <td className={`${styles.cell} ${styles.cell__mySubgroup}`}>
                    {group.Course.name}
                  </td>
                  <td className={`${styles.cell} ${styles.cell__mySubgroup}`}>
                    {group.Admin.name}
                  </td>
                  <td
                    className={`${styles.cell} ${styles.cell__mySubgroup} ${styles.cell__description}`}>
                    {group.description}
                  </td>
                  <td className={`${styles.cell} ${styles.cell__mySubgroup}`}>
                    <p>
                      {format(group.startDate, 'dd.MM.yyyy')} -{' '}
                      {format(group.endDate, 'dd.MM.yyyy')}
                    </p>
                    {group.schedule.replace(',', '\n')}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
}
