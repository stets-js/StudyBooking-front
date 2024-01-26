import React from "react";
import styles from "../SuperAdmin/SuperAdminPage.module.scss";
import CrmLinks from "../../components/CrmLinks/CrmLinks";

import Header from "../../components/Header/Header";

const CrmPage = ({ page }) => {
  
  return (
    <>
      {page ? (
        <>
          <Header
            endpoints={[
              { text: null, path: null }
            ]}
            // user={{ name: callerName, role: "Caller" }}
          />
          <div className={styles.main_wrapper}>
            <h3 className={styles.main_title}>Search by CRM link</h3>
            <div className={styles.main_wrapper2}>
              <CrmLinks />
            </div>
          </div>
        </>
      ) : (
        <div className={styles.main_wrapper}>
          <h3 className={styles.main_title}>Search by CRM link</h3>
          <div className={styles.main_wrapper2}>
            <CrmLinks />
          </div>
        </div>
      )}
    </>
  );
};

export default CrmPage;
