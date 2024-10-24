import {format} from 'date-fns';
import React, {useEffect, useState} from 'react';
import classNames from 'classnames';

import styles from '../../components/LessonsPage/statistic.module.scss';
import tableStyles from '../../styles/table.module.scss';
import LessonCard from '../../components/LessonsPage/LessonCard';
import FilteringBlock from '../../components/LessonsPage/FilteringBlock';
import DateTable from '../../components/LessonsPage/DateTable';
import {fetchLessons} from '../../components/LessonsPage/functions';
import {useTranslation} from 'react-i18next';

export default function LessonsPage() {
  const {t} = useTranslation('global');

  const [lessons, setLessons] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currDate, setCurrDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [slotsData, setSlotsData] = useState({
    startingTime: 9,
    amount: 26,
    teamLeadOnly: false,
    replacements: false
  });

  useEffect(() => {
    fetchLessons(
      `date=${format(currDate, 'yyyy-MM-dd')}${
        selectedCourse ? '&courseId=' + selectedCourse : ''
      }${slotsData.teamLeadOnly ? '&teamLeadOnly=true' : ''}${
        slotsData.replacements ? '&replacements=true' : ''
      }`,
      setLessons
    );
  }, [selectedCourse, currDate, slotsData]);
  return (
    <>
      <FilteringBlock
        setSelectedCourse={setSelectedCourse}
        isTeamLead
        onSwitchChange={checked => {
          console.log(checked);

          setSlotsData(prev => {
            let obj = {};
            if (checked.fullDay) {
              obj = {...obj, ...{startingTime: 0, amount: 48}};
            } else {
              obj = {...obj, ...{startingTime: 9, amount: 26}};
            }
            obj = {...obj, replacements: checked.replacements, teamLeadOnly: checked.teamLeadOnly};
            return obj;
          });
        }}
        currDate={currDate}
        setCurrDate={setCurrDate}></FilteringBlock>
      <div className={styles.main}>
        <DateTable
          slotsData={slotsData}
          lessons={lessons}
          selectedTime={selectedTime}
          onClick={time => setSelectedTime(time)}
        />
        <div className={classNames(styles.main__cards, tableStyles.calendar, tableStyles.scroller)}>
          {selectedTime.length > 0 ? (
            lessons[selectedTime].map((lesson, index) => {
              return <LessonCard lesson={lesson} setLessons={setLessons}></LessonCard>;
            })
          ) : (
            <h2>{t('lessons.select')}</h2>
          )}
        </div>
      </div>
    </>
  );
}
