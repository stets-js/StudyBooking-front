import React, {useState, useEffect} from 'react';
import styles from '../../styles/SuperAdminPage.module.scss';

export default function UsersPage() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(!isOpen);
  };

  return <></>;
}
