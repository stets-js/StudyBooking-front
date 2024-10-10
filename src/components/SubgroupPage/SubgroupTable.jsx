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
  infiniteScrollData,
  setInfiniteScrollData,
  selectedStatus,
  searchQuery
}) {
  const confirm = useConfirm();

  const [reset, setReset] = useState(false);
  const fetchData = async (query = '') => {
    try {
      const data = await getSubGroups(
        `status=${selectedStatus}&offset=${reset ? 0 : infiniteScrollData.offset}&limit=${
          infiniteScrollData.limit
        }&name=${searchQuery}${selectedCourse !== null ? '&CourseId=' + selectedCourse : ''}` +
          query
      );
      setSubGroups(prev => {
        return [...prev, ...data.data];
      });
      setInfiniteScrollData(prev => ({...prev, total: data.totalCount, offset: data.newOffset}));
    } catch (e) {
      // error('Something went wrong');
      console.log(e);
    }
  };

  useEffect(() => {
    let timeoutId;
    const fetchDataWithDelay = async () => {
      try {
        setReset(true);
      } catch (error) {
        console.error('Произошла ошибка:', error);
      }
    };

    const delayedFetch = async () => {
      clearTimeout(timeoutId);
      await setInfiniteScrollData(prev => ({...prev, offset: 0}));
      await setSubGroups([]);
      timeoutId = setTimeout(fetchDataWithDelay, 500);
    };
    if (searchQuery !== null) delayedFetch();

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    setReset(true);
  }, [selectedCourse, selectedStatus]);
  useEffect(() => {
    if (reset) {
      setSubGroups([]);
      setInfiniteScrollData(prev => ({...prev, total: 0, offset: 0}));

      fetchData();
      setReset(false);
    }
  }, [reset]);
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
            hasMore={
              infiniteScrollData.offset + infiniteScrollData.limit <= infiniteScrollData.total
            }
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
