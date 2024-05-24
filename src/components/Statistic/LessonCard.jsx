import React from 'react';
import {useNavigate} from 'react-router-dom';

import style from './statistic.module.scss';
import UserAvatar from '../MentorChooser/UserAvatar';
import InfoButton from '../Buttons/Info';
import DeleteButton from '../Buttons/Delete';
import path from '../../helpers/routerPath';
import {useConfirm} from 'material-ui-confirm';
import {deleteOneLesson} from '../../helpers/lessons/lesson';
import {success} from '@pnotify/core';

export default function LessonCard({lesson, setLessons}) {
  const navigate = useNavigate();
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const confirm = useConfirm();

  const handleReplaceClick = () => {
    navigate(`../${path.appointments}`, {
      state: {
        lesson: {
          id: lesson.id,
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
  const handleDelete = async () => {
    confirm({
      description: 'Are you sure you want to delete this lesson?',
      confirmationText: 'delete',
      confirmationButtonProps: {autoFocus: true}
    })
      .then(async () => {
        await deleteOneLesson(lesson.id);
        setLessons(prevLessons => prevLessons.filter(les => les.id !== lesson.id));
        success({delay: 1000, text: 'Deleted successfully!'});
      })
      .catch(e => console.log('no ' + e));
  };
  return (
    <div className={style.card__wrapper}>
      <UserAvatar mentor={lesson.User}></UserAvatar>
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
          Feedback: {lesson?.feedback || 'No feedback yet :('}
        </div>
      </div>
      <div>
        <InfoButton text="Replace" onClick={handleReplaceClick}></InfoButton>
        <DeleteButton onClick={handleDelete}></DeleteButton>
      </div>
    </div>
  );
}
