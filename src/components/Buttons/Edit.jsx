import React from 'react';

import buttonStyles from './buttons.module.scss';

export default function EditButton({onClick, classname, text = 'Edit'}) {
  return (
    <button
      className={`${buttonStyles.button} ${buttonStyles.button__edit} ${buttonStyles[classname]}`}
      onClick={() => onClick()}>
      {text}
    </button>
  );
}
