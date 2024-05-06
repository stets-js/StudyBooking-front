/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {success} from '@pnotify/core';
import InfiniteScroll from 'react-infinite-scroll-component';

import styles from '../../styles/teacher.module.scss';
import tableStyles from '../../styles/table.module.scss';
import {useConfirm} from 'material-ui-confirm';
import {deleteSubGroup, getSubGroups} from '../../helpers/subgroup/subgroup';
import DeleteButton from '../Buttons/Delete';
import InfoButton from '../Buttons/Info';

export default function SubgroupTable({
  // filteredSubGroups,
  setIsOpen,
  setSelectedId,
  setSubGroups,
  subGroups,
  selectedCourse,
  offset,
  setOffset,
  searchQuery
}) {
  const confirm = useConfirm();
  const [limit] = useState(40);
  const [total, setTotal] = useState(0);
  const fetchData = async (query = '') => {
    try {
      const data = await getSubGroups(
        `offset=${offset}&limit=${limit}&name=${searchQuery}` + query
      );
      setSubGroups(prev => {
        return [...prev, ...data.data];
      });
      setOffset(data.newOffset);
      setTotal(data.totalCount);
    } catch (e) {
      // error('Something went wrong');
      console.log(e);
    }
  };

  useEffect(() => {
    let timeoutId;
    const fetchDataWithDelay = async () => {
      try {
        setSubGroups([]);
        const data = await getSubGroups(
          `offset=${offset}&limit=${limit}&name=${searchQuery}&CourseId=${selectedCourse || ''}`
        );
        setSubGroups(prev => {
          return [...prev, ...data.data];
        });
        setTotal(data.totalCount);
      } catch (error) {
        console.error('Произошла ошибка:', error);
      }
    };

    const delayedFetch = async () => {
      clearTimeout(timeoutId);
      await setOffset(0);
      await setSubGroups([]);
      timeoutId = setTimeout(fetchDataWithDelay, 200);
    };
    if (searchQuery !== null) delayedFetch();

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    setSubGroups([]);
    fetchData(selectedCourse !== null ? `&CourseId=${selectedCourse}` : '');
  }, [selectedCourse]);

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
      className={`${tableStyles.calendar} ${tableStyles.scroller} ${tableStyles.calendar__small}`}
      id="scroller">
      <table className={tableStyles.tableBody}>
        <tbody id="scroller">
          <InfiniteScroll
            dataLength={subGroups.length} //This is important field to render the next data
            next={fetchData}
            hasMore={offset + limit <= total}
            loader={<h4>Loading...</h4>}
            scrollableTarget="scroller"
            className={tableStyles.no_scroll}
            endMessage={<p style={{extAlign: 'center'}}>end</p>}>
            {subGroups.map(element => {
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
                      {/* <EditButton
                        classname={'button__edit__small'}
                        onClick={() => {
                          setIsOpen(true);
                          setSelectedId(element.id);
                        }}></EditButton> */}
                      <InfoButton
                        classname={'button__edit__small'}
                        onClick={() => {
                          setIsOpen(true);
                          setSelectedId(element.id);
                        }}></InfoButton>
                      <DeleteButton
                        classname={'button__delete__small'}
                        onClick={() => {
                          handleDelete(element.id, element.name);
                        }}></DeleteButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </InfiniteScroll>
        </tbody>
      </table>
    </div>
  );
}
