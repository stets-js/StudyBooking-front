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
import coursesReducer from './courses-reducers';
import teacherReducer from './teacher-reducers';
import weekScheduler from './week-scheduler.reducers';
import selectedUserReducer from './selected-user-reducers';
import subgroupReducer from './subgroup-reducers';
import selectedSlotsReducer from './selected-slots-reducers';
import usersReducer from './users-page/users-reducers';
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
    teacher: teacherReducer,
    courses: coursesReducer,
    weekScheduler: weekScheduler,
    selectedUser: selectedUserReducer,
    subgroups: subgroupReducer,
    selectedSlots: selectedSlotsReducer,
    usersPage: usersReducer
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
