import React from 'react';

import buttonStyles from './buttons.module.scss';
import {useTranslation} from 'react-i18next';

export default function EditButton({onClick, classname, text, disabled = 0}) {
  const {t} = useTranslation('global');

  return (
    <button
      disabled={disabled}
      className={`${buttonStyles.button} ${buttonStyles[classname]} ${buttonStyles.button__edit} `}
      onClick={e => {
        e.preventDefault();
        onClick();
      }}>
      {text || t('buttons.edit')}
    </button>
  );
}
