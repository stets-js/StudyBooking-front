import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import styles from "./DayDatePicker.module.scss";
import { Fade } from "react-awesome-reveal";

const DayDatePicker = ({ tableDate, changeDateFn, setCurrentTableData, setSelectedTeam, selectedTeam }) => {
  const [date, setDate] = useState(new Date(tableDate));

  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;

  const dateYear =
    date.getFullYear() < 10 ? `0${date.getFullYear()}` : date.getFullYear();

  const dateDay = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

  const todaysDate = new Date(tableDate);

  useEffect(() => {
    if (date == todaysDate) {
      return;
    } else {
      const day = dateDay.toString();
      const curmonth = month.toString();
      const year = dateYear.toString();
      changeDateFn(day, month, year);
    }
  }, [date, selectedTeam]);

  const onClickArrowRight = () => {
    setDate(moment(date).add(1, "days")._d);
  };

  const onClickArrowLeft = () => {
    setDate(moment(date).subtract(1, "days")._d);
  };

  return (
<div className={styles.calendarControllerBox}>
  Day
<div className={styles.calendarController}>
      <Fade cascade triggerOnce duration={300} direction="up">
        <button
          onClick={onClickArrowLeft}
          className={styles.calendarControllerButton}
          type="button"
        >
          {"<"}
        </button>
        <span className={styles.calendarControllerText}>
          {`${dateDay}.${month}.${dateYear}`}
        </span>
        <button
          onClick={onClickArrowRight}
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

DayDatePicker.propTypes = {
  tableDate: PropTypes.string.isRequired,
  changeDateFn: PropTypes.func.isRequired,
};

export default DayDatePicker;
