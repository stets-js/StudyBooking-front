// import styles from "./InputDelete.module.scss";
// import { error } from "@pnotify/core";

// const InputDelete = ({ handleDelete}) => {
//   return (
//     <button
//       type="button"
//       className={styles.input__delete}
//       onClick={() => {
//         handleDelete();
//         // error("Delete feature coming soon(never)");
//       }}
//     >
//       Delete
//     </button>
//   );
// };

// export default InputDelete;

import React, { useState } from "react";
import styles from "./InputDelete.module.scss";
import { error } from "@pnotify/core";

const InputDelete = ({ handleDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteClick = () => {
    openModal();
  };

  const handleConfirmDelete = () => {
    handleDelete();
    closeModal();
  };

  const handleCancelDelete = () => {
    closeModal();
  };

  const handleModalClick = (e) => {
    // Закриваємо модальне вікно при кліку на зовнішній області (div.modal)
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div>
      <button
        type="button"
        className={styles.input__delete}
        onClick={handleDeleteClick}
      >
        Delete
      </button>

      {isModalOpen && (
        <div className={styles.modal} onClick={handleModalClick}>
          <div className={styles.modal__content}>
            <p className={styles.label}>Delete this item?</p>
            <div className={styles.btn_wrapper}>
              <button className={styles.btn_yes} onClick={handleConfirmDelete}>Yes</button>
              <button className={styles.btn_no} onClick={handleCancelDelete}>Nooo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputDelete;
