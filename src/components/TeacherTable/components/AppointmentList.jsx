/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect} from 'react';

import appointmentStyles from '../../../styles/appointment.module.scss';
import {getAppointmentTypes} from '../../../helpers/teacher/appointment-type';
import 'react-tooltip/dist/react-tooltip.css';
import {Tooltip} from 'react-tooltip';
import {useTranslation} from 'react-i18next';

export default function AppointmentList({
  setAppointmentTypes,
  appointmentTypes,
  user,
  setSelectedAppointment
}) {
  const {t} = useTranslation('global');

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
        return t('appointmentList.universal');
      case 'appointed_group':
        return t('appointmentList.appointed_group');
      case 'appointed_private':
        return t('appointmentList.appointed_private');
      case 'appointed_kids_group':
        return t('appointmentList.appointed_kids_group');
      case 'free':
        return t('appointmentList.free');
      case 'group':
        return t('appointmentList.group');
      case 'private':
        return t('appointmentList.private');
      case 'replacement_group':
        return t('appointmentList.replacement_group');
      case 'replacement_private':
        return t('appointmentList.replacement_private');
      case 'replacement_kids_group':
        return t('appointmentList.replacement_kids_group');
      default:
        return name;
    }
  };

  return (
    <div className={appointmentStyles.buttons_header}>
      {appointmentTypes.map(appointmentType => {
        if (!['free', 'group', 'private'].includes(appointmentType.name)) return null;

        return (
          <button
            key={appointmentType.id}
            onClick={() => {
              if (['free', 'group', 'private'].includes(appointmentType.name))
                setSelectedAppointment({
                  name: appointmentType.name,
                  id: appointmentType.id
                });
            }}
            className={`${appointmentStyles.type_selector} ${
              appointmentStyles.type_selector__borders
            } ${appointmentStyles[`type_selector__${appointmentType.name}`]}`}>
            {translateAppointmentTypeName(appointmentType.name)}
          </button>
        );
      })}
      <a
        key="tooltip-link"
        data-tooltip-id="my-tooltip"
        data-tooltip-place="right"
        className={appointmentStyles.tooltip__icon}>
        <span key="tooltip-icon" className={appointmentStyles.tooltip__icon}>
          ?
        </span>
      </a>
      <Tooltip id="my-tooltip" className={appointmentStyles.tooltip}>
        {appointmentTypes.map(appointmentType => {
          if (
            [
              'free',
              'universal',
              'group',
              'private',
              'replacement_junior_group',
              'appointed_junior_group'
            ].includes(appointmentType.name)
          )
            return null;

          return (
            <div key={appointmentType.id} className={appointmentStyles.tooltip__container}>
              <div
                className={`${appointmentStyles.circle} ${
                  appointmentStyles[`type_selector__${appointmentType.name}`]
                }`}></div>
              {translateAppointmentTypeName(appointmentType.name)}
            </div>
          );
        })}
      </Tooltip>
    </div>
  );
}
