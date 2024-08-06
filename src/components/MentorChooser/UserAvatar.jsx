/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import 'react-tooltip/dist/react-tooltip.css';

import styles from './mentorChooser.module.scss';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';

export default function UserAvatar({mentor}) {
  const dispatch = useDispatch();
  return (
    <div className={styles.card__container__avatar}>
      <img
        loading="lazy"
        src={
          mentor?.photoUrl ||
          'https://res.cloudinary.com/dn4cdsmqr/image/upload/v1721042678/avatars/egknva7gyyvqf2qlkbaj.jpg'
        }
        alt="avatar"
        className={styles.card__avatar}
      />
      <div className={styles.card__container__name}>
        <span>{mentor?.rating}</span>
        <Link
          target="_blank"
          to={`../teacher/calendar/${mentor?.id}`}
          // to={'../appointments'}
          className={styles.card__name__link}
          onClick={() => {
            dispatch({
              type: 'ADD_SELECTED_USER',
              payload: {
                id: mentor.id
              }
            });
          }}>
          <span>{mentor?.name}</span>
        </Link>
      </div>
    </div>
  );
}
