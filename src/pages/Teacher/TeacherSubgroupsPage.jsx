import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {getSubGroups} from '../../helpers/subgroup/subgroup';
import {useSelector} from 'react-redux';
import {format} from 'date-fns';
import styles from '../../styles/teacher.module.scss';
import tableStyles from '../../styles/table.module.scss';
import {getCourses} from '../../helpers/course/course';
import FormInput from '../../components/FormInput/FormInput';
import {useParams} from 'react-router-dom';
export default function TeacherSubgroupPage() {
  const [subgroups, setSubgroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const {teacherId} = useParams() || null;
  const [filterName, setFilterName] = useState('');
  const [filterCourse, setFilterCourse] = useState([]);
  const userId = useSelector(state => state.auth.user.id);
  const fetchSubgroups = async () => {
    try {
      const data = await getSubGroups(`mentorId=${teacherId ? teacherId : userId}`);
      setSubgroups(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(
        res.data.map(course => {
          return {label: course.name, value: course.id};
        })
      );
    } catch (error) {}
  };
  useEffect(() => {
    if (userId) {
      fetchSubgroups();
      fetchCourses();
    }
  }, []);

  const filteredSubgroups = subgroups.filter(group => {
    return (
      group.name.toLowerCase().includes(filterName.toLowerCase()) &&
      (filterCourse.length > 0 ? filterCourse.map(el => el.value).includes(group.CourseId) : true)
    );
  });
  return (
    <>
      <div className={styles.filters}>
        <Select
          className={`${styles.selector} ${styles.selector__filtering} ${styles.filters__item}`}
          isClearable
          value={filterCourse}
          options={courses}
          placeholder="Select course"
          isMulti
          onChange={e => setFilterCourse(e)}
        />
        <div className={`${styles.filters__item}`}>
          <FormInput
            // width={'100%'}
            // input_width={'100%'}
            type="text"
            placeholder="Filter by name"
            value={filterName}
            handler={setFilterName}
          />
        </div>
      </div>
      <div>
        <div className={`${tableStyles.header} ${tableStyles.header__mySubgroup}`}>
          <div className={`${tableStyles.cell__header} ${tableStyles.cell__header__mySubgroup}`}>
            Name
          </div>
          <div className={`${tableStyles.cell__header} ${tableStyles.cell__header__mySubgroup}`}>
            Course
          </div>
          <div className={`${tableStyles.cell__header} ${tableStyles.cell__header__mySubgroup}`}>
            Appointer
          </div>
          <div className={`${tableStyles.cell__header} ${tableStyles.cell__header__mySubgroup}`}>
            Descripion
          </div>
          <div className={`${tableStyles.cell__header} ${tableStyles.cell__header__mySubgroup}`}>
            Schedule
          </div>
        </div>
        <div className={`${tableStyles.calendar} ${tableStyles.scroller}`}>
          <table className={tableStyles.tableBody}>
            <tbody>
              {filteredSubgroups.length > 0 &&
                filteredSubgroups.map((group, index) => {
                  return (
                    <tr key={group.id}>
                      <td className={tableStyles.cell__mySubgroup}>
                        <div
                          className={`${tableStyles.cell} ${tableStyles.cell__outer} ${tableStyles.cell__mySubgroup}`}>
                          {group.name}
                        </div>
                      </td>
                      <td className={tableStyles.cell__mySubgroup}>
                        <div
                          className={`${tableStyles.cell} ${tableStyles.cell__mySubgroup} ${
                            index === 0 || index === filteredSubgroups.length - 1
                              ? tableStyles.cell__outer
                              : tableStyles.cell__inner
                          }`}>
                          {group.Course.name}
                        </div>
                      </td>
                      <td className={tableStyles.cell__mySubgroup}>
                        <div
                          className={`${tableStyles.cell} ${
                            index === 0 || index === filteredSubgroups.length - 1
                              ? tableStyles.cell__outer
                              : tableStyles.cell__inner
                          } ${tableStyles.cell__mySubgroup}`}>
                          {group.Admin.name}
                        </div>
                      </td>
                      <td className={tableStyles.cell__mySubgroup__description}>
                        <div
                          className={`${tableStyles.cell} ${
                            index === 0 || index === filteredSubgroups.length - 1
                              ? tableStyles.cell__outer
                              : tableStyles.cell__inner
                          } ${tableStyles.cell__mySubgroup}`}>
                          {group.description}
                        </div>
                      </td>
                      <td className={tableStyles.cell__mySubgroup} key={group.id}>
                        <div
                          className={`${tableStyles.cell} ${tableStyles.cell__outer} ${tableStyles.cell__mySubgroup}`}>
                          {format(group.startDate, 'dd.MM') + '-' + format(group.endDate, 'dd.MM')}
                          <br />
                          {group.schedule.split(',').map(el => {
                            return (
                              <>
                                {el} <br />
                              </>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
