import { Fade } from "react-awesome-reveal";
import React from "react";
import Header from "../../components/Header/Header";
import styles from "./HomePage.module.scss";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const HomePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("booking");

    if (tokenFromLocalStorage) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            token: tokenFromLocalStorage,
          },
        });
    }
    
  }, [dispatch]);
  return (
    <>
      <Header endpoints={
        //  [{ text: "superadmin", path: "superadmin/users/" }]
         [{}]
        } />
      <section className={styles.home}>
        <Fade triggerOnce duration={250} direction="down">
          <div className="divider">
            <p className={styles.error}>Welcome</p>
          </div>
        </Fade>
      </section>
    </>
  );
};

export default HomePage;
