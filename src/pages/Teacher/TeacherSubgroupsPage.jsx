import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {useSelector} from 'react-redux';
import {getMentorSubgroups} from '../../helpers/subgroup/subgroup';
import {useParams} from 'react-router-dom';

import styles from '../../styles/teacher.module.scss';
import {getCourses} from '../../helpers/course/course';
import FormInput from '../../components/FormInput/FormInput';
import TableBody from '../../components/TeacherSubgroup/TableBody';
import TableHeader from '../../components/TableComponent/TableHeader';

export default function TeacherSubgroupPage() {
  const [subgroups, setSubgroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const {teacherId} = useParams() || null;
  const [filterName, setFilterName] = useState('');
  const [filterCourse, setFilterCourse] = useState([]);
  const userId = useSelector(state => state.auth.user.id);
  const fetchSubgroups = async () => {
    try {
      const data = await getMentorSubgroups(`mentorId=${teacherId ? teacherId : userId}`);
      setSubgroups(data.data.data);
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
    if (userId || teacherId) {
      fetchSubgroups();
      fetchCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, teacherId]);
  const filteredSubgroups = subgroups.filter(group => {
    return (
      group?.SubGroup.name.toLowerCase().includes(filterName.toLowerCase()) &&
      (filterCourse.length > 0
        ? filterCourse.map(el => el.value).includes(group?.SubGroup.CourseId)
        : true)
    );
  });
  return (
    <>
      <div className={styles.filters}>
        <Select
          className={`${styles.selector} ${styles.selector__filtering} ${styles.filters__item}`}
          isClearable
          value={filterCourse}
          options={courses}
          placeholder="Select course"
          isMulti
          onChange={e => setFilterCourse(e)}
        />
        <div className={`${styles.filters__item}`}>
          <FormInput
            type="text"
            placeholder="Filter by name"
            value={filterName}
            handler={setFilterName}
          />
        </div>
      </div>
      <div>
        <TableHeader
          headers={[
            'Name',
            'Course',
            'Appointer',
            'Description',
            'Schedule',
            'Action'
          ]}></TableHeader>
        <TableBody filteredSubgroups={filteredSubgroups}></TableBody>
      </div>
    </>
  );
}
