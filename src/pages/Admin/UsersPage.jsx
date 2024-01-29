import React, {useState, useEffect} from 'react';
import styles from './SuperAdminPage.module.scss';
import NewUser from '../../components/modals/NewUser/NewUser';
import {getUsers} from '../../helpers/user/user';
// import { getManagers } from "../../helpers/manager/manager";
import {v4 as uuidv4} from 'uuid';
import {useSelector} from 'react-redux';
import {Fade} from 'react-awesome-reveal';
import {Link} from 'react-router-dom';

export default function UsersPage() {
  const [isOpen, setIsOpen] = useState(false);
  const userRole = useSelector(state => state.auth.user.role);

  const [data, setData] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const fetchData = async () => {
    const res = await getUsers();
    const teachersBuffer = res.data.filter(user => {
      return user.Role ? user.Role.name === 'teacher' : false;
    });
    setTeachers(teachersBuffer);
    setAdmins(res.data.filter(user => (user.Role ? user.Role.name === 'administrator' : false)));
  };
  const usersArray = [
    {
      text: 'Administrators',
      role: 'Administrator',
      roleId: 3,
      isAdmin: false,
      isManager: false
    }
  ];

  const handleClose = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <h3 className={styles.main_title}>Manage users.</h3>
      <div className={styles.main_wrapper2}>
        {usersArray.map((item, index) => {
          const key = uuidv4();
          return (
            <React.Fragment key={key}>
              <div className={styles.wrapper} key={index}>
                <p className={styles.mini_title}>Administrators</p>

                <ul className={styles.main_wrapper}>
                  {admins.map(item => {
                    return (
                      <Fade cascade triggerOnce duration={300} direction="up" key={item.id}>
                        <li className={styles.ul_items} key={item.name}>
                          <p className={styles.ul_items_text}>
                            {item.name} ({item.id})
                          </p>
                        </li>
                      </Fade>
                    );
                  })}
                </ul>
              </div>
              <div className={styles.wrapper} key={index}>
                <p className={styles.mini_title}>Teachers</p>

                <ul className={styles.main_wrapper}>
                  {teachers.map(item => {
                    return (
                      <Fade cascade triggerOnce duration={300} direction="up" key={item.id}>
                        <li className={styles.ul_items} key={item.name}>
                          <p className={styles.ul_items_text}>
                            {item.name} ({item.id})
                          </p>
                        </li>
                      </Fade>
                    );
                  })}
                </ul>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      {userRole === 'administrator' && (
        <div className={styles.btn_wrapper}>
          <button
            className={styles.add_btn}
            data-modal="new-user"
            onClick={() => {
              setIsOpen(!isOpen);
            }}>
            Add new administrator +
          </button>
          <NewUser isOpen={isOpen} handleClose={() => handleClose()} isAdmin={false} />
        </div>
      )}
    </>
  );
}
