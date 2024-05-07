import React from 'react';
import styles from './Modal.module.scss';
import {createPortal} from 'react-dom';
import {Fade} from 'react-awesome-reveal';
import classNames from 'classnames';

const modalRef = document.querySelector('#root-modal');
const Modal = props => {
  return createPortal(
    <div
      className={classNames(styles['Overlay'], styles[props.classname_wrapper])}
      style={{zIndex: props.index}}
      onClick={props.onClose}>
      <Fade triggerOnce duration={250}>
        <div
          className={classNames(styles['Modal'], styles[props.classname_box])}
          onClick={e => e.stopPropagation()}>
          {props.children}
        </div>
      </Fade>
    </div>,
    modalRef
  );
};

export default Modal;
