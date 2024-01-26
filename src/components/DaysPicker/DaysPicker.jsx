import React, { useState } from "react";
import styles from "./DaysPicker.module.scss";
import { useSelector } from "react-redux";
import { getDate } from "../../redux/manager/manager-selectors";
import { getCallerDate } from "../../redux/caller/caller-selectors";
import moment from "moment";
import { Fade } from "react-awesome-reveal";

const DaysPicker = ({ caller, setDayIndex }) => {
  const managerDate = new Date(useSelector(getDate));
  const callerDate = new Date(useSelector(getCallerDate));
  const arrayDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  let date = caller ? callerDate : managerDate;
  const [currentDate, setCurrentDate] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDayClick = (index) => {
    setDayIndex(index);
  };

  const currentDayIndexCalc = (item) => {
    switch (item) {
      case "Mon":
        handleDayClick(0);

        break;
      case "Tue":
        handleDayClick(1);

        break;
      case "Wed":
        handleDayClick(2);


        break;
      case "Thu":
        handleDayClick(3);

        break;
      case "Fri":
        handleDayClick(4);

        break;
      case "Sat":
        handleDayClick(5);
        break;
      case "Sun":
        handleDayClick(6);

        break;
      default:
        console.log('no day selected in DP');
    }
  };

  return (
    <div>
      <div className={styles.wrapperDays}>
        {arrayDays.map((item, index) => {
          const day =
            moment(date).add(index, "days").date() < 10
              ? `0${moment(date).add(index, "days").date()}`
              : moment(date).add(index, "days").date();
          const month =
            moment(date).add(index, "days").month() + 1 < 10
              ? `0${moment(date).add(index, "days").month() + 1}`
              : moment(date).add(index, "days").month() + 1;
          return (
            <div
              key={index}
              className={styles.day}
              onClick={() => {
                setCurrentDate(`${day}.${month}`);
                currentDayIndexCalc(item);
              }}
            >
              <h3 className={styles.dayTitle}>{item}</h3>
              <Fade delay={500} triggerOnce duration={500}>
                <span className={styles.dayDate}>{`${day}.${month}`}</span>
              </Fade>
            </div>
          );
        })}
      </div>
      <div className={styles.dayDatePrewiew}>{currentDate}</div>
    </div>
  );
};

export default DaysPicker;
