import React from "react";
import styles from "../SuperAdmin/SuperAdminPage.module.scss";
import path from "../../helpers/routerPath";

import Header from "../../components/Header/Header";
import BgWrapper from "../../components/BgWrapper/BgWrapper";

const currentManagers = () => {
  return (
    <>
  <Header
        endpoints={[
          {text:"List View", path: path.currentManagersList},
          {text:"Table View", path: path.currentManagersTable}
        ]}
      />

      <BgWrapper top={-200} title="Current Meetings" />
    </>
  );
};

export default currentManagers;
