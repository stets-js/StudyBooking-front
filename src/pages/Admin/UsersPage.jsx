import React, {useState, useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import styles from '../../styles/SuperAdminPage.module.scss';
import NewUser from '../../components/modals/NewUser/NewUser';
import {getRoles, getUsers} from '../../helpers/user/user';
// import { getManagers } from "../../helpers/manager/manager";
import {useDispatch, useSelector} from 'react-redux';
import {Fade} from 'react-awesome-reveal';
import {Link} from 'react-router-dom';
import FormInput from '../../components/FormInput/FormInput';
import ChangeManagerCourses from '../../components/modals/ChangeManagerCourses/ChangeManagerCourses';
import {getCourses} from '../../helpers/course/course';
import {setCourses} from '../../redux/action/course.action';

export default function UsersPage() {
  const [limit] = useState(40);
  const [offset, setOffset] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const userRole = useSelector(state => state.auth.user.role);
  const [title, setTitle] = useState('New User');
  const [admins, setAdmins] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [item, setItem] = useState({});
  const [edit, setEdit] = useState(false);
  const [needToRender, SetNeedToRender] = useState(true);
  const [filterName, setFilterName] = useState('');
  const [coursesModal, setCoursesModal] = useState(false);
  const [filterCourses, setFilterCourses] = useState([]);
  const [prevFilterCourses, setPrevFilterCourses] = useState(filterCourses);
  const [debounceTimer, setDebounceTimer] = useState();
  const [superAdmins, setSuperAdmins] = useState([]);
  const [roles] = useState([
    {label: 'teacher', value: 1},
    {label: 'administrator', value: 2},
    {label: 'superAdmin', value: 3}
  ]);
  const dispatch = useDispatch();

  const updateAllCourses = async () => {
    try {
      const corses = await getCourses();
      dispatch(setCourses(corses.data));
    } catch (error) {}
  };

  const fetchAdmins = async () => {
    try {
      const res = await getUsers(`role=administrator`);

      setAdmins(res.data);
    } catch (error) {}
  };

  const fetchSuperAdmins = async () => {
    try {
      const res = await getUsers(`role=superAdmin`);
      setSuperAdmins(res.data);
    } catch (error) {}
  };

  const fetchTeachers = async () => {
    let tmpOffset = offset;
    try {
      if (JSON.stringify(prevFilterCourses) !== JSON.stringify(filterCourses)) {
        tmpOffset = 0;
        setTeachers([]);
        setPrevFilterCourses(filterCourses);
      }
      const res = await getUsers(
        // teachersFilter - flag for corner case on backend
        `offset=${tmpOffset}&limit=${limit}&role=teacher${
          filterName || filterCourses.length > 0 ? '&teachersFilter=true' : ''
        }${filterName ? '&name=' + filterName : ''}${
          filterCourses.length > 0 ? '&courses=' + JSON.stringify(filterCourses) : ''
        }`
      );
      setOffset(res.newOffset);
      setTotalAmount(res.totalCount);
      setTeachers(prev => [...prev, ...res.data]);
    } catch (error) {}
  };

  const handleClose = () => {
    setItem({});
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    let timeoutId;
    const fetchDataWithDelay = async () => {
      try {
        setOffset(0);
        setTeachers([]);
        const res = await getUsers(
          // teachersFilter - flag for corner case on backend
          `offset=${offset}&limit=${limit}&role=teacher${
            filterName || filterCourses.length > 0 ? '&teachersFilter=true' : ''
          }${filterName ? '&name=' + filterName : ''}${
            filterCourses.length > 0 ? '&courses=' + JSON.stringify(filterCourses) : ''
          }`
        );
        setTeachers(prev => {
          return [...prev, ...res.data];
        });
      } catch (error) {
        console.error('Произошла ошибка:', error);
      }
    };

    const delayedFetch = async () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(fetchDataWithDelay, 500);
      // setTeachers([]);
      await setOffset(0);
    };
    if (filterName !== null) delayedFetch();

    return () => clearTimeout(timeoutId);
  }, [filterName]);

  useEffect(() => {
    if (needToRender) {
      fetchAdmins();
      // fetchTeachers();
      fetchSuperAdmins();
      SetNeedToRender(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needToRender]);

  useEffect(() => {
    if (coursesModal) {
      // before open modal window
      setPrevFilterCourses(filterCourses);
    } else {
      if (JSON.stringify(prevFilterCourses) !== JSON.stringify(filterCourses)) {
        console.log('hdsss');
        setOffset(0);
        setTeachers([]);
        console.log('changed course', offset);
        fetchTeachers();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coursesModal]);

  useEffect(() => {
    try {
      updateAllCourses();
    } catch (error) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className={styles.main_wrapper}>
        <h3 className={styles.main_title}>Manage users</h3>
        {['administrator', 'superAdmin'].includes(userRole) && (
          <div className={styles.new_user}>
            <div className={styles.btn_wrapper}>
              <button
                className={styles.add_btn}
                data-modal="new-user"
                onClick={() => {
                  setIsOpen(!isOpen);
                  setTitle('New User');
                  setEdit(false);
                }}>
                Add new user
              </button>
              <NewUser
                isOpen={isOpen}
                handleClose={() => handleClose()}
                isAdmin={false}
                SetNeedToRender={SetNeedToRender}
                title={title}
                edit={edit}
                item={item}
                roles={roles}
              />
            </div>
          </div>
        )}
        <div className={styles.main_wrapper2}>
          <div className={styles.wrapper} key={'index0'}>
            <React.Fragment key={1}>
              <div key={'index'}>
                <p className={styles.mini_title}>Super admin </p>
                <ul className={styles.main_wrapper}>
                  {(superAdmins || []).map(item => {
                    return (
                      <Fade cascade triggerOnce duration={300} direction="up" key={item.id}>
                        <li className={styles.ul_items} key={item.name}>
                          <Link className={styles.ul_items_link} target="_self" to={'#'}>
                            {' '}
                            <p className={styles.ul_items_text}>
                              {item.name} ({item.id})
                            </p>
                            {userRole === 'superAdmin' && (
                              <button
                                className={styles.ul_items_btn}
                                // data-modal="change-user"
                                onClick={() => {
                                  setIsOpen(!isOpen);
                                  setTitle(`Edit ${item.name}`);

                                  setItem({
                                    name: item.name,
                                    role: item.RoleId,
                                    email: item.email,
                                    rating: item.rating,
                                    id: item.id
                                  });
                                  setEdit(true);
                                }}
                              />
                            )}
                          </Link>
                        </li>
                      </Fade>
                    );
                  })}
                </ul>
              </div>
            </React.Fragment>
          </div>
          <div className={styles.wrapper} key={'index1'}>
            <React.Fragment key={1}>
              <div key={'index'}>
                <p className={styles.mini_title}>Appointers</p>

                <ul className={styles.main_wrapper}>
                  {(admins || []).map(item => {
                    return (
                      <Fade cascade triggerOnce duration={300} direction="up" key={item.id}>
                        <li className={styles.ul_items} key={item.name}>
                          <Link className={styles.ul_items_link} target="_self" to={'#'}>
                            <p className={styles.ul_items_text}>
                              {item.name} ({item.id})
                            </p>

                            {userRole === 'superAdmin' && (
                              <button
                                className={styles.ul_items_btn}
                                // data-modal="change-user"
                                onClick={() => {
                                  setIsOpen(!isOpen);
                                  setTitle(`Edit ${item.name}`);
                                  setItem({
                                    name: item.name,
                                    role: item.RoleId,
                                    email: item.email,
                                    rating: item.rating,
                                    id: item.id
                                  });
                                  setEdit(true);
                                }}
                              />
                            )}
                          </Link>
                        </li>
                      </Fade>
                    );
                  })}
                </ul>
              </div>
            </React.Fragment>
          </div>
          <React.Fragment key={2}>
            <div className={styles.wrapper} key={'index1'}>
              <p className={styles.mini_title}>Mentors</p>

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
                  dataLength={teachers.length} //This is important field to render the next data
                  next={fetchTeachers}
                  hasMore={offset + limit <= totalAmount}
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
                              setIsOpen(!isOpen);
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
        </div>
      </div>

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
