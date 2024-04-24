import React from 'react';

import buttonStyles from './buttons.module.scss';

export default function EditButton({onClick, classname, text = 'Edit', disabled = 0}) {
  console.log(disabled);
  return (
    <button
      disabled={disabled}
      className={`${buttonStyles.button} ${buttonStyles[classname]} ${buttonStyles.button__edit} `}
      onClick={() => onClick()}>
      {text}
    </button>
  );
}
