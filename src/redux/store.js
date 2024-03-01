import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './auth-reducers';
import courseReducer from './course-reducers'; // TODO: MERGE IT TO
import coursesReducer from './courses-reducers';
import teacherReducer from './teacher-reducers';
import weekScheduler from './week-scheduler.reducers';
const persistConfig = {
  key: 'booking-system',
  storage
  // blacklist: ['token'],
};

// const persistedReducer = persistReducer(persistConfig, rootReducer);
const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    auth: authReducer,
    course: courseReducer,
    teacher: teacherReducer,
    courses: coursesReducer,
    weekScheduler: weekScheduler
  })
);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV === 'development',
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});
export const persistor = persistStore(store);
// export const persistor = persistStore(store);
