/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import 'react-tooltip/dist/react-tooltip.css';
import {Tooltip} from 'react-tooltip';

import styles from './mentorChooser.module.scss';
import UserAvatar from './UserAvatar';
export default function MentorCard({mentor}) {
  const teacherCourses = mentor?.teachingCourses;
  return (
    <div className={styles.card__container}>
      <UserAvatar mentor={mentor}></UserAvatar>
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
