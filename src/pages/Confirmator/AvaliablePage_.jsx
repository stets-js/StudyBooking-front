import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ConfirmatorPage.module.scss"; //Оформлення
import BgWrapper from "../../components/BgWrapper/BgWrapper"; //Елемент сторінки
import Confirmator from "../../components/Confirmation/Confirmed";  // структурвання виводу

import Avaliable from "../../components/Confirmation/Avaliable";  // структурвання виводу

import ConfirmationButtons from "../../components/ConfirmationButtons/ConfirmedButtons"; //вантажимо кнопочки
import Header from "../../components/Header/Header";  // підключаємо шапку
import { useParams } from "react-router-dom";
import { getCurrentConfirmed } from "../../redux/confirmator/confirmed-operations"; // Ключові дані
import ConfirmatorComments from "../../components/ConfirmatorComments/ConfirmatorComments";  // коментарі 
import ConfirmedDatePicker from "../../components/ConfirmatorDatePicker/ConfirmatorDatePicker"; // дата пікер
import { getUserById } from "../../helpers/user/user";  // отримаємо менеджерів
import { getConfirmedAppointments } from "../../redux/confirmator/confirmed-selectors"; // загальна проброска типів
// import { getConfirmedManagersList } from "../../redux/confirmator/avaliable-selectors"; // загальна проброска типів



const AvaliablePage = () => {
  const [value, setValue] = useState("");
  const { confirmatorId } = useParams();
  const [confirmatorName, setConfirmatorName] = useState("");
  const appointments = useSelector(getConfirmedAppointments);
//  const managers_list = useSelector(getConfirmedManagersList);


  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentConfirmed());
    getUserById(+confirmatorId)
      .then((data) => {
        setConfirmatorName(data.data.name);
      })
      .catch((err) => {
        throw err;
      });
  }, []);

  return (
    <>
      <Header 
      endpoints={[
        { text: "Users", path: '..superadmin/users' },
       
      ]}
      user={{ name: confirmatorName, role: "Avaliable managers" }} />

      <BgWrapper top={-200} title="Avaliable managers" />
      
      <ConfirmedDatePicker />
      <section className={styles.tableSection}>
        <h2 className={styles.title}>Avaliable managers</h2>   

        <Avaliable />



      </section>
    </>
  );
};

export default AvaliablePage;
