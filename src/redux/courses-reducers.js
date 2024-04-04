//this one for teacher edit list

const initialState = {
  courses: [],
  teacherCourses: []
};

const courseReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_COURSES':
      return {...state, courses: action.payload};

    case 'SET_TEACHER_COURSES':
      return {...state, teacherCourses: action.payload};
    case 'CLEAN_TEACHER_COURSES':
      return {...state, teacherCourses: action.payload};
    case 'UPDATE_TEACHER_COURSE':
      console.log(action.payload);
      return {
        ...state,
        teacherCourses: [
          ...(state.teacherCourses.map(el => el.id !== action.payload.CourseId) || []),
          action.payload
        ]
      };
    case 'ADD_TEACHER_COURSE':
      return {
        ...state,
        teacherCourses: [...(state.teacherCourses || []), action.payload]
      };
    default:
      return state;
  }
};

export default courseReducer;
