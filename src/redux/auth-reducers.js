import {jwtDecode} from 'jwt-decode';

const initialState = {
  isAuthenticated: false,
  user: {
    name: '',
    role: 0,
    id: null
  },
  token: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      console.log(action.payload.token);
      const decodedToken = jwtDecode(action.payload.token);
      console.log(decodedToken);
      return {
        ...state,
        isAuthenticated: true,

        user: {
          name: decodedToken.user_name,
          role: decodedToken.role,
          roleId: decodedToken.roleId,
          id: decodedToken.id,
          exp: decodedToken.exp
        },
        token: action.payload.token
      };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
