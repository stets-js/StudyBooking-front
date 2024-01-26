import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import styles from "./CallerPage.module.scss";
import BgWrapper from "../../components/BgWrapper/BgWrapper";
import { Outlet, useParams } from "react-router-dom";
import DatePicker from "../../components/DatePicker/DatePicker";
import { useSelector, useDispatch } from "react-redux";
import "react-calendar/dist/Calendar.css";
import path from "../../helpers/routerPath";
import Table from "../../components/Table/Table";
import DayTable from "../../components/DayTable/DayTable";
import Days from "../../components/Days/Days";
import DaysPicker from "../../components/DaysPicker/DaysPicker";
import { getUserById } from "../../helpers/user/user";
import {
  getCallerDate,
  getTable,
  getWeekId,
} from "../../redux/caller/caller-selectors";
import { getCallerCurrentWeek, getCallerWeek,getCallerWeekByCourse, getCallerCurrentWeekByCourse } from "../../redux/caller/caller-operations";

import Select from "../../components/Select/Select";
import { getCourses } from "../../helpers/course/course";

import { isManagerLoading } from "../../redux/manager/manager-selectors";
import { getCallerLoading } from "../../redux/caller/caller-selectors";
import CrmLinks from "../../components/CrmLinks/CrmLinks";

export default function CallerPage() {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const tableDate = useSelector(getCallerDate);
  const table = useSelector(getTable);
  const weekId = useSelector(getWeekId);
  const { callerId } = useParams();
  const [callerName, setCallerName] = useState("");
  
  const managerLoading = useSelector(isManagerLoading);
  const callerLoading = useSelector(getCallerLoading);

  const [courseId, setCourses] = useState(3);

    useEffect(() => {
      dispatch(getCallerCurrentWeekByCourse(courseId));
    },[]);

    useEffect(() => {
    //dispatch(getCallerCurrentWeek(+callerId));
    //dispatch(getCallerCurrentWeekByCourse(courseId));
    if(weekId){
    dispatch(getCallerWeekByCourse({ weekId, courseId }));
    }

    getUserById(+callerId)
      .then((data) => {
        setCallerName(data.data.name);
      })
      .catch((err) => {
        setError(err);
      });
  }, [dispatch, callerId, courseId]);

  
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  function setDayIndex(num) {
    setCurrentDayIndex(num);
  }
  
  return (
    <>
      <Header endpoints={[
          { text: "Current Meetings", path: path.currentManagers },
          { text: "Search by CRM", path: path.pageCrm },
        ]} user={{ name: callerName, role: "Caller" }} />
        <Outlet />
      <div className={styles.main__wrapper}>
        <BgWrapper top={-160} title="Caller" />
        <p className={styles.free__places}>
          <span className={styles.free__span}>--</span> - number of free places
        </p>
        <section className={styles.tableSection}>

        {managerLoading || callerLoading ? <div className={styles.loadingBackdrop}></div> : null}
        <Select
              classname={styles.select__label2}
              value={courseId}
              setValue={setCourses}
              request={getCourses}
              label="course"
              defaultValue="Select course"
              title="Course:"
            />

          <DatePicker changeDateFn={getCallerWeekByCourse} tableDate={tableDate} courseId={courseId} caller />
         {window.innerWidth > 1160 ? (
        <Days caller />
      ) : (
        <DaysPicker caller setDayIndex={setDayIndex} />
      )}
       {window.innerWidth > 1160 ? (
        <Table table={table} weekId={weekId} courseId={courseId} callerName={callerName} caller/>
      ) : (
        <DayTable
          weekId={weekId} 
          table={table[currentDayIndex]}
          dayIndex={currentDayIndex}
          caller
        />
      )}
          {error && <p className={styles.free__places}>{error.message}</p>}
        </section>
        {/* <div className={styles.main_wrapper}>
          <h3 className={styles.main_title}>Search by CRM link</h3>
            <div className={styles.main_wrapper2}>
              <CrmLinks setCourses={setCourses}  caller/>
            </div>
        </div> */}
      </div>
    </>
  );
}
