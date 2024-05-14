import styles from './InputSubmit.module.scss';

const InputSubmit = ({buttonTitle}) => {
  return (
    <input
      className={styles.input__submit}
      type="submit"
      value={buttonTitle}
      onClick={() => {
        const root = document.querySelector('#root');
        document.body.style.overflow = 'auto';
        root.style.overflow = 'auto';
      }}
    />
  );
};

export default InputSubmit;
