export const setCourses = courses => ({
  type: 'SET_COURSES',
  payload: courses
});

export const setTeacherCourses = teacherCourses => ({
  type: 'SET_TEACHER_COURSES',
  payload: teacherCourses
});

export const updateTeacherCourse = (course) => ({
  // For now its only support updating TeacherTypeId 
  type: 'UPDATE_TEACHER_COURSE',
  payload: course
});
export const cleanTeacherCourses = () => ({
  type: 'CLEAN_TEACHER_COURSES',
  payload: []
});

export const addTeacherCourses = teacherCourse => ({
  type: 'ADD_TEACHER_COURSE',
  payload: teacherCourse
});
