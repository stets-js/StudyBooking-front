import React, { useState, useEffect } from "react";
import styles from "./SuperAdminPage.module.scss";
import { v4 as uuidv4 } from "uuid";
import SearchSVG from "./Search_svg";
import { useLinkClickHandler } from "react-router-dom";
import { getHistory, getAppointmentHistory } from "../../helpers/history/history";
import { TailSpin } from "react-loader-spinner";

export default function ConsultationLogs() {
    const [isLoading, setIsLoading] = useState(false)
    const [inputValue, setInputValue] = useState("");
    const [data, setData] = useState(null);
    
    useEffect(() =>{
        async function getData(){
            const res =  await getHistory();
            setData(res.data)
        }
        getData()
    },[]);

    const clickHandler = async () => {
        try {
          setIsLoading(true);
          const formData = new FormData();
            formData.append('zoho_link', inputValue);
         const res =  await getAppointmentHistory(formData);
         setData(res.data)
        } catch (error) {
          console.error("Error fetching appointment logs:", error);
        } finally {
          setIsLoading(false);
          setInputValue("")
        }
      };

      const handleInputChange = (e) => {
        setInputValue(e.target.value);
      };

    return (
    <>
    <div className={styles.search__container}>
        <div className={styles.search__wrapper}>
        <input className={styles.search__input} type="text" placeholder="Enter CRM link..." value={inputValue}
          onChange={handleInputChange} />
        <button className={styles.search__btn} onClick={clickHandler} type="button">{isLoading ? <TailSpin height="30px" width="30px" color="#999DFF" /> : <SearchSVG />}</button>
        </div>
    </div>
        {data && data.length > 0 ? (
      <div className={styles.data__wrapper}>
        {data.map((item) => (
          <div key={uuidv4()} className={`${styles.data__item} ${
            item.action === "Create" ? styles.create :
            item.action === "Delete" ? styles.delete :
            item.action === "Confirmed" ? styles.confirmed : 
            item.action === "Postpone" ? styles.postpone : 
            item.action === "Update" ? styles.update : 
            item.action === "Swapped" ? styles.swapped : "" 
          }`}>
            <div className={styles.data__cell}>{new Date(new Date(item.date).getTime() - 2 * 60 * 60 * 1000).toLocaleString()}</div>
            <div className={styles.data__cell}>{item.name}</div>
            <div className={styles.data__cell}>{item.action}</div>
            <div className={styles.data__cell}>{item.zoho_link}</div>
            <div className={styles.data__cell}>{item.comments}</div>
          </div>
        ))}
      </div>
    ) : (<p style={{ marginTop: '100px' }}>No DATA available</p>)}

    </>
    )
}