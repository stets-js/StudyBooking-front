import React from 'react';
import style from './statistic.module.scss';
import UserAvatar from '../MentorChooser/UserAvatar';
export default function LessonCard({lesson}) {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return (
    <div className={style.card__wrapper}>
      <UserAvatar mentor={lesson.User}></UserAvatar>
      <div className={style.card__text__container}>
        <div className={style.card__topic__container}>
          <span>Topic:</span> <span>{lesson.LessonTopic.topic}</span>
        </div>
        <div className={style.card__schedule}>
          {weekDays[lesson.LessonSchedule.weekDay]}: {lesson.LessonSchedule.startTime} -{' '}
          {lesson.LessonSchedule.endTime}
        </div>

        <div className={style.card__feedback}>Feedback: {lesson.feedback}</div>
      </div>
    </div>
  );
}
