import React from 'react';

import style from './statistic.module.scss';
import UserAvatar from '../MentorChooser/UserAvatar';

export default function LessonCard({lesson}) {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return (
    <div className={style.card__wrapper}>
      <UserAvatar mentor={lesson.User}></UserAvatar>
      <div className={style.card__text__container}>
        <div className={style.card__leftAlign}>
          <span>Subgroup: {lesson.SubGroup.name}</span>
        </div>
        <div className={style.card__leftAlign}>
          <span>Course: {lesson.SubGroup.Course.name}</span>
        </div>
        <div className={style.card__leftAlign}>
          <span>Topic: {lesson.LessonTopic?.topic || 'No topic yet'}</span>
        </div>
        <div className={style.card__leftAlign}>
          {weekDays[lesson.LessonSchedule.weekDay]}: {lesson.LessonSchedule.startTime} -{' '}
          {lesson.LessonSchedule.endTime}
        </div>
        <div className={style.card__leftAlign}>
          Feedback: {lesson?.feedback || 'No feedback yet :('}
        </div>
      </div>
    </div>
  );
}
