import React from 'react';
import {useState} from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import {format} from 'date-fns';

import EditButton from '../Buttons/Edit';
import DeleteButton from '../Buttons/Delete';

import tableStyles from '../../styles/table.module.scss';
import selectorStyles from '../../styles/selector.module.scss';
export default function Tbody({reports}) {
  const [isEdit, setIsEdit] = useState([]);

  return (
    <div className={classNames(tableStyles.calendar, tableStyles.scroller)}>
      <table className={tableStyles.tableBody}>
        <tbody>
          {reports.length > 0 &&
            reports.map((report, index) => {
              return (
                <tr key={'' + report.id}>
                  <td className={tableStyles.cell__mySubgroup}>
                    <div
                      className={classNames(
                        tableStyles.cell,
                        tableStyles.cell__outer,
                        tableStyles.cell__mySubgroup
                      )}>
                      {report.Course.name}
                    </div>
                  </td>
                  <td className={tableStyles.cell__mySubgroup}>
                    <div
                      className={classNames(
                        tableStyles.cell,
                        tableStyles.cell__mySubgroup,
                        index === 0 || index === reports.length - 1
                          ? tableStyles.cell__outer
                          : tableStyles.cell__inner
                      )}>
                      {report?.SubGroup.name}
                    </div>
                  </td>
                  <td className={tableStyles.cell__mySubgroup}>
                    <div
                      className={classNames(
                        tableStyles.cell,
                        tableStyles.cell__mySubgroup,
                        index === 0 || index === reports.length - 1
                          ? tableStyles.cell__outer
                          : tableStyles.cell__inner
                      )}>
                      {report.User?.name}
                    </div>
                  </td>
                  <td className={tableStyles.cell__mySubgroup}>
                    <div
                      className={classNames(
                        tableStyles.cell,
                        tableStyles.cell__mySubgroup,
                        index === 0 || index === reports.length - 1
                          ? tableStyles.cell__outer
                          : tableStyles.cell__inner
                      )}>
                      {format(report.date, 'dd.MM.yy')}
                    </div>
                  </td>
                  <td className={tableStyles.cell__mySubgroup}>
                    <div
                      className={classNames(
                        tableStyles.cell,
                        tableStyles.cell__mySubgroup,
                        index === 0 || index === reports.length - 1
                          ? tableStyles.cell__outer
                          : tableStyles.cell__inner
                      )}>
                      {report.mark}
                    </div>
                  </td>
                  <td className={tableStyles.cell__mySubgroup}>
                    <div
                      className={classNames(
                        tableStyles.cell,
                        tableStyles.cell__mySubgroup,
                        index === 0 || index === reports.length - 1
                          ? tableStyles.cell__outer
                          : tableStyles.cell__inner
                      )}>
                      {isEdit !== index ? (
                        report.status
                      ) : (
                        <Select className={selectorStyles.selector}></Select>
                      )}
                    </div>
                  </td>
                  <td className={tableStyles.cell__mySubgroup}>
                    <div
                      className={`${tableStyles.cell} ${tableStyles.cell__outer} ${tableStyles.cell__mySubgroup}`}>
                      {isEdit !== index ? (
                        <EditButton
                          text="Edit"
                          onClick={() => {
                            setIsEdit(index);
                          }}></EditButton>
                      ) : (
                        <>
                          <DeleteButton text="Cancel" onClick={() => setIsEdit(-1)}></DeleteButton>
                          <EditButton text="Save" onClick={() => setIsEdit(-1)}></EditButton>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
