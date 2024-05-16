/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import 'react-tooltip/dist/react-tooltip.css';
import {Tooltip} from 'react-tooltip';

import styles from './mentorChooser.module.scss';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';

export default function MentorCard({mentor}) {
  const dispatch = useDispatch();
  const teacherCourses = mentor?.teachingCourses;
  return (
    <div className={styles.card__container}>
      <div className={styles.card__container__avatar}>
        <img
          src={
            mentor.photoUrl ||
            'https://res.cloudinary.com/hzxyensd5/image/upload/v1715070791/jgxfj4poa4f8goi2toaq.jpg'
          }
          alt="avatar"
          className={styles.card__avatar}
        />
        <div className={styles.card__container__name}>
          <span>{mentor.rating}</span>
          <Link
            target="_blank"
            to={`../teacher/calendar/${mentor.id}`}
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
            <span>{mentor.name}</span>
          </Link>
        </div>
      </div>
      <div className={styles.card__container__description}>
        <span>
          <b>Локація:</b> {mentor.city}
        </span>
        <span>
          <b>Стаж (років):</b> {mentor?.expirience}
        </span>
        <div>
          <span>
            <b>Викладає курси: </b>
          </span>
          {teacherCourses.map((course, index) => {
            return (
              <span>
                <a
                  key="tooltip-link"
                  data-tooltip-id={mentor.id + course.shortening}
                  data-tooltip-place="bottom">
                  <span key="tooltip-icon"> {course.shortening}</span>
                </a>
                <Tooltip id={course.shortening}>{course.name}</Tooltip>

                {index !== teacherCourses.length - 1 ? ', ' : ''}
              </span>
            );
          })}
        </div>
        <p className={styles.card__description}>
          <b>Опис: </b>
          {!mentor.description
            ? 'Ops, description is not fullfilled :('
            : (mentor.description || '').slice(0, 200)}
        </p>
      </div>
    </div>
  );
}
