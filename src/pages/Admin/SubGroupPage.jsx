import React, {useEffect, useState} from 'react';
import {useConfirm} from 'material-ui-confirm';
import Select from 'react-select';
import Switch from 'react-switch';

import {getSubGroups} from '../../helpers/subgroup/subgroup';
import styles from '../../styles/teacher.module.scss';
import FormInput from '../../components/FormInput/FormInput';
import {getCourses} from '../../helpers/course/course';
import ChangeSubGroup from '../../components/modals/ChangeSubGroup/ChangeSubGroup';
import NewSubgroup from '../../components/modals/NewSubgroup/NewSubgroup';
import SubgroupTable from '../../components/SubgroupPage/SubgroupTable';
import CalendarSubgroupTable from '../../components/SubgroupPage/CalendarSubroupTable';

export default function SubGroupPage() {
  const [subGroups, setSubGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCreation, setIsOpenCreation] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [render, setRender] = useState(false);
  const [isOneDay, setIsOneDay] = useState(false);
  const fetchData = async (query = '') => {
    try {
      const data = await getSubGroups(query);
      setSubGroups(data.data);
    } catch (e) {
      // error('Something went wrong');
      console.log(e);
    }
  };
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
    //first time render
    fetchData('');
    fetchCourses();
  }, []);

  useEffect(() => {
    if (render) {
      fetchData('');
      setRender(false);
    }
  }, [render, isOneDay]);
  useEffect(() => {
    fetchData(selectedCourse !== null ? `CourseId=${selectedCourse}` : '');
  }, [selectedCourse]);

  const filteredSubGroups = subGroups.filter(element =>
    element.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div>
        <button
          className={styles.add_btn}
          onClick={() => {
            setIsOpenCreation(!isOpenCreation);
          }}>
          New
        </button>
        <div className={`${styles.filter_wrapper} ${styles.filter_wrapper__available}`}>
          <Select
            className={`${styles.selector} ${styles.selector__filtering} ${styles.filter_wrapper__available__item}`}
            options={courses}
            placeholder={'Course'}
            onChange={el => setSelectedCourse(el?.value || null)}
            isDisabled={isOneDay}
            isClearable></Select>
          <div className={`${styles.filter_wrapper__available__item} ${styles.name_long}`}>
            <FormInput
              type="text"
              placeholder="Name..."
              height={'52px'}
              disabled={isOneDay}
              value={searchQuery}
              handler={setSearchQuery}
            />
          </div>
          <div className={`${styles.one_day_wrapper} ${styles.filter_wrapper__available__item}`}>
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
          </div>
        </div>

        {!isOneDay ? (
          <SubgroupTable
            setSubGroups={setSubGroups}
            setIsOpen={setIsOpen}
            setSelectedId={setSelectedId}
            filteredSubGroups={filteredSubGroups}></SubgroupTable>
        ) : (
          <CalendarSubgroupTable
            isOneDay={isOneDay}
            selectedCourse={selectedCourse}
            fetchData={fetchData}></CalendarSubgroupTable>
        )}
        <NewSubgroup
          isOpen={isOpenCreation}
          handleClose={() => {
            setIsOpenCreation(false);
            setRender(true);
          }}></NewSubgroup>
        <ChangeSubGroup
          isOpen={isOpen}
          handleClose={() => setIsOpen(!isOpen)}
          setRender={setRender}
          id={selectedId}></ChangeSubGroup>
      </div>
    </div>
  );
}
