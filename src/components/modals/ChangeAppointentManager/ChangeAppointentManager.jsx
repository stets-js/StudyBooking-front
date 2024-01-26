import React, { useEffect, useState } from "react";
import Button from "../../Buttons/Buttons";
import styles from "./ChangeAppointentManager.module.scss";
import {
  getDateByWeekId,
  getManagersByCourse,
} from "../../../helpers/manager/manager";
import { putAppointment } from "../../../helpers/appointment/appointment";
import Modal from "../../Modal/Modal";
import { info, success, error } from "@pnotify/core";
import { TailSpin } from "react-loader-spinner";
import { useSelector } from "react-redux";

const ChangeAppointentManager = ({
  isOpen,
  handleClose,
  courseId,
  day,
  weekId,
  hour,
  age,
  phone,
  link,
  appointmentId,
  message,
  isCreateAppointment,
  isChangeAppointment,
  setManagerId,
  setManager,
  isPostponed,
  closePostpone,
  isFollowUp,
  selectedReason
}) => {
  const [date, setDate] = useState("");
  const [managersList, setManagers] = useState([]);

  const userRole = useSelector((state) => state.auth.user.role);
  const userId = useSelector((state) => state.auth.user.id);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const result = await getDateByWeekId(weekId, day);
  //       console.log("result.date",result.date);
  //       setDate(result.date);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchData();
  // }, [day, weekId]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const result = await getManagersByCourse(courseId, date, hour);
  //       setManagers(result.managers);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchData();
  // }, [courseId, date, hour]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDateByWeekId(weekId, day);
        setDate(result.date)
        const date = result.date;
        const managers = await getManagersByCourse(courseId, date, hour);
        setManagers(managers.managers.sort((a, b) => b.rating - a.rating));
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [day, weekId, courseId, hour]);



  return (
    <>
      <Modal
        style={{ zIndex: "999999999 !important" }}
        open={isOpen}
        onClose={() => {
          handleClose(!isOpen);
        }}
      >
        <h1>Select new manager</h1>

        {managersList.length === 0 ? (
          <div className={styles.noManagersLoadingWrapper}>
          <h2 className={styles.noManagersButton}>Managers list...</h2>
          {/* <TailSpin height="50px" width="50px" color="#999DFF" /> */}
          </div>
        ) : (
          <div className={styles.managersListBox}>
            {managersList.map((manager) => (
              <div key={manager.id}>
                <button
                  onClick={
                    isCreateAppointment || isChangeAppointment
                      ? (e) => {
                          setManagerId(manager.id);
                          setManager(manager.name);
                          handleClose(!isOpen);
                        }
                      : (e) => {
                          const data = new FormData();
                          data.append("appointment_id", appointmentId);
                          data.append("date", date);
                          data.append("day", day);
                          data.append("hour", hour);
                          data.append("course_id", courseId);
                          data.append("crm_link", link);
                          data.append("phone", phone);
                          data.append("age", age);
                          data.append("manager_id", manager.id);
                          data.append("message", message);
                          data.append("follow_up", false);
                          data.append("postpone_role", userRole === 4 ? "caller" : userRole === 5 ? "confirmator" : userRole === 2 ? "manager" : "admin");
                          data.append("userId", userId);
                          data.append("reason_postpone", selectedReason);
                          putAppointment(data).then(() => {
                            if (isPostponed) {
                              closePostpone();
                            }
                            handleClose(!isOpen);
                            success("Manager changed successfully");
                          });
                        }
                  }
                  className={styles.managerButton}
                >
                  {manager.name}
                </button>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
};

export default ChangeAppointentManager;
