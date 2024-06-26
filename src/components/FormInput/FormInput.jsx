import styles from '../../styles/FormInput.module.scss';
import React from 'react';
import classnames from 'classnames';

const FormInput = ({
  classname,
  label_classname,
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
  height,
  max,
  disabled,
  alignValue,
  textArea = false,
  appointmentLength = 3
}) => {
  return (
    <label
      className={classnames(styles.input__label, styles[label_classname])}
      style={{width, height}}>
      {title && <p className={classnames(styles.input__title, styles[`${classname}`])}>{title}</p>}
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
          style={{height: height}}
          maxLength={max}
          placeholder={placeholder}
          autoComplete="off"
          onClick={type === 'button' ? handler : () => {}}
          onChange={e => {
            handler(e.currentTarget.value);
          }}
        />
      )}
    </label>
  );
};

export default FormInput;
