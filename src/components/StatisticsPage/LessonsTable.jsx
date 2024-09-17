import React from 'react';
import styles from './statistics.module.scss';
import classNames from 'classnames';
import {useTranslation} from 'react-i18next';

export default function LessonsTable({lessonsByDay}) {
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
  const {t} = useTranslation('global');

  return (
    <div className={classNames(styles.table__wrapper, styles.table__wrapper__lesson)}>
      <table className={styles.table}>
        <tbody>
          {Object.entries(lessonsByDay).map(([day, lessons]) => {
            const weekDay = new Date(day).getDay();

            return (
              <>
                <tr key={day} className={styles.table__lesson__tr}>
                  <td
                    colSpan={4}
                    className={classNames(
                      styles.table__lesson__cell,
                      styles.table__lesson__cell__date
                    )}>
                    {day} (
                    {t(
                      `fullDaysOfWeek.${weekDays[weekDay === 0 ? 6 : weekDay - 1]
                        .slice(0, 3)
                        .toLowerCase()}`
                    )}
                    )
                  </td>
                </tr>
                {lessons.map(lesson => (
                  <tr className={styles.table__lesson__tr}>
                    <td
                      key={day + lesson.LessonSchedule.startTime}
                      className={styles.table__lesson__cell}>
                      {lesson.LessonSchedule.startTime} - {lesson.LessonSchedule.endTime}
                    </td>
                    <td className={styles.table__lesson__cell}>
                      {typeTranslator(lesson.appointmentTypeId)}
                    </td>
                    <td className={styles.table__lesson__cell}>
                      {lesson?.SubGroup?.Course?.name ||
                        lesson?.Replacement?.SubGroup?.Course?.name}
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
