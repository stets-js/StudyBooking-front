const initialState = {
  superAdmins: [],
  admins: [],
  mentors: []
};

const courseReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SUPERADMINS':
      return {...state, superAdmins: action.payload};
    case 'SET_ADMINS':
      return {...state, admins: action.payload};
    case 'SET_MENTORS':
      return {...state, mentors: [...state.mentors, ...action.payload]};

    case 'UPDATE_SUPERADMINS':
      return {
        ...state,
        superAdmins: [
          action.payload,
          ...state.superAdmins.filter(el => el.id !== action.payload.id)
        ]
      };
    case 'DELETE_SUPERADMINS':
      return {
        ...state,
        superAdmins: [...state.superAdmins.filter(el => el.courseId !== action.payload)]
      };
    case 'UPDATE_ADMINS':
      return {
        ...state,
        admins: [action.payload, ...state.admins.filter(el => el.id !== action.payload.id)]
      };
    case 'DELETE_ADMINS':
      return {
        ...state,
        admins: [...state.admins.filter(el => el.id !== action.payload)]
      };
    case 'UPDATE_MENTORS':
      return {
        ...state,
        mentors: [action.payload, ...state.mentors.filter(el => el.id !== action.payload.id)]
      };
    case 'CLEAN_MENTORS':
      return {
        ...state,
        mentors: []
      };
    case 'DELETE_MENTORS':
      return {
        ...state,
        mentors: [...state.mentors.filter(el => el.id !== action.payload)]
      };
    case 'ADD_MENTOR':
      return {
        ...state,
        mentors: [action.payload, ...state.mentors]
      };
    case 'ADD_ADMIN':
      return {...state, admins: [action.payload, ...state.admins]};
    case 'ADD_SUPERADMIN':
      return {...state, superAdmins: [action.payload, ...state.superAdmins]};
    default:
      return state;
  }
};

export default courseReducer;
