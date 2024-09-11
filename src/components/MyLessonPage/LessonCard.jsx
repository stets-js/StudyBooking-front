import React from 'react';

import style from '../LessonsPage/statistic.module.scss';
import UserAvatar from '../MentorChooser/UserAvatar';
import InfoButton from '../Buttons/Info';

export default function LessonCard({lesson, onClick}) {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  //
  return (
    <div className={style.card__wrapper}>
      <div className={style.card__text__container}>
        <div className={style.card__leftAlign}>
          <span>Subgroup: {lesson?.SubGroup?.name}</span>
        </div>
        <div className={style.card__leftAlign}>
          <span>Type: {lesson.AppointmentType.name}</span>
        </div>
        <div className={style.card__leftAlign}>
          <span>Replacement: {lesson.ReplacementId ? 'Yes' : 'No'}</span>
        </div>
        <div className={style.card__leftAlign}>
          <span>Course: {lesson?.SubGroup?.Course.name}</span>
        </div>
        <div className={style.card__leftAlign}>
          <span>Topic: {lesson.LessonTopic?.topic || 'No topic yet'}</span>
        </div>
        <div className={style.card__leftAlign}>
          {weekDays[lesson.LessonSchedule.weekDay]}: {lesson.LessonSchedule.startTime} -{' '}
          {lesson.LessonSchedule.endTime}
        </div>
        <div className={style.card__leftAlign}>
          Feedback: {lesson?.Feedback?.report || 'No feedback yet :('}
        </div>
      </div>
      <div>
        <InfoButton
          classname={'fullHeight'}
          text="Write feedback"
          onClick={() => {
            onClick(lesson);
          }}></InfoButton>
      </div>
    </div>
  );
}
