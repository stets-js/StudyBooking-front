import React, {useEffect, useState} from 'react';
import {getUsers} from '../../helpers/user/user';
import MentorCard from '../../components/MentorChooser/MentorCard';
import FilteringBlock from '../../components/MentorChooser/FilteringBlock';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function MentorsPage() {
  // Page for MICs view of mentors
  const [mentors, setMentors] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterCourse, setFilterCourse] = useState({});
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [reset, setReset] = useState(false);
  const fetchTeachers = async () => {
    try {
      if (reset) {
        await setMentors([]);
        await setOffset(0);
        await setTotalAmount(0);
      }
      const res = await getUsers(
        // teachersFilter - flag for corner case on backend
        `onlyIndiv=true&limit=${limit}&offset=${reset ? 0 : offset}&role=teacher${
          filterName || filterCourse.value ? '&teachersFilter=true' : ''
        }${filterName ? '&name=' + filterName : ''}${
          filterCourse?.value ? '&courses=' + JSON.stringify([filterCourse.value]) : '&courses=[]'
        }
        `
      ); // courses=[] - for getting courses that mentors can teach
      setMentors(prev => [...prev, ...res.data]);
      setTotalAmount(res.totalCount);
      setOffset(res.newOffset);
    } catch (error) {}
  };
  useEffect(() => {
    if (reset) {
      fetchTeachers();
      setReset(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  return (
    <>
      <FilteringBlock
        filterName={filterName}
        setFilterName={setFilterName}
        setFilterCourse={setFilterCourse}
        setReset={setReset}></FilteringBlock>
      <InfiniteScroll
        dataLength={mentors.length} //This is important field to render the next data
        next={fetchTeachers}
        hasMore={offset + limit <= totalAmount}
        loader={<h4>Loading...</h4>}
        endMessage={<p style={{textAlign: 'center'}}>end</p>}>
        {mentors.map(mentor => {
          return <MentorCard mentor={mentor}></MentorCard>;
        })}
      </InfiniteScroll>
    </>
  );
}
