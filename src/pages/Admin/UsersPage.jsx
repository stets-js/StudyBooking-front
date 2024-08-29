import React, {useState, useEffect} from 'react';

import styles from '../../styles/SuperAdminPage.module.scss';
import NewUser from '../../components/modals/NewUser/NewUser';
import {useDispatch, useSelector} from 'react-redux';
import {getCourses} from '../../helpers/course/course';
import {setCourses} from '../../redux/action/course.action';
import SuperAdminList from '../../components/UsersPage/superAdminList';
import AdminList from '../../components/UsersPage/adminList';
import MentorList from '../../components/UsersPage/mentorList';
import InfoButton from '../../components/Buttons/Info';
import { useTranslation } from 'react-i18next';

export default function UsersPage() {
  const { t } = useTranslation('global');
  
  const [isOpen, setIsOpen] = useState(false);
  const userRole = useSelector(state => state.auth.user.role);
  const [title, setTitle] = useState('New User');
  const [item, setItem] = useState({});
  const [edit, setEdit] = useState(false);
  
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

  const handleClose = () => {
    setItem({});
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    try {
      updateAllCourses();
    } catch (error) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [activeList, setActiveList] = useState('superAdmin');
  const [isMobile, setIsMobile] = useState(false);
  const handleListChange = list => {
    setActiveList(list);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div className={styles.main_wrapper}>
        <h3 className={styles.main_title}>{t('usersPage.title')}</h3>
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
                title={title}
                edit={edit}
                item={item}
                roles={roles}
              />
            </div>
          </div>
        )}
        {isMobile ? (
          <>
            <div className={styles.sliderButtons}>
              <InfoButton
                classname={'button__small'}
                onClick={() => handleListChange('superAdmin')}
                text={'Super'}></InfoButton>
              <InfoButton
                classname={'button__small'}
                onClick={() => handleListChange('admin')}
                text={'Appointers'}></InfoButton>
              <InfoButton
                classname={'button__small'}
                onClick={() => handleListChange('mentor')}
                text={'Mentors'}></InfoButton>
            </div>
            <div className={styles.main_wrapper2}>
              {activeList === 'superAdmin' && (
                <SuperAdminList
                  title={false}
                  setIsOpen={setIsOpen}
                  setTitle={setTitle}
                  setItem={setItem}
                  setEdit={setEdit}
                />
              )}
              {activeList === 'admin' && (
                <AdminList
                  title={false}
                  setIsOpen={setIsOpen}
                  setTitle={setTitle}
                  setItem={setItem}
                  setEdit={setEdit}
                />
              )}
              {activeList === 'mentor' && (
                <MentorList
                  title={false}
                  setIsOpen={setIsOpen}
                  setTitle={setTitle}
                  setItem={setItem}
                  setEdit={setEdit}
                />
              )}
            </div>
          </>
        ) : (
          <div className={styles.main_wrapper2}>
            <SuperAdminList
              setIsOpen={setIsOpen}
              setTitle={setTitle}
              setItem={setItem}
              setEdit={setEdit}></SuperAdminList>
            <AdminList
              setIsOpen={setIsOpen}
              setTitle={setTitle}
              setItem={setItem}
              setEdit={setEdit}></AdminList>
            <MentorList
              setIsOpen={setIsOpen}
              setTitle={setTitle}
              setItem={setItem}
              setEdit={setEdit}></MentorList>
          </div>
        )}
      </div>
    </>
  );
}
