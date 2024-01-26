import React from "react";
import classNames from 'classnames';
import styles from "./CurrentMeetingsStatusDefinition.module.scss";
import BgWrapper from "../BgWrapper/BgWrapper";

const CurrentMeetingsStatusDefinition = () => {
  return (
    <BgWrapper top={-80} title="Current Meetings">
      <div className={styles.wrapperStatsDefins}>
        <div className={classNames(styles.statDefin, styles.bck_scheduled)}>Scheduled</div>
        <div className={classNames(styles.statDefin, styles.bck_confirmed)}>Confirmed</div>
        <div className={classNames(styles.statDefin, styles.bck_orange)}>Going on now</div>
        <div className={classNames(styles.statDefin, styles.bck_green)}>
          Successfully completed
        </div>
        <div className={classNames(styles.statDefin, styles.bck_red)}>
          Conducted unsuccessfully
        </div>
        <div className={classNames(styles.statDefin, styles.bck_yellow)}>
          working
        </div>
      </div>
      </BgWrapper>
  );
};

export default CurrentMeetingsStatusDefinition;
