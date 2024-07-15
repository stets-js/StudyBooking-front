import React from 'react';

import buttonStyles from './buttons.module.scss';

export default function ReferalButton({onClick, classname, text = 'Info', disabled = 0}) {
  return (
    <button
      disabled={disabled}
      className={`${buttonStyles.button} ${buttonStyles[classname]} ${buttonStyles.button__referal}`}
      onClick={() => onClick()}>
      {text}
    </button>
  );
}
