import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';
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
      const decodedToken = jwtDecode(action.payload.token);
      Cookies.set('token', action.payload.token, {expires: decodedToken.exp});
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
      Cookies.remove('token');
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
