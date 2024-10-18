import React, {useEffect, useState} from 'react';
import styles from './Automatizers.module.scss';
import BgWrapper from '../../components/BgWrapper/BgWrapper';

import axios from 'axios';
import {getSubGroups} from '../../helpers/subgroup/subgroup';

const Automatizers = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [filters, setFilters] = useState({
    Product_Category: '',
    Product_Name: '',
    Training_Start_Date: '',
    searchQuery: ''
  });
  console.log(filteredData);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://zohointegration.goit.global/GoITeens/booking/productPlan/index.php?pass=89sYuEP389aHjT2d`
        );
        setData(res.data.AllProducts);
        setFilteredData(res.data.AllProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter(item => {
      const matchCategory = filters.Product_Category
        ? item.Product_Category === filters.Product_Category
        : true;
      const matchName = filters.Product_Name ? item.Product_Name === filters.Product_Name : true;
      const matchDate = filters.Training_Start_Date
        ? item.Training_Start_Date === filters.Training_Start_Date
        : true;
      const matchSearchQuery = filters.searchQuery
        ? item.Product_Name.toLowerCase().includes(filters.searchQuery.toLowerCase())
        : true;
      return matchCategory && matchName && matchDate && matchSearchQuery;
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [filters, data]);

  const handlePageChange = direction => {
    if (direction === 'next' && currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const availableGroups = filters.Product_Category
    ? data.filter(item => item.Product_Category === filters.Product_Category)
    : data;

  const [availableDates, setAvailableDates] = useState();
  useEffect(() => {
    setAvailableDates(
      filters.Product_Category
        ? data
            .filter(item => item.Product_Category === filters.Product_Category)
            .map(item => item.Training_Start_Date)
        : data.map(item => item.Training_Start_Date)
    );
  }, [data]);
  const findMinMax = dates => {
    const parsedDates = dates.map(date => new Date(date));

    const minDate = new Date(Math.min(...parsedDates));
    const maxDate = new Date(Math.max(...parsedDates));

    return [minDate.toISOString().split('T')[0], maxDate.toISOString().split('T')[0]];
  };
  const [bookingSubgroups, setBooknigSubgroups] = useState([]);
  const fetchBookingSubgroups = async () => {
    const [start, end] = findMinMax([...new Set(availableDates)]);
    const {data} = await getSubGroups(`isZohoSync=true&subgroupStartDate=${start},${end}`);
    console.log(data);
    setBooknigSubgroups(data);
    return data;
  };
  useEffect(() => {
    if (availableDates && availableDates.length > 0) fetchBookingSubgroups();
  }, [availableDates]);
  console.log(availableDates);
  return (
    <>
      <section className={styles.main_wrapper}>
        <BgWrapper />
        <div className={styles.content_wrapper}>
          <div className={styles.filters}>
            <select
              className={styles.select}
              value={filters.Product_Category}
              onChange={e => setFilters({...filters, Product_Category: e.target.value})}>
              <option value="">All Courses</option>
              {[...new Set(data.map(item => item.Product_Category))].map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              className={styles.select}
              value={filters.Product_Name}
              onChange={e => setFilters({...filters, Product_Name: e.target.value})}
              disabled={!filters.Product_Category}>
              <option value="">All Groups</option>
              {[...new Set(availableGroups.map(item => item.Product_Name))].map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <select
              className={styles.select}
              value={filters.Training_Start_Date}
              onChange={e => setFilters({...filters, Training_Start_Date: e.target.value})}
              disabled={!filters.Product_Category}>
              <option value="">All start dates</option>
              {[...new Set(availableDates)].map(date => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>

            <input
              className={styles.search}
              type="text"
              placeholder="Search by group name..."
              value={filters.searchQuery}
              onChange={e => setFilters({...filters, searchQuery: e.target.value})}
            />
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Курс</th>
                <th>Назва групи</th>
                <th>Викладачі</th>
                <th>Розклад</th>
                <th>Дата старту</th>
                <th>Заплановано учнів</th>
                <th>Фактично учнів</th>
              </tr>
            </thead>
            <tbody className={styles.table_body}>
              {currentItems.map(item => {
                const bookingGroup = bookingSubgroups.find(el => el.zohoGroupId === item.id);

                if (bookingGroup) console.log(bookingGroup);

                return (
                  <tr key={item.id}>
                    <td>{item.Product_Category}</td>
                    <td>{item.Product_Name}</td>
                    {bookingGroup ? (
                      bookingGroup?.mentors.length > 0 ? (
                        <td> {bookingGroup?.mentors.map(el => el.name)}</td>
                      ) : (
                        <td>Викладачі не призначені</td>
                      )
                    ) : (
                      <td>-</td>
                    )}
                    <td>{item.Schedule}</td>
                    <td>{item.Training_Start_Date}</td>
                    <td>{item.Students_plan}</td>
                    <td>{item.Students_fact}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className={styles.pagination}>
            <button
              className={styles.pagination__btn}
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 1}>
              Page Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={styles.pagination__btn}
              onClick={() => handlePageChange('next')}
              disabled={currentPage === totalPages}>
              Page Next
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Automatizers;
