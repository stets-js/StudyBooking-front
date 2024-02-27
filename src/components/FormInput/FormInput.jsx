import styles from '../../styles/FormInput.module.scss';
import React from 'react';
import classnames from 'classnames';

const FormInput = ({
  classname,
  title,
  type,
  name,
  isRequired,
  placeholder,
  value,
  handler,
  pattern,
  min,
  width,
  max,
  disabled,
  alignValue,
  textArea = false,
  appointmentLength = 3
}) => {
  return (
    <label className={styles.input__label} style={{width: width}}>
      <p className={classnames(styles.input__title, styles[`${classname}`])}>{title}</p>
      {textArea ? (
        <textarea
          className={classnames(
            styles.autoheigh,
            styles.input__textarea,
            styles.input,
            styles[`${classname}`]
          )}
          disabled={disabled}
          // type={type}
          name={name}
          required={isRequired}
          value={value}
          pattern={pattern}
          minLength={min}
          maxLength={max}
          placeholder={placeholder}
          autoComplete="off"
          //min height of it
          rows={appointmentLength < 2 ? 2 : appointmentLength}
          onChange={e => {
            handler(e.currentTarget.value);
          }}></textarea>
      ) : (
        <input
          className={classnames(
            styles.input,
            alignValue ? styles.padding : '',
            styles[`${classname}`]
          )}
          disabled={disabled}
          type={type}
          name={name}
          required={isRequired}
          value={value}
          pattern={pattern}
          minLength={min}
          maxLength={max}
          placeholder={placeholder}
          autoComplete="off"
          onClick={type === 'button' ? handler : () => {}}
          onChange={e => {
            console.log(123);
            handler(e.currentTarget.value);
          }}
        />
      )}
    </label>
  );
};

export default FormInput;
