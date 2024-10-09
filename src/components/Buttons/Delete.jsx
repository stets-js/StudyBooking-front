import React from 'react';

import buttonStyles from './buttons.module.scss';
import {useTranslation} from 'react-i18next';

export default function DeleteButton({onClick, classname, text}) {
  const {t} = useTranslation('global');
  return (
    <button
      className={`${buttonStyles.button} ${buttonStyles.button__delete} ${buttonStyles[classname]}`}
      onClick={e => {
        e.preventDefault();
        onClick();
      }}>
      {text || t('buttons.del')}
    </button>
  );
}
