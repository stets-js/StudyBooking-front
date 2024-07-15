import React from 'react';

import Modal from '../../Modal/Modal';
import styles from './referal.module.scss';
const ReferalModalWindow = ({isOpen, handleClose}) => {
  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose} classname_box={'referal'}>
          <div className={styles.wrapper}>
            <p>
              <b>Отримайте 💸 до ЗП за залучення нових студентів!</b>
            </p>
            <p>
              Реєструйте друзів, знайомих та всіх зацікавлених на пробне заняття в GoITeens та
              отримуйте 200 грн за кожного, хто відвідав пробне заняття.
            </p>
            <p>Люди з великою кількістю друзів — це ваш шанс.🤩</p>
            <p> І далі за правилами жанру — FAQ 👇🏻</p>
            <p>👉🏻 Хто такий «кваліфікований контакт»?</p>
            <div className={styles.list_item}>
              Це не дубль, не фейк, у потенційного клієнта є дитина від 5 до 17 років та інтерес до
              навчання в нас.
            </div>
            <p>👉🏻 Що робити?</p>
            <div className={styles.list_item}>
              <p>1️⃣ Додати свій актуальний номер телефону у Booking систему.</p>
              <p>
                2️⃣Внести дані потенційних клієнтів у форму за посиланням або надсилайте її усім
                зацікавленим батькам{' '}
                <a href="https://referral.goiteens.com/team/">
                  https://referral.goiteens.com/team/
                </a>
                . У полі "<b>Номер телефону друга</b>" має бути ваш номер.
              </p>
              <p>
                3️⃣ Менеджер продзвонює всі заявки й запрошує потенційного клієнта на пробне заняття
              </p>
              <p>
                4️⃣ Після відвідання пробного заняття ви отримуєте винагороду, а дитина 500 грн
                знижки на курс
              </p>
            </div>
            <p>👉🏻 Коли я отримаю бонус?</p>
            <div className={styles.list_item}>
              <p>
                Як тільки ваш друг пройде пробний урок, ми внесемо вашу винагороду у виплату як
                «додати до ЗП».
              </p>
              <p>
                Залучайте нових клієнтів до навчання в GoITeens будь-де та отримуйте прибавку до ЗП!
              </p>
            </div>
            <p>
              P.S. Якщо вам потрібні флаери або є питання, звертайтеся до мене{' '}
              <a href="https://t.me/anna_odzhykovska">https://t.me/anna_odzhykovska</a>
            </p>
          </div>
          <p className={styles.exit}>Click outside to exit</p>
        </Modal>
      )}
    </>
  );
};

export default ReferalModalWindow;
