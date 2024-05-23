import React from 'react';
import {useNavigate} from 'react-router-dom';

import style from './statistic.module.scss';
import UserAvatar from '../MentorChooser/UserAvatar';
import InfoButton from '../Buttons/Info';
import DeleteButton from '../Buttons/Delete';
import path from '../../helpers/routerPath';

export default function LessonCard({lesson}) {
  const navigate = useNavigate();
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleReplaceClick = () => {
    console.log(lesson);
    navigate(`../${path.appointments}`, {
      state: {
        lesson: {
          date: lesson.date,
          appointmentId: lesson.appointmentTypeId,
          subgroupId: lesson.subgroupId,
          weekDay: lesson.LessonSchedule.weekDay,
          startTime: lesson.LessonSchedule.startTime,
          userId: lesson.mentorId,
          courseId: lesson.SubGroup.CourseId
        }
      }
    });
  };

  return (
    <div className={style.card__wrapper}>
      <UserAvatar mentor={lesson.User}></UserAvatar>
      <div className={style.card__text__container}>
        <div className={style.card__leftAlign}>
          <span>Subgroup: {lesson.SubGroup.name}</span>
        </div>
        <div className={style.card__leftAlign}>
          <span>Replacement: {lesson.replacementId ? 'Yes' : 'No'}</span>
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
      <div>
        <InfoButton text="Replace" onClick={handleReplaceClick}></InfoButton>
        <DeleteButton
          onClick={() => {
            console.log('deleted!');
          }}></DeleteButton>
      </div>
    </div>
  );
}
