import React, {useState} from 'react';

import styles from '../../styles/SuperAdminPage.module.scss';
import {getUsers} from '../../helpers/user/user';
// import { getManagers } from "../../helpers/manager/manager";
import {Fade} from 'react-awesome-reveal';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {setSuperAdmins} from '../../redux/action/usersPage.action';

export default function SuperAdminList({setIsOpen, setTitle, setItem, setEdit, title = true}) {
  const superAdmins = useSelector(state => state.usersPage.superAdmins);
  const userRole = useSelector(state => state.auth.user.role);
  const dispatch = useDispatch();
  const fetchSuperAdmins = async () => {
    try {
      const res = await getUsers(`role=superAdmin`);
      dispatch(setSuperAdmins(res.data));
    } catch (error) {}
  };
  useState(async () => {
    await fetchSuperAdmins();
  }, []);
  return (
    <div className={styles.wrapper} key={'index0'}>
      <React.Fragment key={1}>
        <div key={'index'}>
          {title && <p className={styles.mini_title}>Super admin </p>}
          <ul className={styles.main_wrapper}>
            {(superAdmins || []).map(item => {
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
