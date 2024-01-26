import { createReducer } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  decreaseDay,
  firstHalf,
  getConfirmedWeek,
  getCurrentConfirmed,
  getAvaliableManagers,
  getAvaliableManagersWeek,
  increaseDay,
  secondHalf,
} from "./avaliable-operations";

const INITIAL_WEEK = {
  date: null,
  day: null,
  half: null,
  week_id: null,
};


// console.log("Managers_list");
// const managers_list = createReducer([], {
//   [getAvaliableManagers.fulfilled]: (_, { payload }) => {console.log("avaliable_reduce"); console.log(payload); return payload.managers_list;},
//   [getAvaliableManagersWeek.fulfilled]: (_, { payload }) => {console.log("avaliable_reduce"); console.log(payload); return payload.managers_list;},
// });

const managers_list = createReducer([], {
  [getCurrentConfirmed.fulfilled]: (_, { payload }) => {
    return payload.managers_list},
  [getConfirmedWeek.fulfilled]: (_, { payload }) => {
    return payload.managers_list},
});

const date = createReducer(INITIAL_WEEK, {
  [firstHalf.type]: (state, _) => ({ ...state, half: 1 }),
  [secondHalf.type]: (state, _) => ({ ...state, half: 2 }),
  [increaseDay.type]: (state, _) => {
    if (state.day === 6) {
      return { ...state, day: 0, week_id: state.week_id + 1 };
    }
    return { ...state, day: state.day + 1 };
  },
  [decreaseDay.type]: (state, _) => {
    if (state.day === 0) {
      if (state.week_id === 0) return;
      return { ...state, day: 6, week_id: state.week_id - 1 };
    }
    return { ...state, day: state.day - 1 };
  },
  [getCurrentConfirmed.fulfilled]: (_, { payload }) => ({
    date: payload.date,
    day: payload.day,
    half: payload.half,
    week_id: payload.week_id,
  }),
  [getConfirmedWeek.fulfilled]: (_, { payload }) => ({
    date: payload.date,
    day: payload.day,
    half: payload.half,
    week_id: payload.week_id,
  }),
});

const error = createReducer("", {
  [getCurrentConfirmed.pending]: () => "",
  [getConfirmedWeek.pending]: () => "",
  [getConfirmedWeek.rejected]: (_, { payload }) => payload,
  [getCurrentConfirmed.rejected]: (_, { payload }) => payload,
});

const loading = createReducer(false, {
  [getCurrentConfirmed.pending]: () => true,
  [getCurrentConfirmed.fulfilled]: () => false,
  [getCurrentConfirmed.rejected]: () => false,
  [getConfirmedWeek.pending]: () => true,
  [getConfirmedWeek.fulfilled]: () => false,
  [getConfirmedWeek.rejected]: () => false,
});

export default combineReducers({
  // appointments,
  managers_list,
  loading,
  error,
  date,
});
