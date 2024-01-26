import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import styles from "./DayTimePicker.module.scss";
import { Fade } from "react-awesome-reveal";

const DayTimePicker = ({ tableTime, setTableTime, selectedTeam }) => {
  const [time, setTime] = useState(tableTime);

  useEffect(() => {
    setTableTime(time)
  }, [time, selectedTeam]);


const timeIncrement = ()=>{
    const newTime = time + 1;

   
    if (newTime < 8) {
      return 8;
    } else if (newTime > 22) {
      return 22;
    } else {
      setTime(newTime)
    }};

const timeDecrement = ()=>{
    const newTime = time - 1;

    if (newTime < 8) {
      return 8;
    } else if (newTime > 22) {
      return 22;
    } else {
      setTime(newTime)
    }};

  return (
<div className={styles.calendarControllerBox}>
  Time
<div className={styles.calendarController}>
      <Fade cascade triggerOnce duration={300} direction="up">
        <button
          onClick={timeDecrement}
          className={styles.calendarControllerButton}
          type="button"
        >
          {"<"}
        </button>
        <span className={styles.calendarControllerText}>
          {`${time}:00`}
        </span>
        <button
          onClick={timeIncrement}
          className={styles.calendarControllerButton}
          type="button"
        >
          {">"}
        </button>
      </Fade>
    </div>
</div>
  );
};

DayTimePicker.propTypes = {
  tableDate: PropTypes.string.isRequired,
  changeDateFn: PropTypes.func.isRequired,
};

export default DayTimePicker;
