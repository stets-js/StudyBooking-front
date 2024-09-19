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

import React, {useState} from 'react';
import styles from './InputDelete.module.scss';
import {useTranslation} from 'react-i18next';

const InputDelete = ({handleDelete}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {t} = useTranslation('global');

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

  const handleModalClick = e => {
    // Закриваємо модальне вікно при кліку на зовнішній області (div.modal)
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div>
      <button type="button" className={styles.input__delete} onClick={handleDeleteClick}>
        {t('buttons.del')}
      </button>

      {isModalOpen && (
        <div className={styles.modal} onClick={handleModalClick}>
          <div className={styles.modal__content}>
            <p className={styles.label}>{t('modals.dl.conf')}</p>
            <div className={styles.btn_wrapper}>
              <button className={styles.btn_yes} onClick={handleConfirmDelete}>
                {t('modals.dl.yes')}
              </button>
              <button className={styles.btn_no} onClick={handleCancelDelete}>
                {t('modals.dl.no')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputDelete;
