import React from "react";
import { useState } from "react";
import styles from "./SortByBox.module.scss";
import { ClassNames } from "@emotion/react";
import classNames from "classnames";

export default function SortByBox({
  sortText,
  sortTextFunc,
  sortMan,
  sortMangFunc,
}) {
  const [sortStatus, setSortStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(false);

  const changeSortStatus = () => {
    const curSortStatus = sortStatus;
    if (curSortStatus) {
      setSortStatus(false);
      sortTextFunc(sortStatus);
    } else {
      setSortStatus(true);
      sortTextFunc(sortStatus);
    }
  };
  const changeSelectedStatus = () => {
    const curSelectStatus = selectedStatus;
    if (curSelectStatus) {
      setSelectedStatus(false);
      sortMangFunc(selectedStatus);
    } else {
      setSelectedStatus(true);
      sortMangFunc(selectedStatus);
    }
  };

  return (
    <div className={styles.container}>
      Sort By
      <div className={sortStatus ? styles.sortBox_on : styles.sortBox}>
        <div className={styles.sortBoxText} onClick={changeSortStatus}>
          {sortText}
        </div>
      </div>
      {sortMan ? (
        <>
          <div className={selectedStatus ? styles.sortBox_on : styles.sortBox}>
            <div className={styles.sortBoxText} onClick={changeSelectedStatus}>
              {sortMan}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
  {
    /* <div className={styles.tick_container}>
              <div className={styles.arrow_left}>{"<"}</div>
              <div className={styles.arrow_right} style={{ cursor: "default" }}>
                {"<"}
              </div>
            </div> */
  }
}
