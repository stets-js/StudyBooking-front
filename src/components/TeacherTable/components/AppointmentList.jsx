import React, {useEffect} from 'react';

import styles from '../../../styles/teacher.module.scss';
import appointmentStyles from '../../../styles/appointment.module.scss';
import {getAppointmentTypes} from '../../../helpers/teacher/appointment-type';

export default function AppointmentList({
  setAppointmentTypes,
  appointmentTypes,
  user,
  setSelectedAppointment
}) {
  useEffect(() => {
    const fetchAppointmentType = async () => {
      try {
        const response = await getAppointmentTypes();

        setAppointmentTypes(
          response.data.sort((a, b) => {
            const order = ['replacement_group', 'replacement_private', 'free'];
            return order.indexOf(a.name) - order.indexOf(b.name);
          })
        );

        if (appointmentTypes && appointmentTypes.length > 0) {
          setSelectedAppointment({
            id: appointmentTypes[0].id,
            name: appointmentTypes[0].name
          });
        }
      } catch (error) {
        console.error('Error fetching appointment types:', error);
      }
    };

    fetchAppointmentType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translateAppointmentTypeName = name => {
    switch (name) {
      case 'universal':
        return 'Universal';
      case 'appointed_group':
        return 'Appointed group';
      case 'appointed_private':
        return 'Appointed private';
      case 'free':
        return 'Remove';
      case 'replacement_group':
        return 'Group replacement';
      case 'replacement_private':
        return 'Private replacement';
      default:
        return name;
    }
  };

  return (
    <div className={appointmentStyles.buttons_header}>
      {appointmentTypes.map(appointmentType => (
        <button
          key={appointmentType.id}
          onClick={() => {
            if (['free', 'universal'].includes(appointmentType.name))
              setSelectedAppointment({name: appointmentType.name, id: appointmentType.id});
          }}
          className={`${appointmentStyles.type_selector} ${
            appointmentStyles.type_selector__borders
          } ${appointmentStyles[`type_selector__${appointmentType.name}`]}`}>
          {translateAppointmentTypeName(appointmentType.name)}
        </button>
      ))}
      {/* <div className={styles.teacherInfo}>Mentor: {user?.name}</div> */}
    </div>
  );
}
