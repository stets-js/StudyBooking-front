import React from 'react';
import {format} from 'date-fns';
import tableStyles from '../../styles/table.module.scss';
export default function TableBody({filteredSubgroups}) {
  return (
    <div className={`${tableStyles.calendar} ${tableStyles.scroller}`}>
      <table className={tableStyles.tableBody}>
        <tbody>
          {filteredSubgroups.length > 0 &&
            filteredSubgroups.map((group, index) => {
              return (
                <tr key={group.id}>
                  <td className={tableStyles.cell__mySubgroup}>
                    <div
                      className={`${tableStyles.cell} ${tableStyles.cell__outer} ${tableStyles.cell__mySubgroup}`}>
                      {group?.SubGroup.name}
                    </div>
                  </td>
                  <td className={tableStyles.cell__mySubgroup}>
                    <div
                      className={`${tableStyles.cell} ${tableStyles.cell__mySubgroup} ${
                        index === 0 || index === filteredSubgroups.length - 1
                          ? tableStyles.cell__outer
                          : tableStyles.cell__inner
                      }`}>
                      {group?.SubGroup.Course.name}
                    </div>
                  </td>
                  <td className={tableStyles.cell__mySubgroup}>
                    <div
                      className={`${tableStyles.cell} ${
                        index === 0 || index === filteredSubgroups.length - 1
                          ? tableStyles.cell__outer
                          : tableStyles.cell__inner
                      } ${tableStyles.cell__mySubgroup}`}>
                      {group?.SubGroup?.Admin?.name}
                    </div>
                  </td>
                  <td className={tableStyles.cell__mySubgroup__description}>
                    <div
                      className={`${tableStyles.cell} ${
                        index === 0 || index === filteredSubgroups.length - 1
                          ? tableStyles.cell__outer
                          : tableStyles.cell__inner
                      } ${tableStyles.cell__mySubgroup}`}>
                      {group?.SubGroup.description}
                    </div>
                  </td>
                  <td className={tableStyles.cell__mySubgroup}>
                    <div
                      className={`${tableStyles.cell} ${tableStyles.cell__outer} ${tableStyles.cell__mySubgroup}`}>
                      {group?.SubGroup.startDate &&
                        format(group?.SubGroup.startDate, 'dd.MM') +
                          '-' +
                          format(group?.SubGroup.endDate, 'dd.MM')}
                      <br />
                      {group.schedule.split(',').map(el => {
                        return (
                          <>
                            {el} <br />
                          </>
                        );
                      })}
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
