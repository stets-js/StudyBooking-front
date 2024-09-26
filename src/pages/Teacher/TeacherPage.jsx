import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import Joyride from 'react-joyride';

import TeacherTable from '../../components/TeacherTable/TeacherTable';
import InfoButton from '../../components/Buttons/Info';

export default function TeacherPage({MIC_flag = false}) {
  const {teacherId} = useParams() || null;
  let userId = useSelector(state => state.auth.user.id);
  let isAdmin = false;
  const userRole = useSelector(state => state.auth.user.role);
  if (teacherId) {
    userId = teacherId;
    isAdmin = true;
  } //case when admin is logged in and wants to see another teachers schedule

  const steps = [
    {
      target: '#nav_mentor',
      content: 'This is my Navigation!',
      disableBeacon: true
    },
    {
      target: '#thead',
      disableBeacon: true,
      content: 'This is header!'
    },
    {
      target: '#tbody',
      disableBeacon: true,
      content: 'This is body!'
    }
  ];
  const [runTour, setRunTour] = useState(false);

  const handleTourStart = () => {
    setRunTour(true);
  };
  return (
    <>
      {isAdmin && (
        <>
          <InfoButton onClick={handleTourStart} text={'Start Tour'}></InfoButton>
          <Joyride
            steps={steps}
            run={runTour}
            continuous={true}
            showProgress={true}
            showSkipButton={true}
            disableOverlayClose={true}
            callback={data => {
              const {status} = data;
              if (['finished', 'skipped'].includes(status)) {
                setRunTour(false);
              }
            }}
          />
        </>
      )}
      <TeacherTable isAdmin={isAdmin} userId={userId} MIC_flag={MIC_flag}></TeacherTable>;
    </>
  );
}
