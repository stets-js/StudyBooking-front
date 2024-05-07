import React, {useEffect} from 'react';

import styles from '../../styles/SuperAdminPage.module.scss';
import {getUsers} from '../../helpers/user/user';
import {useDispatch, useSelector} from 'react-redux';
import {Fade} from 'react-awesome-reveal';
import {Link} from 'react-router-dom';
import {setAdmins} from '../../redux/action/usersPage.action';

export default function AdminList({setTitle, setEdit, setIsOpen, setItem, title}) {
  const userRole = useSelector(state => state.auth.user.role);
  const admins = useSelector(state => state.usersPage.admins);
  const dispatch = useDispatch();
  const fetchAdmins = async () => {
    try {
      const res = await getUsers(`role=administrator`);
      dispatch(setAdmins(res.data));
    } catch (error) {}
  };

  useEffect(() => {
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.wrapper} key={'index1'}>
      <React.Fragment key={1}>
        <div key={'index'}>
          {title && <p className={styles.mini_title}>Appointers</p>}

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
                            setIsOpen(true);
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
  );
}
