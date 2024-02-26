import React, {useState, useEffect} from 'react';
import styles from '../../styles/SuperAdminPage.module.scss';
import NewUser from '../../components/modals/NewUser/NewUser';
import {getUsers} from '../../helpers/user/user';
// import { getManagers } from "../../helpers/manager/manager";
import {v4 as uuidv4} from 'uuid';
import {useSelector} from 'react-redux';
import {Fade} from 'react-awesome-reveal';
import {Link} from 'react-router-dom';
import path from './../../helpers/routerPath';
export default function UsersPage() {
  const [isOpen, setIsOpen] = useState(false);
  const userRole = useSelector(state => state.auth.user.role);
  const [title, setTitle] = useState('New User');
  const [admins, setAdmins] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState(0);
  const [rating, setRating] = useState(0);
  const [email, setEmail] = useState('');
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState(0);
  const [needToRender, SetNeedToRender] = useState(true);

  const fetchData = async () => {
    try {
      const res = await getUsers();
      const teachersBuffer = (res.data || []).filter(user => {
        return user.Role ? user.Role.name === 'teacher' : false;
      });
      setTeachers(teachersBuffer);
      setAdmins(res.data.filter(user => (user.Role ? user.Role.name === 'administrator' : false)));
    } catch (error) {}
  };

  const handleClose = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    fetchData();
    SetNeedToRender(false);
  }, [needToRender]);
  return (
    <>
      <div className={styles.main_wrapper}>
        <h3 className={styles.main_title}>Manage users.</h3>
        <div className={styles.main_wrapper2}>
          <div className={styles.wrapper} key={'index1'}>
            <React.Fragment key={1}>
              <div key={'index'}>
                <p className={styles.mini_title}>Administrators</p>

                <ul className={styles.main_wrapper}>
                  {(admins || []).map(item => {
                    return (
                      <Fade cascade triggerOnce duration={300} direction="up" key={item.id}>
                        <li className={styles.ul_items} key={item.name}>
                          <Link className={styles.ul_items_link} target="_self" to={'#'}>
                            {' '}
                            <p className={styles.ul_items_text}>
                              {item.name} ({item.id})
                            </p>
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
              <p className={styles.mini_title}>Teachers</p>

              <ul className={styles.main_wrapper}>
                {(teachers || []).map(item => {
                  return (
                    <Fade cascade triggerOnce duration={300} direction="up" key={item.id}>
                      <li className={styles.ul_items} key={item.name}>
                        <Link
                          className={styles.ul_items_link}
                          target="_self"
                          to={`../teacher/${item.id}`}>
                          <p className={styles.ul_items_text}>
                            {item.name} ({item.id})
                          </p>
                          <button
                            className={styles.ul_items_btn}
                            // data-modal="change-user"
                            onClick={() => {
                              setIsOpen(!isOpen);
                              setTitle(`Edit ${item.name}`);
                              setName(item.name);
                              setRole(item.RoleId);
                              setEmail(item.email);
                              setRating(item.rating);
                              setId(item.id);
                              setEdit(true);

                              // if (!item.role_id) setRole(2);
                              // else {
                              //   setRole(item.role_id);
                              // }
                              // setLogin(item.login);
                              // setSlack(item.slack);
                              // setTeam(item.team);
                            }}
                          />
                        </Link>
                      </li>
                    </Fade>
                  );
                })}
              </ul>
            </div>
          </React.Fragment>
        </div>
      </div>
      {userRole === 'administrator' && (
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
            name={name}
            role={role}
            email={email}
            rating={rating}
            edit={edit}
            id={id}
          />
        </div>
      )}
    </>
  );
}
