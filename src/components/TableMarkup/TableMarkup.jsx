import React from "react";
import styles from "../MeetingsTable/MeetingsTable.module.scss";
import MeetingsTableItem from "../MeetingsTableItem/MeetingsTableItem";
import { v4 as uuidv4 } from "uuid";

export default function TableMarkup() {
  const markUp = {
    manager_name: "Managers",
    manager_appointments: [
      { text: "8:00" },
      { text: "9:00" },
      { text: "10:00" },
      { text: "11:00" },
      { text: "12:00" },
      { text: "13:00" },
      { text: "14:00" },
      { text: "15:00" },
      { text: "16:00" },
      { text: "17:00" },
      { text: "18:00" },
      { text: "19:00" },
      { text: "20:00" },
      { text: "21:00" },
      { text: "22:00" },
    ],
  };

  return (
    <>
      <ul className={styles.managerUl}>
        <MeetingsTableItem key={uuidv4()} text={markUp.manager_name} managerName={true} />
        {markUp.manager_appointments.map((item) => (
          <MeetingsTableItem
          key={uuidv4()}
            text={item.text}
            colorId={item.status_id || item.status}
          />
        ))}
      </ul>
    </>
  );
}
