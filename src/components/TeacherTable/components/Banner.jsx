import React from 'react';
import EditButton from '../../Buttons/Edit';
import {useConfirm} from 'material-ui-confirm';
import {useDispatch} from 'react-redux';

import {patchUser} from '../../../helpers/user/user';
import styles from './banner.module.scss';
export default function Banner({user, setUser}) {
  const confirm = useConfirm();
  const dispatch = useDispatch();
  if (user.isPrevSubgroupPlaced) return <></>;
  return (
    <div className={styles.banner__wrapper}>
      <div className={styles.banner__container}>
        <div>Placed all your previous subgroup?</div>
        <EditButton
          onClick={async () => {
            try {
              await confirm({
                description: 'Are you sure you placed all your subgroups (Groups, Individuals)? ',
                confirmationText: 'Yes',
                confirmationButtonProps: {autoFocus: true}
              });
              const res = await patchUser({id: user.id, isPrevSubgroupPlaced: true});
              console.log(res);
              setUser(prev => {
                return {...prev, isPrevSubgroupPlaced: true};
              });
            } catch (e) {}
          }}
          text={'Confirm'}></EditButton>
      </div>
    </div>
  );
}
