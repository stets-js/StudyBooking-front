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
  const translateAppointmentTypeName = name => {
    switch (name) {
      case 'universal':
        return 'Universal';
      case 'appointed_group':
        return 'Appointed group';
      case 'appointed_private':
        return 'Appointed private';
      case 'appointed_junior_group':
        return 'Appointed jun group';
      case 'free':
        return 'Remove';
      case 'group':
        return 'Group';
      case 'private':
        return 'Private';
      case 'replacement_group':
        return 'Group replacement';
      case 'replacement_private':
        return 'Private replacement';
      case 'replacement_junior_group':
        return 'Jun group replacement';
      default:
        return name;
    }
  };
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
    <div className={style.card__wrapper} key={lesson.id}>
      <div className={style.card__text__container}>
        <span>{lesson?.SubGroup?.name}</span>
        <span>
          {lesson?.SubGroup?.Course.name} {lesson.ReplacementId && '[Replacement]'}
        </span>
        <span>{translateAppointmentTypeName(lesson.AppointmentType.name)}</span>
        <span>
          {lesson.LessonSchedule.startTime} - {lesson.LessonSchedule.endTime}
        </span>
        <div>
          <InfoButton text="Replace" onClick={handleReplaceClick}></InfoButton>
          <DeleteButton onClick={handleDelete}></DeleteButton>
        </div>
      </div>
      <div className={style.card__avatar}>
        <UserAvatar mentor={lesson.User}></UserAvatar>
      </div>
    </div>
  );
}
