import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {useConfirm} from 'material-ui-confirm';
import {success} from '@pnotify/core';

import styles from '../../styles/teacher.module.scss';
import tableStyles from '../../styles/table.module.scss';
import {deleteReplacement, getReplacements} from '../../helpers/replacement/replacement';
import FormInput from '../../components/FormInput/FormInput';
import {getCourses} from '../../helpers/course/course';
import ChangeReplacement from '../../components/modals/ChangeReplacement/ChangeReplacement';
import EditButton from '../../components/Buttons/Edit';
import DeleteButton from '../../components/Buttons/Delete';

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
      <div className={`${styles.filter_wrapper} ${styles.filter_wrapper__subgroup}`}>
        <Select
          className={`${styles.selector} ${styles.selector__filtering}`}
          options={courses}
          placeholder={'Select course'}
          onChange={el => setSelectedCourse(el?.value || null)}
          isClearable></Select>
        <div className={`${styles.name_long} ${styles.flex_to_right}`}>
          <FormInput
            type="text"
            placeholder="Name..."
            value={searchQuery}
            height={'52px'}
            handler={setSearchQuery}
          />
        </div>
      </div>
      <div className={`${tableStyles.calendar} ${tableStyles.scroller} `}>
        <table className={tableStyles.tableBody}>
          <tbody>
            {filteredReplacements.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className={`${tableStyles.cell} ${tableStyles.black_borders} ${tableStyles.cell__outer}`}>
                  Ops, can't find Replacement...
                </td>
              </tr>
            ) : (
              filteredReplacements.map((element, index) => {
                return (
                  <tr key={element.id}>
                    <td>
                      <div
                        className={`${tableStyles.cell} ${tableStyles.black_borders} ${tableStyles.cell__outer} ${tableStyles.cell__outer__big}`}>
                        {element?.SubGroup?.name}
                      </div>
                    </td>
                    <td key={element?.id}>
                      <div
                        className={`${tableStyles.cell} ${tableStyles.black_borders} ${
                          index === 0 || index === filteredReplacements.length - 1
                            ? tableStyles.cell__outer
                            : tableStyles.cell__inner
                        } `}>
                        {element?.Mentor?.name}
                      </div>
                    </td>
                    <td>
                      <div
                        className={`${tableStyles.cell} ${tableStyles.black_borders} ${
                          index === 0 || index === filteredReplacements.length - 1
                            ? tableStyles.cell__outer
                            : tableStyles.cell__inner
                        }`}>
                        {element?.schedule.split(',').map(date => {
                          return (
                            <>
                              {date} <br />
                            </>
                          );
                        })}
                      </div>
                    </td>
                    <td>
                      <div
                        className={`${tableStyles.cell} ${tableStyles.black_borders} ${tableStyles.cell__outer} ${tableStyles.cell__outer__big} ${styles.action_wrapper}`}>
                        <EditButton
                          onClick={() => {
                            setSelectedId(element.id);
                            setIsOpen(!isOpen);
                          }}></EditButton>

                        <DeleteButton onClick={() => handleDelete(element.id)}></DeleteButton>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
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
