import React from 'react';
import Select from 'react-select';
import Switch from 'react-switch';
import {useDispatch, useSelector} from 'react-redux';
import styles from '../../styles/teacher.module.scss';
import FormInput from '../../components/FormInput/FormInput';

export default function AppointmentButtons({
  startDate,
  isReplacement,
  setStartDate,
  endDate,
  setEndDate,
  courses,
  setTeachersIds,
  setSelectedCourse,
  selectedClassType,
  setIsReplacement,
  handleClose,
  selectedSlotsAmount,
  setSelectedClassType,
  clearTable,
  setTeacherType,
  teacherType
}) {
  const dispatch = useDispatch();
  return (
    <>
      <div className={styles.chooser_selector__date_wrapper}>
        <div className={styles.chooser_selector__item__date}>
          <FormInput
            type={'date'}
            title={'Start'}
            value={startDate}
            defaultValue={isReplacement ? startDate : null}
            // pattern="(0[1-9]|[12][0-9]|3[01]).(0[1-9]|1[0-2]).\d{4}"
            handler={setStartDate}></FormInput>
        </div>
        <div className={styles.chooser_selector__item__date}>
          <FormInput
            type={'date'}
            title={'End'}
            classname={'right'}
            value={endDate}
            pattern="\d{2}.\d{2}.\d{4}"
            handler={setEndDate}></FormInput>
        </div>
      </div>
      <div className={styles.chooser_selector}>
        <div className={styles.chooser_selector__container}>
          <div className={styles.chooser_selector__item}>
            <Select
              options={courses}
              placeholder="Select course"
              required
              className={`${styles.selector} ${styles.selector__filtering}`}
              onChange={choice => {
                dispatch({type: 'CLEAN_SELECTED_SLOTS'});
                setTeachersIds([]);
                setSelectedCourse(choice.value);
              }}
            />
          </div>
          <div className={styles.chooser_selector__item}>
            <Select
              key={Math.random() * 1000 - 10}
              className={`${styles.selector} ${styles.selector__filtering}`}
              placeholder="Lesson Type"
              value={
                selectedClassType !== null &&
                [
                  {label: 'Group', value: 0},
                  {label: 'Individual', value: 1}
                ].filter(el => el.value === selectedClassType)
              }
              options={[
                {label: 'Group', value: 0},
                {label: 'Individual', value: 1}
              ]}
              required
              onChange={choice => {
                dispatch({type: 'CLEAN_SELECTED_SLOTS'});
                setSelectedClassType(choice.value);
              }}
            />
          </div>
        </div>
        <div className={`${styles.replacement_wrapper}`}>
          <div>
            <label>
              <span className={styles.date_selector}>Replacement</span>
            </label>
            <div className={styles.replacement_wrapper__switch}>
              <Switch
                className={styles.remove_svg_switch}
                onChange={() => {
                  setIsReplacement(!isReplacement);
                }}
                checked={isReplacement}
              />
            </div>
          </div>
          <div>
            <div className={styles.replacement_wrapper__switch__teacher_type}>
              <span className={styles.date_selector}>Soft</span>
              <Switch
                className={styles.remove_svg_switch}
                onChange={() => {
                  setTeacherType(teacherType === 2 ? 1 : 2);
                }}
                checked={teacherType === 2}
              />
              <span className={styles.date_selector}>Tech</span>
            </div>
          </div>
        </div>
        <div
          className={`${styles.chooser_selector__item} ${styles.chooser_selector__item__buttons}`}>
          <button
            onClick={handleClose}
            className={`${styles.button} ${styles.button__add}`}
            disabled={selectedSlotsAmount === 0}>
            Create
          </button>
          <button
            onClick={e => {
              clearTable();
            }}
            className={`${styles.button} ${styles.button__delete}`}>
            Clear
          </button>
        </div>
      </div>
    </>
  );
}
