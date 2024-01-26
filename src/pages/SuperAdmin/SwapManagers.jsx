import React, { useState } from 'react';
import styles from "./SuperAdminPage.module.scss";
import { swapAppointmentManagers } from '../../helpers/appointment/appointment';
import { info, success, error } from "@pnotify/core";

const SwapManagersComponent = () => {
  const [link1, setLink1] = useState('');
  const [link2, setLink2] = useState('');

  const handleSwapManagers = () => {
    const data = new FormData();
    data.append("appointment_id_1", link1);
    data.append("appointment_id_2", link2);

    swapAppointmentManagers(data)
      .then(() => {
        success("Swapped successfully");
      })
      .catch((err) => {
        error(err.response.data.message);
      });
  };

  return (
    <form className={styles.swap__table}>
        <input className={styles.swap__input} type="text" value={link1} onChange={(e) => setLink1(e.target.value)} placeholder='Input zoho link 1...' />
        <input className={styles.swap__input} type="text" value={link2} onChange={(e) => setLink2(e.target.value)} placeholder='Input zoho link 2...'/>
      <button className={styles.swap__btn} type="button" onClick={handleSwapManagers} >
        Swap
      </button>
    </form>
  );
};

export default SwapManagersComponent;
