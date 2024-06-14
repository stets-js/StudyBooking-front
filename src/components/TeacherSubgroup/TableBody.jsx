import React from 'react';
import {format} from 'date-fns';
import {useNavigate} from 'react-router-dom';

import tableStyles from '../../styles/table.module.scss';
import EditButton from '../Buttons/Edit';
import path from '../../helpers/routerPath';

export default function TableBody({filteredSubgroups, userId}) {
  const navigate = useNavigate();

  return (
    <div className={`${tableStyles.calendar} ${tableStyles.scroller}`}>
      <table className={tableStyles.tableBody}>
        <tbody>
          {filteredSubgroups.length > 0 &&
            filteredSubgroups.map((group, index) => {
              return (
                <tr key={'' + group.id}>
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
                      {group?.SubGroup?.Admin?.name || 'Self appointed'}
                    </div>
                  </td>
                  <td className={tableStyles.cell__mySubgroup}>
                    <div
                      className={`${tableStyles.cell} ${
                        index === 0 || index === filteredSubgroups.length - 1
                          ? tableStyles.cell__outer
                          : tableStyles.cell__inner
                      } ${tableStyles.cell__mySubgroup}`}>
                      {group?.SubGroup.description}
                    </div>
                  </td>
                  <td className={tableStyles.cell__mySubgroup} key={'schedule' + group.id}>
                    <div
                      className={`${tableStyles.cell} ${
                        index === 0 || index === filteredSubgroups.length - 1
                          ? tableStyles.cell__outer
                          : tableStyles.cell__inner
                      } ${tableStyles.cell__mySubgroup}`}>
                      <div>
                        <div className={tableStyles.cell__mySubgroup__years}>
                          {group?.SubGroup.startDate &&
                            format(group?.SubGroup.startDate, 'dd.MM.yyyy') +
                              '-' +
                              format(group?.SubGroup.endDate, 'dd.MM.yyyy')}
                        </div>
                        {(group.schedule || '').split('\n').map(el => {
                          return (
                            <React.Fragment key={el}>
                              {el} <br />
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </td>
                  <td className={tableStyles.cell__mySubgroup}>
                    <div
                      className={`${tableStyles.cell} ${tableStyles.cell__outer} ${tableStyles.cell__mySubgroup}`}>
                      <EditButton
                        text="Edit"
                        onClick={() => {
                          navigate(`../${path.editMySubgroup}${userId}`, {
                            state: {
                              group
                            }
                          });
                        }}></EditButton>
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
