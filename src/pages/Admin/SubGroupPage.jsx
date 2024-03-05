import React, {useEffect, useState} from 'react';
import {useConfirm} from 'material-ui-confirm';
import Select from 'react-select';
import {success, error} from '@pnotify/core';

import {deleteSubGroup, getSubGroups} from '../../helpers/subgroup/subgroup';
import styles from '../../styles/teacher.module.scss';
import FormInput from '../../components/FormInput/FormInput';
import {getCourses} from '../../helpers/course/course';
import ChangeSubGroup from '../../components/modals/ChangeSubGroup/ChangeSubGroup';

export default function SubGroupPage() {
  const [subGroups, setSubGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const confirm = useConfirm();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [render, setRender] = useState(false);
  const fetchData = async (query = '') => {
    try {
      setLoader(true);
      const data = await getSubGroups(query);
      setLoader(false);
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
  }, [render]);
  useEffect(() => {
    fetchData(selectedCourse !== null ? `CourseId=${selectedCourse}` : '');
  }, [selectedCourse]);

  const handleDelete = async (id, name) => {
    confirm({
      description: 'Are you sure you want to delete ' + name,
      confirmationText: 'delete',
      confirmationButtonProps: {autoFocus: true}
    })
      .then(async () => {
        await deleteSubGroup(id);
        setSubGroups(prevSubGroups => prevSubGroups.filter(subgroup => subgroup.id !== id));
        success({delay: 1000, text: 'Deleted successfully!'});
      })
      .catch(e => console.log('no ' + e));
  };

  const filteredSubGroups = subGroups.filter(element =>
    element.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className={styles.calendar__available}>
        <div className={styles.filter_wrapper}>
          <div className={styles.grid_item}>
            <FormInput
              type="text"
              title={'Search by name'}
              placeholder="Name..."
              value={searchQuery}
              handler={setSearchQuery}
            />
          </div>
          <Select
            className={`${styles.selector} ${styles.subgroup_selector}`}
            options={courses}
            placeholder={'Select course'}
            onChange={el => setSelectedCourse(el?.value || null)}
            isClearable></Select>
        </div>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Назва</th>
              <th>Дія</th>
            </tr>
          </thead>
          <tbody>
            {
              // loader ? (
              //   <tr>
              //     <td colSpan={2} className={`${styles.cell} ${styles.subgroup_cell}`}>
              //       Loading...
              //     </td>
              //   </tr>
              // ) :
              filteredSubGroups.length === 0 ? (
                <tr>
                  <td colSpan={2} className={`${styles.cell} ${styles.subgroup_cell}`}>
                    Ops, can't find this SubGroup...
                  </td>
                </tr>
              ) : (
                filteredSubGroups.map(element => {
                  return (
                    <tr key={element.id}>
                      <td className={`${styles.cell} ${styles.subgroup_cell}`}>{element.name}</td>
                      <td className={`${styles.cell} ${styles.subgroup_cell}`}>
                        <div className={styles.action_wrapper}>
                          <button
                            className={`${styles.button} ${styles.button__edit}`}
                            onClick={() => {
                              setIsOpen(!isOpen);
                              setSelectedId(element.id);
                            }}>
                            Edit
                          </button>
                          <button
                            className={`${styles.button} ${styles.button__delete}`}
                            onClick={() => handleDelete(element.id, element.name)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )
            }
          </tbody>
        </table>
        <ChangeSubGroup
          isOpen={isOpen}
          handleClose={() => setIsOpen(!isOpen)}
          setRender={setRender}
          id={selectedId}></ChangeSubGroup>
      </div>
    </div>
  );
}
