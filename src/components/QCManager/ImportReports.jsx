import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {success} from '@pnotify/core';
import styles from './Manager.module.scss';
import {addReports, fetchReports, getSheets} from '../../helpers/spreadsheet/spreadsheet';
import SelectStyles from '../../styles/selector.module.scss';
import EditButton from '../Buttons/Edit';
export default function ImportReports({setReports}) {
  const spreadsheetId = '1gbBpJfNZzkURPnOIghqPWDxkDovdRKVK_YxlotmkcIY';
  const [sheets, setSheets] = useState([]);
  const fetchSheets = async () => {
    const {data} = await getSheets(spreadsheetId);
    setSheets(
      data.data.sheets.map((el, index) => {
        return {label: el, value: index};
      })
    );
  };

  useEffect(() => {
    fetchSheets();
  }, []);
  const [total, setTotal] = useState(0);
  const [checked, setChecked] = useState(0);
  const [notFound, setNotFound] = useState([]);

  const newReports = async () => {
    setTotal(0);
    setChecked(0);
    const res = await addReports(spreadsheetId, selectedSheet);
    console.log(res);
    if (res) {
      setNotFound(res.data.notFound);
      setReports(res.data.reports.slice(0, 30));
    } // const res = await fetchReports(spreadsheetId, selectedSheet);
    // console.log(res);
    // if (res) {
    //   success({text: 'Звіти вигрузились з таблиці, починається загрузко до букінга', delay: 1000});
    //   setTotal(res.data.length);
    //   if (res.data.length > 50) {
    //     console.log(res.data.length / 50);
    //     for (let i = 0; i < res.data.length / 50; i++) {
    //       const slicedData = res.data.slice(i * 50, 50 * i + 50);
    //       const result = await addReports(spreadsheetId, selectedSheet, {
    //         rows: slicedData,
    //         sheetName: selectedSheet
    //       });
    //       console.log(result);
    //       setChecked(prev => prev + slicedData.length);
    //       setReports(prev => [...prev, ...result.data.reports]);
    //       if (result.data.notFound.length > 0)
    //         setNotFound(prev => [...prev, ...result.data.notFound]);
    //     }
    //   }
    // }
  };
  const [selectedSheet, setSelectedSheet] = useState(null);
  return (
    <>
      <div className={styles.report__wrapper}>
        <Select
          className={SelectStyles.selector}
          options={sheets}
          onChange={e => setSelectedSheet(e.label)}></Select>
        <span>
          Завантажено {checked} з {total}
        </span>
        <EditButton
          text="Вигрузити"
          onClick={() => {
            if (!selectedSheet) return;
            success({text: 'Запущено процесс вигрузки данних', delay: 1000});
            newReports();
          }}></EditButton>
      </div>
      {notFound.length > 0 && (
        <div className={styles.notFound__wrapper}>
          <span className={styles.notFound}>
            Увага, не було знайдено наступних менторів, передайте цей список до розробників
          </span>
          <div>
            {notFound.map(el => (
              <p>{el}</p>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
