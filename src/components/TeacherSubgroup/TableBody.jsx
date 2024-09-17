import React from 'react';
import {format} from 'date-fns';
import {useNavigate, useParams} from 'react-router-dom';

import tableStyles from '../../styles/table.module.scss';
import EditButton from '../Buttons/Edit';
import path from '../../helpers/routerPath';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import classNames from 'classnames';

export default function TableBody({filteredSubgroups}) {
  const {t} = useTranslation('global');

  const navigate = useNavigate();
  const {teacherId} = useParams() || null;
  let userId = useSelector(state => state.auth.user.id);
  if (teacherId) userId = teacherId;
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
                      className={classNames(
                        tableStyles.cell,
                        tableStyles.cell__outer,
                        tableStyles.cell__mySubgroup
                      )}>
                      {group?.SubGroup.name}
                    </div>
                  </td>
                  <td className={tableStyles.cell__mySubgroup}>
                    <div
                      className={classNames(
                        tableStyles.cell,
                        tableStyles.cell__mySubgroup,
                        index === 0 || index === filteredSubgroups.length - 1
                          ? tableStyles.cell__outer
                          : tableStyles.cell__inner
                      )}>
                      {group?.SubGroup.Course.name}
                    </div>
                  </td>
                  <td className={tableStyles.cell__mySubgroup}>
                    <div
                      className={classNames(
                        tableStyles.cell,
                        index === 0 || index === filteredSubgroups.length - 1
                          ? tableStyles.cell__outer
                          : tableStyles.cell__inner,
                        tableStyles.cell__mySubgroup
                      )}>
                      {group?.SubGroup?.Admin?.name || t('teacher.mySubgroups.table.self')}
                    </div>
                  </td>
                  <td className={tableStyles.cell__mySubgroup}>
                    <div
                      className={classNames(
                        tableStyles.cell,
                        index === 0 || index === filteredSubgroups.length - 1
                          ? tableStyles.cell__outer
                          : tableStyles.cell__inner,
                        tableStyles.cell__mySubgroup
                      )}>
                      {group?.SubGroup.description}
                    </div>
                  </td>
                  <td className={tableStyles.cell__mySubgroup} key={'schedule' + group.id}>
                    <div
                      className={classNames(
                        tableStyles.cell,
                        index === 0 || index === filteredSubgroups.length - 1
                          ? tableStyles.cell__outer
                          : tableStyles.cell__inner,
                        tableStyles.cell__mySubgroup
                      )}>
                      <div>
                        <div className={tableStyles.cell__mySubgroup__years}>
                          {group?.SubGroup.startDate &&
                            format(group?.SubGroup.startDate, 'dd.MM.yyyy') +
                              '-' +
                              format(group?.SubGroup.endDate, 'dd.MM.yyyy')}
                        </div>
                        {(group.schedule || '').split('\n').map(el => {
                          let day = '';
                          if (el) {
                            day = t(`daysOfWeek.${el.slice(0, 3).toLowerCase()}`);
                          }
                          return (
                            <React.Fragment key={el}>
                              {day + el.slice(day.length > 0 ? 3 : 0)} <br />
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </td>
                  <td className={tableStyles.cell__mySubgroup}>
                    <div
                      className={classNames(
                        tableStyles.cell,
                        tableStyles.cell__outer,
                        tableStyles.cell__mySubgroup
                      )}>
                      <EditButton
                        onClick={() => {
                          navigate(`../${path.editMySubgroup}${teacherId ? teacherId : ''}`, {
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
