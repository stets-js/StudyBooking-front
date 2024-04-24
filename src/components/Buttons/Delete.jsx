import React from 'react';

import buttonStyles from './buttons.module.scss';

export default function DeleteButton({onClick, classname, text = 'Delete'}) {
  return (
    <button
      className={`${buttonStyles.button} ${buttonStyles.button__delete} ${buttonStyles[classname]}`}
      onClick={() => onClick()}>
      {text}
    </button>
  );
}
