import React from 'react';
import {Link} from 'react-router-dom';

import tableStyles from '../../../styles/table.module.scss';
import styles from '../../../styles/SuperAdminPage.module.scss';

export default function MentorTable({subgroupMentors}) {
  const headers = ['Mentor', 'type', 'schedule'];

  return (
    <>
      <div className={`${tableStyles.header} ${tableStyles.header__mySubgroup}`}>
        {headers.map(header => {
          return (
            <div className={`${tableStyles.cell__header} ${tableStyles.cell__header__mySubgroup}`}>
              {header}
            </div>
          );
        })}
      </div>
      <div
        className={`${tableStyles.calendar} ${tableStyles.scroller} ${tableStyles.scroller__small}`}>
        <table className={tableStyles.tableBody}>
          <tbody>
            {subgroupMentors.length === 0 ? (
              <tr>
                <td colSpan={3}>
                  <div className={`${tableStyles.cell} ${tableStyles.cell__outer}`}>
                    {'No mentors assigned'}
                  </div>
                </td>
              </tr>
            ) : (
              subgroupMentors.map((mentor, index) => {
                return (
                  <tr>
                    <td>
                      <div
                        className={`${tableStyles.cell} ${tableStyles.cell__small} ${tableStyles.cell__outer} ${styles.ul_items_link}`}>
                        <Link
                          style={{zIndex: '3'}}
                          target="_blank"
                          // onClick={() => {
                          //   //   dispatch({
                          //   //     type: 'ADD_SELECTED_USER',
                          //   //     payload: {
                          //   //       id: mentor.mentorId
                          //   //     }
                          //   //   });
                          // }}
                          to={`../teacher/calendar/${mentor.mentorId}`}>
                          <p className={styles.ul_items_text}>{mentor?.User.name}</p>
                        </Link>
                      </div>
                    </td>
                    <td>
                      <div
                        className={`${tableStyles.cell} ${tableStyles.cell__small} ${
                          index === 0 || index === subgroupMentors.length - 1
                            ? tableStyles.cell__outer
                            : tableStyles.cell__inner
                        }`}>
                        {mentor.TeacherType.type}
                      </div>
                    </td>

                    <td>
                      <div
                        className={`${tableStyles.cell} ${tableStyles.cell__small} ${tableStyles.cell__outer}`}>
                        {mentor.schedule.split(',').map(el => {
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
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
