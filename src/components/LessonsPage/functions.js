import {format} from 'date-fns';
import {getLessons} from '../../helpers/lessons/lesson';

export const generateEmptyStructure = () => {
  let schedule = {};

  let currentTime = new Date();
  currentTime.setHours(0, 0, 0, 0);

  for (let i = 0; i < 49; i++) {
    schedule[format(currentTime, 'HH:mm')] = [];
    currentTime.setMinutes(currentTime.getMinutes() + 30);
  }
  return schedule;
};

export const fetchLessons = async (options, setLessons) => {
  try {
    const {data} = await getLessons(options);
    // generateEmptyStructure();
    if (data) {
      data.data.forEach(lesson => {
        const lessonStartTime = lesson.LessonSchedule.startTime;
        setLessons(prev => {
          return {
            ...prev,
            [lessonStartTime]: [...(prev[lessonStartTime] || []), lesson] // Update specific time slot with the lesson
          };
        });
        // setLessons(data.data);
      });
    }
  } catch (error) {
    console.log(error);
  }
};
