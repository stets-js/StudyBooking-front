import React, {useEffect, useState} from 'react';
import {getUsers} from '../../helpers/user/user';
import MentorCard from '../../components/MentorChooser/MentorCard';
import FilteringBlock from '../../components/MentorChooser/FilteringBlock';

export default function MentorsPage() {
  // Page for MICs view of mentors
  const [mentors, setMentors] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterCourses, setFilterCourses] = useState([]);
  const fetchTeachers = async () => {
    try {
      const res = await getUsers(
        // teachersFilter - flag for corner case on backend
        `role=teacher&courses=[]${
          filterName || filterCourses.length > 0 ? '&teachersFilter=true' : ''
        }${filterName ? '&name=' + filterName : ''}${
          filterCourses.length > 0 ? '&courses=' + JSON.stringify(filterCourses) : ''
        }
        `
      ); // courses=[] - for getting courses that mentors can teach
      setMentors(res.data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchTeachers();
  }, []);
  if (mentors.length === 0) {
    return <>Loading</>;
  }
  return (
    <>
      <FilteringBlock></FilteringBlock>
      {mentors.map((mentor, index) => {
        if (index > 20) return <></>;
        return <MentorCard mentor={mentor}></MentorCard>;
      })}
    </>
  );
}
