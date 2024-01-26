import styles from "./InputCancel.module.scss";
import React, { useState } from "react";

const InputCancel = ({ InputCancelFunc }) => {

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("no parents attending"); 

  const handleClick = (e) => {
    e.preventDefault();
    setShowConfirmationModal(true);
  };

  const handleConfirm = () => {
    // Викликати функцію видалення і передати вибрану причину
    InputCancelFunc(selectedReason);
    setSelectedReason('no parents attending')
    setShowConfirmationModal(false);
  };

  const handleCancel = () => {
    // Сховати модальне вікно при скасуванні
    setShowConfirmationModal(false);
  };

  const handleReasonChange = (e) => {
    // Оновити вибрану причину видалення при зміні в дропдауні
    setSelectedReason(e.target.value);
  };

  const rejectionReasons = [
    "no parents attending",
    "child sick",
    "not interested",
    "forgot about TL or have no time",
    "no contact",
    "tech reasons",
    "no PC",
    "no electricity",
    "other reasons"
  ];

  return (
    <>
    <button type="button" className={styles.input__submit} onClick={handleClick}>
      Remove
    </button>

{showConfirmationModal && (
  <div className={styles.modal}>
    <div className={styles.modal__content}>
      <p className={styles.label}>Select a reason for removal:</p>
      
      <select
                className={styles.reason__select}
                value={selectedReason}
                onChange={handleReasonChange}
              >
                {rejectionReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
      <div className={styles.btn_wrapper}>
        <button className={styles.btn_yes} onClick={handleConfirm}>Confirm</button>
        <button className={styles.btn_no} onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  </div>
)}
</>
  );
};

export default InputCancel;
