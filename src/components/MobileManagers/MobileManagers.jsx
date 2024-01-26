import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUsers } from "../../helpers/user/user";
import styles from "./MobileManagers.module.scss";
import ChangeUser from "../modals/ChangeUser/ChangeUser";
import { Fade } from "react-awesome-reveal";
import { getManagers } from "../../helpers/manager/manager";
import { v4 as uuidv4 } from 'uuid';

export default function MobileManagers({ isOpenModal, role, isAdmin, data }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState("");
  const [managers, setManagers] = useState(data);
  const [id, setId] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newRole, setRole] = useState("");
  const [newLogin, setLogin] = useState("");
  const [currentUserType, setcurrentUserType] = useState("Managers");
  const [currentUserTypeIndex, setcurrentUserTypeIndex] = useState(3);
  const currentUserTypeCalc = (type) => {
    switch (type) {
      case "Administrators":
        setcurrentUserTypeIndex(0);
        break;
      case "Managers":
        setcurrentUserTypeIndex(1);
        break;
      case "Confirmators":
        setcurrentUserTypeIndex(2);
        break;
      case "Call center":
        setcurrentUserTypeIndex(3);
        break;
      default:
        //console.log(`Sorry, u got no bitches`);
        //console.log(`index is ${currentUserTypeIndex}`);
    }
  };

  let usersArray = [
    {
      text: "Administrators",
      role: "Administrator",
      roleId: 3,
      isAdmin: false,
      isManager: false,
    },
    {
      text: "Managers",
      role: "Manager",
      roleId: 2,
      isAdmin: false,
      isManager: true,
    },
    {
      text: "Confirmators",
      role: "Confirmator",
      roleId: 5,
      isAdmin: false,
      isManager: false,
    },
    {
      text: "Call center",
      role: "Caller",
      isAdmin: false,
      roleId: 4,
      isManager: false,
    },
  ];
  if (isAdmin) {
    usersArray = usersArray.slice(1);
  }

  const getUsersData = async () => {
    const arr = [];
    const res = await getUsers().then((res) =>
      res.users.filter((item) => item.role_id > 2)
    );
    const resManagers = await getManagers().then((res) => res.data);
    resManagers.map((item) => (item.role_id = 2));
    arr.push(...res);
    arr.push(...resManagers);
    return setManagers(arr);
  };

  useEffect(() => {
    getUsersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isOpenModal]);
  const currentUserArray = managers.sort((item) => item.role_id=currentUserTypeIndex);
  return (
    <>
    {/* {console.table(managers.sort((item) => item.role_id=2))} */}
      {managers?.length > 0 &&
        usersArray.map((i, index) => {
          return (
            <React.Fragment key={uuidv4()}>
              <div className={styles.wrapper} key={uuidv4()}>
                <p
                  className={styles.mini_title}
                  onClick={() => {
                    
                    setcurrentUserType(i.text);
                    currentUserTypeCalc(i.text)
                  }}
                >
                  {i.text}
                </p>
                <ul className={styles.main_wrapper}>
                  {currentUserArray.map((item) => {
                    if (i.roleId === item.role_id || !item.role_id) {
                      return (
                        <Fade
                          cascade
                          triggerOnce
                          duration={300}
                          direction="up"
                          key={uuidv4()}
                        >
                          <li className={styles.ul_items} key={uuidv4()}>
                            <Link
                              className={styles.ul_items_link}
                              target="_blank"
                              to={
                                i.role === "Manager"
                                  ? `/manager/${item.id}/planning/`
                                  : i.role === "Administrator"
                                  ? `/admin/${item.id}`
                                  : i.role === "Caller"
                                  ? `/caller/${item.id}`
                                  : i.role === "Confirmator" &&
                                    `/confirmator/${item.id}`
                              }
                            >
                              <p className={styles.ul_items_text}>
                                {item.name} ({item.id})
                              </p>
                            </Link>
                            <button
                              className={styles.ul_items_btn}
                              data-modal="change-user"
                              onClick={() => {
                                setIsOpen(!isOpen);
                                setId(item.id);
                                setName(item.name);
                                setRating(item.rating);
                                if (!item.role_id) setRole(2);
                                else {
                                  setRole(item.role_id);
                                }
                                setLogin(item.login);
                              }}
                            />
                          </li>
                        </Fade>
                      );
                    }
                  })}
                </ul>
              </div>
            </React.Fragment>
          );
        })}
      <ChangeUser
        isOpen={isOpen}
        handleClose={() => setIsOpen(!isOpen)}
        id={id}
        dataName={name}
        dataDesc={rating}
        administrator={isAdmin}
        dataRole={newRole}
        dataLogin={newLogin}
      />
    </>
  );
}
