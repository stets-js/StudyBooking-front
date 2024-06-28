import React from 'react';
import Select from 'react-select';
import {useDispatch} from 'react-redux';
import styles from '../../styles/teacher.module.scss';
import FormInput from '../../components/FormInput/FormInput';
// import {RadioGroup, RadioButton} from 'react-radio-buttons';
import {RadioButton, RadioGroup} from '@trendmicro/react-radio';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-radio/dist/react-radio.css';
import EditButton from '../Buttons/Edit';
import DeleteButton from '../Buttons/Delete';
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
  handleClose,
  selectedSlotsAmount,
  setSelectedClassType,
  selectedCourse,
  clearTable,
  setTeacherType,
  teacherType,
  MIC_flag
}) {
  const dispatch = useDispatch();
  const token = MIC_flag;
  let appointmentTypes = [
    {label: 'Group', value: 1},
    {label: 'Individual', value: 2},
    {label: 'Kids group', value: 11}
  ];
  if (token) appointmentTypes = [{label: 'Individual', value: 2}];
  return (
    <>
      <div className={styles.chooser_selector__date_wrapper}>
        <div className={styles.chooser_selector__item__date}>
          <FormInput
            type={'date'}
            title={'Start'}
            value={startDate}
            // defaultValue={isReplacement ? startDate : null}
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
              value={courses.filter(course => course.value === selectedCourse)}
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
              key={Math.random() * 100 - 10}
              className={`${styles.selector} ${styles.selector__filtering}`}
              placeholder="Lesson Type"
              value={
                selectedClassType !== null &&
                appointmentTypes.filter(el => el.value === selectedClassType)
              }
              options={appointmentTypes}
              required
              onChange={choice => {
                dispatch({type: 'CLEAN_SELECTED_SLOTS'});
                setSelectedClassType(choice.value);
              }}
            />
          </div>
        </div>
        <div className={`${styles.replacement_wrapper}`}>
          {!isReplacement && (
            <div>
              <div className={styles.replacement_wrapper__switch__teacher_type}>
                <RadioGroup
                  name="teacherType"
                  value={String(teacherType)}
                  onChange={event => {
                    setTeacherType(+event.target.value);
                  }}
                  className={styles.radio__group}>
                  <RadioButton value="1" className={styles.radio__button}>
                    soft
                  </RadioButton>
                  <RadioButton value="2" className={styles.radio__button}>
                    tech
                  </RadioButton>
                  {/* <RadioButton value="3" className={styles.radio__button}>
                  ulti
                </RadioButton> */}
                </RadioGroup>
              </div>
            </div>
          )}
        </div>
        <div
          className={`${styles.chooser_selector__item} ${styles.chooser_selector__item__buttons}`}>
          <EditButton
            onClick={handleClose}
            text="Create"
            disabled={selectedSlotsAmount === 0}
            classname={'button__add'}></EditButton>
          <DeleteButton
            onClick={e => {
              clearTable();
            }}
            text="Clear"></DeleteButton>
        </div>
      </div>
    </>
  );
}
