import React, {useEffect, useState} from 'react';
import Select from 'react-select';
// import Switch from 'react-switch';
import SwitchSelector from 'react-switch-selector';

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
  const [infiniteScrollData, setInfiniteScrollData] = useState({offset: 0, limit: 40, total: 0});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCreation, setIsOpenCreation] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(0);
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
  const options = [
    {
      label: 'Усі',
      value: '0'
    },
    {
      label: 'Не призначені',
      value: '1'
    },
    {
      label: 'В очікувані',
      value: '2'
    },
    {
      label: 'Призначені',
      value: '3'
    }
  ];

  const onChange = newValue => {
    setSelectedStatus(newValue);
  };
  const initialSelectedIndex = options.findIndex(({value}) => value === selectedStatus);
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
              infiniteScrollData(prev => ({...prev, offset: 0}));
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
          <div className={styles.multi_select}>
            <SwitchSelector
              onChange={onChange}
              options={options}
              initialSelectedIndex={initialSelectedIndex}
              backgroundColor={'#d9d9d9'}
              fontColor={'#000'}
            />
            <span>({infiniteScrollData.total})</span>
          </div>
        </div>

        {/* {!isOneDay ? ( */}
        <SubgroupTable
          selectedStatus={selectedStatus}
          infiniteScrollData={infiniteScrollData}
          setInfiniteScrollData={setInfiniteScrollData}
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
