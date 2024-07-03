import React, {useState, useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import styles from '../../styles/SuperAdminPage.module.scss';
import {getUsers} from '../../helpers/user/user';
// import { getManagers } from "../../helpers/manager/manager";
import {useDispatch, useSelector} from 'react-redux';
import {Fade} from 'react-awesome-reveal';
import {Link} from 'react-router-dom';
import FormInput from '../../components/FormInput/FormInput';
import {cleanMentors, setMentors} from '../../redux/action/usersPage.action';
import ChangeManagerCourses from '../modals/ChangeManagerCourses/ChangeManagerCourses';

export default function MentorList({setItem, setTitle, setEdit, setIsOpen, title = true}) {
  const [limit] = useState(40);
  const [offset, setOffset] = useState(0);
  const [totalAmount, setTotalAmount] = useState(limit);
  const [reset, setReset] = useState(false);

  const teachers = useSelector(state => state.usersPage.mentors);
  const [filterName, setFilterName] = useState(null);
  const [coursesModal, setCoursesModal] = useState(false);
  const [filterCourses, setFilterCourses] = useState([]);
  const [prevFilterCourses, setPrevFilterCourses] = useState(filterCourses);
  const dispatch = useDispatch();

  const fetchTeachers = async () => {
    try {
      const res = await getUsers(
        // teachersFilter - flag for corner case on backend
        `offset=${reset ? 0 : offset}&limit=${limit}&role=teacher${
          filterName || filterCourses.length > 0 ? '&teachersFilter=true' : ''
        }${filterName ? '&name=' + filterName : ''}${
          filterCourses.length > 0 ? '&courses=' + JSON.stringify(filterCourses) : ''
        }`
      );
      setOffset(res.newOffset);
      setTotalAmount(res.totalCount);
      dispatch(setMentors(res.data));
    } catch (error) {}
  };
  useEffect(() => {
    let timeoutId;
    const fetchDataWithDelay = async () => {
      try {
        setReset(true);
      } catch (error) {
        console.error('Произошла ошибка:', error);
      }
    };

    const delayedFetch = async () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(fetchDataWithDelay, 500);
      // setTeachers([]);
    };
    if (filterName !== null) delayedFetch();
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterName]);

  useEffect(() => {
    if (coursesModal) {
      // before open modal window
      setPrevFilterCourses(filterCourses);
    } else {
      if (JSON.stringify(prevFilterCourses) !== JSON.stringify(filterCourses)) {
        dispatch(cleanMentors());
        setReset(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coursesModal]);

  useEffect(() => {
    if (reset) {
      dispatch(cleanMentors());
      setTotalAmount(0);
      fetchTeachers();
      setReset(false);
    }
  }, [reset]);

  // useEffect(() => {
  //   fetchTeachers();
  // }, []); // initial fetch
  return (
    <>
      <React.Fragment key={2}>
        <div className={styles.wrapper} key={'index1'}>
          {title && <p className={styles.mini_title}>Mentors</p>}

          <ul className={`${styles.main_wrapper} ${styles.filter_wrapper}`}>
            <li className={`${styles.ul_items} ${styles.filter_wrapper}`}>
              <Fade
                style={{marginBottom: '10px'}}
                cascade
                triggerOnce
                duration={300}
                direction="up"
                key={`item.id`}>
                <FormInput
                  type={'text'}
                  placeholder={`Name`}
                  classname={'green'}
                  value={filterName}
                  handler={setFilterName}></FormInput>
                <FormInput
                  value={'Courses'}
                  type={'button'}
                  classname={'green'}
                  handler={() => {
                    setCoursesModal(!coursesModal);
                  }}
                  alignValue={true}></FormInput>
              </Fade>
            </li>

            <InfiniteScroll
              height={'600px'}
              dataLength={10} //This is important field to render the next data
              next={fetchTeachers}
              hasMore={reset || offset + limit <= totalAmount}
              loader={<h4>Loading...</h4>}
              endMessage={<p style={{textAlign: 'center'}}>end</p>}
              scrollableTarget="scroller">
              {(teachers || []).map(item => {
                return (
                  <Fade cascade triggerOnce duration={300} direction="up" key={item.id}>
                    <li className={styles.ul_items} key={item.name}>
                      <Link
                        className={styles.ul_items_link}
                        target="_self"
                        onClick={() => {
                          dispatch({
                            type: 'ADD_SELECTED_USER',
                            payload: {
                              id: item.id
                            }
                          });
                        }}
                        to={`../teacher/calendar/${item.id}`}>
                        <p className={styles.ul_items_text}>
                          {item.name} ({item.id})
                        </p>
                      </Link>
                      <button
                        className={styles.ul_items_btn}
                        // data-modal="change-user"
                        onClick={() => {
                          setIsOpen(true);
                          setTitle(`Edit ${item.name}`);
                          setItem({
                            name: item.name,
                            role: item.RoleId,
                            email: item.email,
                            rating: item.rating,
                            id: item.id,
                            city: item.city,
                            phone: item.phone,
                            teachingType: item.teachingType
                          });
                          setEdit(true);
                        }}
                      />
                    </li>
                  </Fade>
                );
              })}
            </InfiniteScroll>
          </ul>
        </div>
      </React.Fragment>
      <ChangeManagerCourses
        isOpen={coursesModal}
        filteringCourses={filterCourses}
        setFilteringCourses={setFilterCourses}
        forFilters={true}
        handleClose={() => {
          setCoursesModal(!coursesModal);
        }}></ChangeManagerCourses>
    </>
  );
}
