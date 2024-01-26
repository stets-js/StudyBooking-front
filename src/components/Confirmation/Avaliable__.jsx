import React from "react";
import { useSelector } from "react-redux";
import { getConfirmedAppointments } from "../../redux/confirmator/avaliable-selectors";
import { getConfirmedManagersList } from "../../redux/confirmator/avaliable-selectors";
import styles from "./Confirmation.module.scss";

import { Fade } from "react-awesome-reveal";

let path = "https://booking-goiteens.netlify.app/manager/"
let endpath = "/consultations/"

const Avaliable = () => {
//   const appointments = useSelector(getConfirmedAppointments);
  const managers_list = useSelector(getConfirmedManagersList);
  const transformAppointmentData = (i) =>
    `${i.hour}:00, ${i.course}, ${i.manager_name}, ${i.phone}`;

  return (
    <ul className={styles.wrapper}>
    <Fade cascade duration={200}>
        {managers_list.map((i) => {
          return (
            <li key={i.appointment_id} className={styles.ul_items}>
              <p className={styles.ul_items_text}>
                {/*transformAppointmentData(i)*/}

                {i.time} |
                {i.managers.map((el)=>{
                    return (
                    <a href = {path+el.manager_id+endpath}>{el.name}</a>  
        )})}

              </p>
            </li>
          );
        })}
    </Fade>
    </ul>
  );
};

export default Avaliable;
