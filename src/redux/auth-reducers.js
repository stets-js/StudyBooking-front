import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';
const initialState = {
  isAuthenticated: false,
  user: {
    name: '',
    role: 0,
    id: null
  },
  MIC: {},
  token: null,
  slackIdSync: ''
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      // first case for teacher auth, second is for collapse with sales booking
      const decodedToken = jwtDecode(action.payload.token?.data || action.payload.token);

      if (action.payload.MIC) {
        return {
          ...state,
          isAuthenticated: true,

          MIC: {
            name: decodedToken.user_name,
            role: decodedToken.role,
            roleId: decodedToken.roleId,
            id: decodedToken.id,
            exp: decodedToken.exp
          },
          token: action.payload.token
        };
      } else {
        Cookies.set(`token`, action.payload.token, {
          expires: decodedToken.exp
        });
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
      }
    case 'SYNC_SLACK_START':
      return {...state, slackIdSync: action.payload.slackId};
    case 'SYNC_SLACK_END':
      return {...state, slackIdSync: ''};
    case 'LOGOUT':
      Cookies.remove('token');
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
