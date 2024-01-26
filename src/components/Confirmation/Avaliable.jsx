import React from "react";
import { useSelector } from "react-redux";
import { getConfirmatorAppointments } from "../../redux/confirmator/avaliable-selectors";
import styles from "./Avaliable.module.scss";

import { Fade } from "react-awesome-reveal";

const Avaliable = () => {
  const appointments = useSelector(getConfirmatorAppointments);
  let tm = appointments[0].hour;
  // const transformAppointmentData = (i) =>
  //   `${i.hour}:00, ${i.course}, ${i.manager_name}, ${i.phone}`;

  return (
    <>
      <ul className={styles.wrapper}>
        <Fade cascade duration={200}>
          {appointments.map((i) => {
            let out_string = "";
            i.map((j) => {
              out_string +=
                j.hour + " " + j.appointment_id + " " + j.manager_name + " ";
            });
            return (
              <li key={Math.random()} className={styles.ul_items}>
                <div className={styles.ul__span}>{i[0].hour}:00 | </div>
                <div className={styles.hour_line}>
                  {i.map((j, ind, { length }) => {
                    const link_str =
                      "https://booking-goiteens.netlify.app/manager/" +
                      j.appointment_id +
                      "/planning/";

                    if (length - 1 === ind) {
                      return (
                          <div key={ind}>
                            <a href={link_str} className={styles.li_link}>
                              {j.manager_name}
                            </a>
                            {" "}
                            <span>&nbsp; </span>{" "}
                          </div>
                      );
                    }

                    return (
                        <div key={ind}>
                          <a href={link_str} className={styles.li_link}>
                            {j.manager_name}
                          </a>
                          {", "}
                          <span>&nbsp; </span>{" "}
                        </div>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </Fade>
      </ul>
    </>
  );
};

export default Avaliable;
