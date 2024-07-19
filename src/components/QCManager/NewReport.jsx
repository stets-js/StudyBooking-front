import React from 'react';
import {useState} from 'react';
import Select from 'react-select';
import {getCourses} from '../../helpers/course/course';
import {useEffect} from 'react';
import {getMentorSubgroups, getSubGroups} from '../../helpers/subgroup/subgroup';
import styles from './Manager.module.scss';
import selectorStyles from '../../styles/selector.module.scss';
import classNames from 'classnames';
import FormInput from '../FormInput/FormInput';
import EditButton from '../Buttons/Edit';
import {createReport, getReports} from '../../helpers/manager/qcmanager';
import {format} from 'date-fns';

export default function NewReport({fetchAllReports}) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [subgrops, setSubgroups] = useState([]);
  const [selectedSubgroup, setSelectedSubgroup] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [reportData, setReportData] = useState({
    mark: null,
    link: null,
    date: format(new Date(), 'yyyy-MM-dd')
  });
  const fetchCourses = async () => {
    const data = await getCourses();
    setCourses(
      data.data.map(el => {
        return {label: el.name, value: el.id};
      })
    );
  };

  const fetchSubgroups = async () => {
    const data = await getSubGroups(`CourseId=${selectedCourse}`);
    setSubgroups(
      data.data.map(el => {
        return {label: el.name, value: el.id};
      })
    );
  };
  const fetchMentorsForSubgroup = async () => {
    const {data} = await getMentorSubgroups(`subgroupId=${selectedSubgroup}`);
    setMentors(
      data.data.map(el => {
        return {label: el.User.name, value: el.User.id};
      })
    );
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  useEffect(() => {
    if (selectedCourse) fetchSubgroups();
  }, [selectedCourse]);
  useEffect(() => {
    if (selectedSubgroup) fetchMentorsForSubgroup();
  }, [selectedSubgroup]);
  const saveNewReport = async () => {
    if (selectedMentor && reportData.date && reportData.link && reportData.mark) {
      const data = await createReport({
        mentorId: selectedMentor,
        courseId: selectedCourse,
        subgroupId: selectedSubgroup,
        ...reportData
      });
      fetchAllReports();
    }
  };
  return (
    <div className={styles.report__wrapper}>
      <Select
        className={classNames(styles.report__item, selectorStyles.selector)}
        options={courses}
        value={courses.filter(course => course.value === selectedCourse)}
        placeholder="Select course"
        required
        // className={}
        onChange={choice => {
          setSelectedCourse(choice.value);
        }}
      />
      <Select
        className={classNames(styles.report__item, selectorStyles.selector)}
        options={subgrops}
        isDisabled={!selectedCourse}
        value={subgrops.filter(subgrops => subgrops.value === selectedSubgroup)}
        placeholder="Select subgroups"
        required
        theme={theme => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary25: 'orange',
            primary: 'black'
          }
        })}
        // className={}
        onChange={choice => {
          setSelectedSubgroup(choice.value);
        }}
      />
      <Select
        className={classNames(styles.report__item, selectorStyles.selector)}
        options={mentors}
        isDisabled={!selectedSubgroup}
        value={mentors.filter(mentor => mentor.value === selectedMentor)}
        placeholder="Select Mentor"
        required
        // className={}
        onChange={choice => {
          setSelectedMentor(choice.value);
        }}
      />
      <div className={styles.report__item}>
        <FormInput
          className={styles.report__item}
          title="Дата"
          type="date"
          value={reportData.date}
          handler={e =>
            setReportData(prev => {
              return {...prev, date: e};
            })
          }
        />
      </div>
      <div className={styles.report__item}>
        <FormInput
          className={styles.report__item}
          title="Звіт з ОКЯ"
          value={reportData.link}
          placeholder={'url'}
          handler={e =>
            setReportData(prev => {
              return {...prev, link: e};
            })
          }
        />
      </div>
      <div className={styles.report__item}>
        <FormInput
          title="Оцінка"
          type="number"
          min={0}
          max={100}
          value={reportData.mark}
          handler={e =>
            setReportData(prev => {
              return {...prev, mark: e};
            })
          }
        />
      </div>
      <div className={styles.report__item}>
        <EditButton text="Зберегти" onClick={() => saveNewReport()}></EditButton>
      </div>
    </div>
  );
}
