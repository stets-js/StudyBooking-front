import React, {useEffect, useState} from 'react';
import Select from 'react-select';

import styles from '../../styles/teacher.module.scss';
import {deleteReplacement, getReplacements} from '../../helpers/replacement/replacement';
import FormInput from '../../components/FormInput/FormInput';
import {getCourses} from '../../helpers/course/course';
import {useConfirm} from 'material-ui-confirm';
import {success} from '@pnotify/core';
import ChangeReplacement from '../../components/modals/ChangeReplacement/ChangeReplacement';

export default function ReplacementsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [replacements, setReplacements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [render, setRender] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
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
  const fetchData = async (options = '') => {
    try {
      const res = await getReplacements(options);
      setReplacements(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const confirm = useConfirm();

  useEffect(() => {
    fetchData();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (render) {
      fetchData();
      setRender(false);
    }
  }, [render]);

  useEffect(() => {
    fetchData(selectedCourse ? 'CourseId=' + selectedCourse : '');
  }, [selectedCourse]);

  const handleDelete = async id => {
    confirm({
      description: 'Are you sure you want to delete this replacement?',
      confirmationText: 'delete',
      confirmationButtonProps: {autoFocus: true}
    })
      .then(async () => {
        await deleteReplacement(id);
        setReplacements(prev => prev.filter(el => el.id !== id));
        success({delay: 1000, text: 'Deleted successfully!'});
      })
      .catch(e => console.log('no ' + e));
  };

  const filteredReplacements = replacements.filter(element =>
    element?.SubGroup?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div>
      <div className={styles.calendar__available}>
        <div className={styles.filter_wrapper}>
          <div className={styles.grid_item}>
            <FormInput
              type="text"
              placeholder="Filter by name..."
              value={searchQuery}
              classname={'green'}
              handler={setSearchQuery}
            />
          </div>
          <Select
            className={`${styles.selector} ${styles.selector__filtering} ${styles.subgroup_selector}`}
            options={courses}
            placeholder={'Select course'}
            onChange={el => setSelectedCourse(el?.value || null)}
            isClearable></Select>
        </div>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={`${styles.columns} ${styles.sticky} ${styles.cell}`}>Subgroup</th>
              <th className={`${styles.columns} ${styles.sticky} ${styles.cell}`}>Mentor</th>
              <th className={`${styles.columns} ${styles.sticky} ${styles.cell}`}>Schedule</th>
              <th className={`${styles.columns} ${styles.sticky} ${styles.cell}`}>Action</th>
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
              filteredReplacements.length === 0 ? (
                <tr>
                  <td colSpan={4} className={`${styles.cell} ${styles.subgroup_cell}`}>
                    Ops, can't find Replacement...
                  </td>
                </tr>
              ) : (
                filteredReplacements.map(element => {
                  return (
                    <tr key={element.id}>
                      <td className={`${styles.cell} ${styles.available_cell}`}>
                        {element?.SubGroup?.name}
                      </td>
                      <td className={`${styles.cell} ${styles.available_cell}`}>
                        {element?.Mentor?.name}
                      </td>
                      <td className={`${styles.cell} ${styles.available_cell}`}>
                        {element?.schedule}
                      </td>
                      <td className={`${styles.cell} ${styles.available_cell}`}>
                        <div className={styles.action_wrapper}>
                          <button
                            className={`${styles.button} ${styles.button__edit}`}
                            onClick={() => {
                              setSelectedId(element.id);
                              setIsOpen(!isOpen);
                            }}>
                            Edit
                          </button>
                          <button
                            className={`${styles.button} ${styles.button__delete}`}
                            onClick={() => handleDelete(element.id)}>
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
      </div>
      <ChangeReplacement
        isOpen={isOpen}
        handleClose={() => setIsOpen(!isOpen)}
        setRender={setRender}
        id={selectedId}></ChangeReplacement>
    </div>
  );
}
