import React from 'react';
import styles from './Modal.module.scss';
import {createPortal} from 'react-dom';
import {Fade} from 'react-awesome-reveal';
import classNames from 'classnames';

const modalRef = document.querySelector('#root-modal');
const root = document.querySelector('#root');
const Modal = props => {
  if (props.open && !props?.classname_wrapper?.includes('login')) {
    console.log(); // dont remove!
    // document.body.style.overflow = 'hidden';
    // root.style.overflow = 'hidden';
  }
  return createPortal(
    <div
      className={classNames(styles['Overlay'], styles[props.classname_wrapper])}
      style={{zIndex: props.index}}
      onClick={() => {
        props.onClose();
        document.body.style.overflow = 'auto';
        root.style.overflow = 'auto';
      }}>
      <Fade triggerOnce duration={250}>
        <div
          className={classNames(styles['Modal'], styles[props.classname_box])}
          onClick={e => {
            e.stopPropagation();
          }}>
          {props.children}
        </div>
      </Fade>
    </div>,
    modalRef
  );
};

export default Modal;
