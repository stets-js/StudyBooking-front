import React, { useState, useEffect } from "react";
import styles from "./SuperAdminPage.module.scss";
import { v4 as uuidv4 } from "uuid";
import { getAuthLogs } from "../../helpers/auth/auth";
import Arrow from "./ArrowIn"

export default function AuthLogs() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  console.log("data", data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAuthLogs();
        setData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const renderRole = (roleId) => {
    switch (roleId) {
      case 2:
        return "Manager";
      case 3:
        return "Admin";
      case 4:
        return "Caller";
      case 5:
        return "Confirmator";
      default:
        return "";
    }
  };

  const renderTableRows = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageData = data.slice(startIndex, endIndex);

    return currentPageData.map((log) => (
      <div className={styles.row} key={uuidv4()}>
        <div className={styles.cell1}>{new Date(new Date(log.date).getTime() - 2 * 60 * 60 * 1000).toLocaleString()} <Arrow /></div>
        <div className={styles.cell2}>{log.name}</div>
        <div className={styles.cell3}>{renderRole(log.role_id)}</div>
      </div>
    ));
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className={styles.auth__wrapper}>
    <div className={styles.auth__table}>
      <div className={styles.auth__header}>
        <div className={styles.auth__cellHeader}>TIMESTAMP</div>
        <div className={styles.auth__cellHeader}>USER</div>
        <div className={styles.auth__cellHeader}>ROLE</div>
      </div>
      <div className={styles.auth__cellData}>{renderTableRows()}</div>

      <div className={styles.auth__pagination}>
        <button className={styles.auth__btn} onClick={() => handlePageChange(currentPage - 1)}>Prev</button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button className={styles.auth__btn} onClick={() => handlePageChange(currentPage + 1)}>Next</button>
      </div>
    </div>
      
    </div>
  );
}
