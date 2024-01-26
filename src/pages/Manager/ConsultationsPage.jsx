import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "react-calendar/dist/Calendar.css";
import styles from "./ManagerPage.module.scss";
import Table from "../../components/Table/Table";
import DayTable from "../../components/DayTable/DayTable";
import ConfirmationButtons from "../../components/ConfirmationButtons/ConfirmedButtons"; //вантажимо кнопочки
import {
  getDate,
  getTable,
  getWeekId,
} from "../../redux/manager/manager-selectors";
import {
  changeStatusSlot,
  setManagerError,
  setManagerLoading,
  getManagerCurrentWorkWeek,
  getManagerWorkWeek,
} from "../../redux/manager/manager-operations";
import { postStartConsultation } from "../../helpers/consultation/consultation";
import { updateSlot } from "../../helpers/week/week";
import StatusDefinition from "../../components/StatusDefinition/StatusDefinition";
import DatePicker from "../../components/DatePicker/DatePicker";
import Days from "../../components/Days/Days";
import DaysPicker from "../../components/DaysPicker/DaysPicker";

import { isManagerLoading } from "../../redux/manager/manager-selectors";
import { getCallerLoading } from "../../redux/caller/caller-selectors";


const ConsultationPage = () => {
  const [reload, setReload] = useState(false);
  const { managerId } = useParams();
  const dispatch = useDispatch();
  const tableDate = useSelector(getDate);
  const table = useSelector(getTable);
  const weekId = useSelector(getWeekId);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const managerLoading = useSelector(isManagerLoading);
  const callerLoading = useSelector(getCallerLoading);


  function setDayIndex(num) {
    setCurrentDayIndex(num);
  }

  const onClickSlotButton = (dayIndex, hourIndex) => {
    
    dispatch(setManagerLoading(true));
    
    return postStartConsultation(
      weekId,
      dayIndex,
      table[dayIndex][hourIndex].time,
      +managerId
    )
      .then(() => {
        return updateSlot(
          +managerId,
          weekId,
          dayIndex,
          table[dayIndex][hourIndex].time,
          6
        )
          .then(() => {
            dispatch(
              changeStatusSlot({
                dayIndex,
                hourIndex,
                colorId: 6,
              })
            );
          })
          .catch((error) => dispatch(setManagerError(error.message)));
      })
      .catch((error) => dispatch(setManagerError(error.message)))
      .finally(() => dispatch(setManagerLoading(false)));
  };
  
  useEffect(() => {
    dispatch(getManagerCurrentWorkWeek(+managerId));
  }, [dispatch, managerId, reload]);

  
  return (
    <section className={styles.tableSection}>
      <StatusDefinition />
      {managerLoading || callerLoading ? <div className={styles.loadingBackdrop}></div> : null}
      <DatePicker tableDate={tableDate} changeDateFn={getManagerWorkWeek} />
      {window.innerWidth > 1160 ? (
        <Days />
      ) : (
        <DaysPicker setDayIndex={setDayIndex} />
      )}
      {window.innerWidth > 1160 ? (
        <Table table={table} weekId={weekId} consultation handleReload={()=> setReload(!reload)} onClickSlotFn={onClickSlotButton} />
      ) : (
        <DayTable
          table={table[currentDayIndex]}
          dayIndex={currentDayIndex}
          weekId={weekId}
          consultation
          onClickSlotFn={onClickSlotButton}
          handleReload={()=> setReload(!reload)}
        />
      )}
    </section>
  );
};


export default ConsultationPage;
