import React from 'react';

import Modal from '../../Modal/Modal';
import styles from './referal.module.scss';
import {useTranslation} from 'react-i18next';
const ReferalModalWindow = ({isOpen, handleClose}) => {
  const {t} = useTranslation('global');

  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose} classname_box={'referal'}>
          <div className={styles.wrapper}>
            <p>
              <b>{t('teacher.timetable.refferal.modalTitle')}</b>
            </p>
            <p>{t('teacher.timetable.refferal.modalPar1')}</p>
            <p>{t('teacher.timetable.refferal.modalPar2')}</p>
            <p> {t('teacher.timetable.refferal.faq.title')}</p>
            {[1, 2, 3].map(index => {
              return (
                <>
                  <p>{t(`teacher.timetable.refferal.faq.list.${index}.q`)}</p>
                  <div className={styles.list_item}>
                    {t(`teacher.timetable.refferal.faq.list.${index}.a`, {returnObjects: true}).map(
                      (el, i) => (
                        <p key={i} dangerouslySetInnerHTML={{__html: el}} />
                      )
                    )}
                  </div>
                </>
              );
            })}

            <p dangerouslySetInnerHTML={{__html: t(`teacher.timetable.refferal.faq.contact`)}} />
          </div>
          <p className={styles.exit}>{t('teacher.timetable.refferal.faq.exitText')}</p>
        </Modal>
      )}
    </>
  );
};

export default ReferalModalWindow;
