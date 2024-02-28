import React, {useEffect, useState} from 'react';
import {useConfirm} from 'material-ui-confirm';

import {deleteSubGroup, getSubGroups} from '../../helpers/subgroup/subgroup';
import styles from '../../styles/teacher.module.scss';
import FormInput from '../../components/FormInput/FormInput';
export default function SubGroupPage() {
  const [subGroups, setSubGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const confirm = useConfirm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSubGroups();
        setSubGroups(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  const handleDelete = async (id, name) => {
    confirm({
      description: 'Are you sure you want to delete ' + name,
      confirmationText: 'delete',
      confirmationButtonProps: {autoFocus: true}
    })
      .then(async () => {
        await deleteSubGroup(id);
        setSubGroups(prevSubGroups => prevSubGroups.filter(subgroup => subgroup.id !== id));
      })
      .catch(e => console.log('no ' + e));
  };

  const filteredSubGroups = subGroups.filter(element =>
    element.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className={styles.calendar__available}>
        <FormInput
          type="text"
          title={'Search by name'}
          placeholder="Name..."
          value={searchQuery}
          handler={setSearchQuery}
        />

        <table>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Назва</th>
              <th>Дія</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubGroups.length === 0 ? (
              <tr>
                <td colSpan={2} className={`${styles.cell} ${styles.subgroup_cell}`}>
                  Ops, can't find this SubGroup...
                </td>
              </tr>
            ) : (
              filteredSubGroups.map(element => {
                return (
                  <tr key={element.id}>
                    <td className={`${styles.cell} ${styles.subgroup_cell}`}>{element.name}</td>
                    <td className={`${styles.cell} ${styles.subgroup_cell}`}>
                      <button
                        className={`${styles.delete_button}`}
                        onClick={() => handleDelete(element.id, element.name)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>{' '}
    </div>
  );
}
