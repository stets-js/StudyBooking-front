import React from 'react';
import {success} from '@pnotify/core';

import styles from '../../styles/teacher.module.scss';
import tableStyles from '../../styles/table.module.scss';
import {useConfirm} from 'material-ui-confirm';
import {deleteSubGroup} from '../../helpers/subgroup/subgroup';

export default function SubgroupTable({filteredSubGroups, setIsOpen, setSelectedId, setSubGroups}) {
  const confirm = useConfirm();
  const handleDelete = async (id, name) => {
    confirm({
      description: 'Are you sure you want to delete ' + name,
      confirmationText: 'delete',
      confirmationButtonProps: {autoFocus: true}
    })
      .then(async () => {
        await deleteSubGroup(id);
        setSubGroups(prevSubGroups => prevSubGroups.filter(subgroup => subgroup.id !== id));
        success({delay: 1000, text: 'Deleted successfully!'});
      })
      .catch(e => console.log('no ' + e));
  };
  return (
    <div
      className={`${tableStyles.calendar} ${tableStyles.scroller} ${tableStyles.calendar__small}`}>
      <table className={tableStyles.tableBody}>
        <tbody>
          {filteredSubGroups.length === 0 ? (
            <tr>
              <td
                colSpan={2}
                className={`${tableStyles.cell} ${tableStyles.black_borders} ${tableStyles.cell__outer}`}>
                Ops, can't find this SubGroup...
              </td>
            </tr>
          ) : (
            filteredSubGroups.map(element => {
              return (
                <tr key={element.id}>
                  <td className={tableStyles.cell__big}>
                    <div
                      className={`${tableStyles.cell} ${tableStyles.black_borders} ${tableStyles.cell__outer} ${tableStyles.cell__outer__big}`}>
                      {element.name}
                    </div>
                  </td>
                  <td>
                    <div
                      className={`${tableStyles.cell} ${tableStyles.black_borders} ${tableStyles.cell__outer} ${styles.action_wrapper}`}>
                      <button
                        className={`${styles.button} ${styles.button__edit} ${styles.button__edit__small}`}
                        onClick={() => {
                          setIsOpen(true);
                          setSelectedId(element.id);
                        }}>
                        Edit
                      </button>
                      <button
                        className={`${styles.button} ${styles.button__delete} ${styles.button__delete__small}`}
                        onClick={() => handleDelete(element.id, element.name)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
