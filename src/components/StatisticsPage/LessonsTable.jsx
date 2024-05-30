import React from 'react';
import styles from './statistics.module.scss';
import classNames from 'classnames';

export default function LessonsTable({lessonsByDay}) {
  console.log(lessonsByDay);
  const typeTranslator = id => {
    switch (+id) {
      case 7:
        return 'Group';
      case 8:
        return 'Private';
      case 9:
        return 'Replaced group';
      case 10:
        return 'Replaced private';
      case 11:
        return 'Jun group';
      case 12:
        return 'Replaced Jun group';

      default:
        return id;
    }
  };
  return (
    <div className={classNames(styles.table__wrapper, styles.table__wrapper__lesson)}>
      <table className={styles.table}>
        <tbody>
          {Object.entries(lessonsByDay).map(([day, lessons]) => {
            return (
              <>
                <tr key={day}>
                  <td
                    colSpan={3}
                    className={classNames(
                      styles.table__lesson__cell,
                      styles.table__lesson__cell__date
                    )}>
                    {day}
                  </td>
                </tr>
                {lessons.map(lesson => (
                  <tr>
                    <td
                      key={day + lesson.LessonSchedule.startTime}
                      className={styles.table__lesson__cell}>
                      {lesson.LessonSchedule.startTime} - {lesson.LessonSchedule.endTime}
                    </td>
                    <td className={styles.table__lesson__cell}>
                      {typeTranslator(lesson.appointmentTypeId)}
                    </td>
                    <td className={styles.table__lesson__cell}>
                      {lesson?.SubGroup?.name || lesson?.Replacement?.SubGroup?.name}
                    </td>
                  </tr>
                ))}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
