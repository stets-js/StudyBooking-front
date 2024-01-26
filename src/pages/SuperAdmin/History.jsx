import React from "react";
import styles from "../SuperAdmin/SuperAdminPage.module.scss";
import path from "../../helpers/routerPath";
import Header from "../../components/Header/Header";
import BgWrapper from "../../components/BgWrapper/BgWrapper";
import { Outlet } from "react-router-dom";

const History = () => {
  return (
    <>
      <Header
        endpoints={[
          {text:"Login history", path: path.authorization},
          {text:"Appointment history", path: path.ik}
        ]}
      />
    
      <Outlet />
    </>
  );
};

export default History;
