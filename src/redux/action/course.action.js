export const setCourses = courses => ({
  type: 'SET_COURSES',
  payload: courses
});

export const setTeacherCourses = teacherCourses => ({
  type: 'SET_TEACHER_COURSES',
  payload: teacherCourses
});

export const addTeacherCourses = teacherCourse => ({
  type: 'ADD_TEACHER_COURSE',
  payload: teacherCourse
});
