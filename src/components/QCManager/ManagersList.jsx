import React, {useEffect, useState} from 'react';

import styles from '../../styles/SuperAdminPage.module.scss';
import {getUsers} from '../../helpers/user/user';
import {useDispatch, useSelector} from 'react-redux';
import {Fade} from 'react-awesome-reveal';
import {Link} from 'react-router-dom';
import {setAdmins} from '../../redux/action/usersPage.action';
import {useTranslation} from 'react-i18next';
import NewUserQC from './NewUser/NewUser';

export default function ManagerList() {
  const userRole = useSelector(state => state.auth.user.role);
  const admins = useSelector(state => state.usersPage.admins);

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('Create new');
  const [item, setItem] = useState(null);
  const [edit, setEdit] = useState(false);
  const dispatch = useDispatch();

  const fetchManagers = async () => {
    try {
      const res = await getUsers(`role=QC manager`);
      dispatch(setAdmins(res.data));
    } catch (error) {}
  };

  useEffect(() => {
    fetchManagers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {t} = useTranslation('global');

  return (
    <div className={styles.wrapper} key={'index1'}>
      <button
        className={styles.add_btn}
        data-modal="new-user"
        onClick={() => {
          setIsOpen(!isOpen);
          setTitle(t('superAdmin.users.addUserModal.title'));
          setEdit(false);
        }}>
        {t('superAdmin.users.button')}
      </button>
      <React.Fragment key={1}>
        <div key={'index'}>
          {title && <p className={styles.mini_title}>{'Managers'}</p>}

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
                            setEdit(true);
                            setItem({
                              name: item.name,
                              role: item.RoleId,
                              email: item.email,
                              rating: item.rating,
                              id: item.id
                            });
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
      <NewUserQC
        title={title}
        edit={edit}
        item={item}
        isOpen={isOpen}
        updateList={fetchManagers}
        handleClose={() => {
          setIsOpen(false);
        }}
      />
    </div>
  );
}
