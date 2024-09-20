import React, {useEffect, useState} from 'react';
import Select from 'react-select';
// import Switch from 'react-switch';

import styles from '../../styles/teacher.module.scss';
import FormInput from '../../components/FormInput/FormInput';
import {getCourses} from '../../helpers/course/course';
import ChangeSubGroup from '../../components/modals/ChangeSubGroup/ChangeSubGroup';
import NewSubgroup from '../../components/modals/NewSubgroup/NewSubgroup';
import SubgroupTable from '../../components/SubgroupPage/SubgroupTable';
import {useTranslation} from 'react-i18next';

export default function SubGroupPage() {
  const {t} = useTranslation('global');

  const [subGroups, setSubGroups] = useState([]);
  const [offset, setOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCreation, setIsOpenCreation] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // const [isOneDay, setIsOneDay] = useState(false);
  const fetchCourses = async () => {
    try {
      const courses = await getCourses();
      setCourses(
        courses.data.map(el => {
          return {label: el.name, value: el.id};
        })
      );
    } catch (e) {
      // error('Something went wrong');
      console.log(e);
    }
  };
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div>
      <div>
        <button
          className={styles.add_btn}
          onClick={() => {
            setIsOpenCreation(!isOpenCreation);
          }}>
          {t('buttons.add')}
        </button>
        <div className={`${styles.filter_wrapper} ${styles.filter_wrapper__available}`}>
          <Select
            className={`${styles.selector} ${styles.selector__filtering} ${styles.filter_wrapper__available__item}`}
            options={courses}
            placeholder={t('admin.subgroups.course')}
            onChange={el => {
              setOffset(0);
              setSelectedCourse(el?.value || null);
            }}
            // isDisabled={isOneDay}
            isClearable></Select>
          <div className={`${styles.filter_wrapper__available__item} ${styles.name_long}`}>
            <FormInput
              type="text"
              placeholder={t('admin.subgroups.name')}
              height={'52px'}
              // disabled={isOneDay}
              value={searchQuery}
              handler={setSearchQuery}
            />
          </div>
          {/* <div className={`${styles.one_day_wrapper} ${styles.filter_wrapper__available__item}`}>
            <label>
              <span className={styles.date_selector}>One day</span>
            </label>
            <Switch
              className={styles.remove_svg_switch}
              trackColor={{true: 'red', false: 'grey'}}
              onChange={() => {
                setIsOneDay(!isOneDay);
              }}
              checked={isOneDay}
            />
          </div> */}
        </div>

        {/* {!isOneDay ? ( */}
        <SubgroupTable
          offset={offset}
          setOffset={setOffset}
          setSubGroups={setSubGroups}
          setIsOpen={setIsOpen}
          setSelectedId={setSelectedId}
          selectedCourse={selectedCourse}
          subGroups={subGroups}
          searchQuery={searchQuery}
          // filteredSubGroups={filteredSubGroups}
        ></SubgroupTable>
        {/* ) : (
          <CalendarSubgroupTable
            isOneDay={isOneDay}
            selectedCourse={selectedCourse}></CalendarSubgroupTable>
        )} */}
        <NewSubgroup
          isOpen={isOpenCreation}
          handleClose={() => {
            setIsOpenCreation(false);
          }}></NewSubgroup>
        <ChangeSubGroup
          isOpen={isOpen}
          handleClose={() => setIsOpen(!isOpen)}
          id={selectedId}></ChangeSubGroup>
      </div>
    </div>
  );
}
