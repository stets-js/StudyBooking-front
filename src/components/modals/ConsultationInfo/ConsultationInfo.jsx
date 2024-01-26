import styles from "./ConsultationInfo.module.scss";
import Modal from "../../Modal/Modal";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getGroups } from "../../../helpers/group/group";
import { getCourses } from "../../../helpers/course/course";
import { updateSlot, updateSlotFollowUp } from "../../../helpers/week/week";
import { getAppointment } from "../../../helpers/appointment/appointment";
import { getSlot } from "../../../helpers/slot/slot";
import { postConsultationResult } from "../../../helpers/consultation/consultation";
import { getTable, getWeekId } from "../../../redux/manager/manager-selectors";
import { Link } from "react-router-dom";
import { delteConfirmation } from "../../../helpers/confirmation/confirmation";
import { getWeekIdByTableDate } from "../../../helpers/week/week";
import { alert, notice, info, success, error } from "@pnotify/core";

import {
  setManagerError,
  setManagerLoading,
  changeStatusSlot,
} from "../../../redux/manager/manager-operations";
import Select from "../../Select/Select";
import Form from "../../Form/Form";
import { TailSpin } from "react-loader-spinner";


const ConsultationInfo = ({
  isOpen,
  handleClose,
  weekId,
  slotId,
  dayIndex,
  hourIndex,
  handleReload,
  manId,
  currentTable
}) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [result, setResult] = useState(null);
  const [course, setCourse] = useState("");
  const [group, setGroup] = useState("");
  const [message, setMessage] = useState("");
  const [unsuccessfulMessage, setUnsuccessfulMessage] = useState("");
  const { managerId } = useParams();
  const [appointment, setAppointment] = useState([]);
  //const weekId = useSelector(getWeekId);
  const [currentWeekId, setCurrentWeekId] = useState(weekId);
  const managerTable = useSelector(getTable);

  // useEffect(() => {
  //   const get = async () => await getWeekIdByTableDate();
  //   get().then((data) => setAppointment(data.data));
  // }, []);
  const [followUp, setFollowUp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isOpen) {
          // Отримання даних про призначення
          const appointmentData = await getAppointment({ id: slotId });
          setAppointment(appointmentData.data);
          setFollowUp(appointmentData.data.follow_up);
          setUnsuccessfulMessage(appointmentData.data.unsuccessful_message);
          setMessage(appointmentData.data.comments);
  
          // Отримання даних про слот
          const slotData = await getSlot({ id: slotId });
          console.log("slot data", slotData);
          if (slotData.status_id == 7 || slotData.status_id == 8) {
            setResult(slotData.status_id);
          } else {
            setResult(7);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Обробка помилок, наприклад, виведення повідомлення користувачу
      }
    };
  
    fetchData();
  }, [isOpen]);

  useEffect(() => {},[result])

  const cancelConfConsultOnClickFn = () => {
    delteConfirmation(managerId ? managerId : manId, weekId, dayIndex, currentTable ? hourIndex : managerTable[dayIndex][hourIndex].time, 0, message)
      .then(() => {
        success({
          text: "Succesfully deleted.",
        });
        handleClose();
        handleReload && handleReload();
      })
      .catch(() => {
        // Handle error
        error({
          text: "Something went wrong",
        });
        handleClose();
        handleReload && handleReload();
      });
  };
  const updateFollowUp = () => {
    if(followUp !== "" && managerTable[dayIndex] && managerTable[dayIndex][hourIndex]){
      setIsLoading(true)
      updateSlotFollowUp(managerId ? managerId : manId,
      weekId,
      dayIndex,
      currentTable ? hourIndex : managerTable[dayIndex][hourIndex].time,
      +result,
      followUp).then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error updating follow-up:", error);
      });
    }
      else if(followUp !== ""){
        setIsLoading(true)
        updateSlotFollowUp(managerId ? managerId : manId,
          weekId,
          dayIndex,
          currentTable ? hourIndex : managerTable[dayIndex][hourIndex].time,
          +result,
          followUp).then(() => {
            setIsLoading(false);
          })
          .catch((error) => {
            setIsLoading(false);
            console.error("Error updating follow-up:", error);
          });
      }
  }

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
  const handleReasonChange = (e) => {
    // Оновити вибрану причину видалення при зміні в дропдауні
    setUnsuccessfulMessage(e.target.value);
  };

  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <Form
            type={{ type: "no-request" }}
            isCancelConfConsult={true}
            cancelConfConsultOnClickFn={cancelConfConsultOnClickFn}
            onSubmit={() => {
              handleClose();
              dispatch(setManagerLoading(true));
              return postConsultationResult(+slotId, result, group, message, unsuccessfulMessage)
                .then((data) => {
                  return updateSlot(
                    managerId ? managerId : manId,
                    weekId,
                    dayIndex,
                    currentTable ? hourIndex : managerTable[dayIndex][hourIndex].time,
                    +result
                  )
                    .then((data) => {
                      dispatch(
                        changeStatusSlot({
                          dayIndex,
                          hourIndex,
                          colorId: +result,
                        })
                      );
                    })
                    .catch((error) => dispatch(setManagerError(error.message)));
                })
                .catch((error) => dispatch(setManagerError(error.message)))
                .finally(() => {
                  setDesc("");
                  setName("");
                  setResult(7);
                  setCourse("");
                  setMessage("");
                  setFollowUp("");
                  setUnsuccessfulMessage("");
                  return dispatch(setManagerLoading(false));
                });
            }}
            name={name}
            description={desc}
            course={course}
            result={result}
            // login={login}
            // password={password}
            // role={role}
            status={{
              successMessage: "Successfully changed consultation info",
              failMessage: "Failed to change consultation info",
            }}
            title="Consultation Info"
          >
            <label className={styles.input__label}>
              {appointment && (
                <a
                  target="_blank"
                  href={appointment.zoho_link}
                  className={styles.input__link}
                >
                  CRM Link
                </a>
              )}
            </label>
            <Select
              title="Course:"
              request={getCourses}
              setValue={setCourse}
              value={course || appointment.course_id}
              defaultValue="Select course"
            />

            <Select
              title="Result:"
              type="no-request"
              value={result}
              setValue={setResult}
            >
              <option value={7}>Successful</option>
              <option value={8}>Unsuccessful</option>
            </Select>
          
           {result == 8 ?  <label className={styles.input__label2}>Reason:
           <select
                className={styles.reason__select}
                value={unsuccessfulMessage}
                onChange={handleReasonChange}
              >
                {rejectionReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select></label>: null}

            <Select
              title="Group:"
              value={group}
              request={getGroups}
              setValue={setGroup}
              groupId={+course}
              defaultValue="Select group"
            />
            <label className={styles.input__label}>
              <p className={styles.input__label}>Message</p>
              <textarea
                className={styles.textarea}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </label>

            <label className={styles.input__checkbox}>
              <input
                className={styles.input__checkboxInput}
                type="checkbox"
                checked={followUp}
                onChange={() => setFollowUp(!followUp)}
              />
              <p className={styles.input__checkboxLabel}>Follow up</p>
              {isLoading ? <TailSpin height="25px" width="25px" color="#999DFF" /> : null}
            </label>
              <button className={styles.btn__followUp} type="button" onClick={updateFollowUp}>Update</button>
            
            {/* <label className={styles.input__label}>
              <p className={styles.input__label}>Some Text</p>
            </label> */}
          </Form>
        </Modal>
      )}
    </>
  );
};

export default ConsultationInfo;
