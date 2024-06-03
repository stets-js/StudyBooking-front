import React from 'react';
import {format} from 'date-fns';
import tableStyles from '../../styles/table.module.scss';

export default function TableBody({typeAmounts}) {
  return (
    <div className={`${tableStyles.calendar} ${tableStyles.scroller}`}>
      <table className={tableStyles.tableBody}>
        <tbody>
          <tr key={'firstAndLast'}>
            {Object.entries(typeAmounts).map(([type, amount]) => {
              return (
                <>
                  <td className={tableStyles.cell__mySubgroup}>
                    <div
                      className={`${tableStyles.cell} ${tableStyles.cell__mySubgroup} ${
                        // index === 0 || index === 5
                        //   ?
                        tableStyles.cell__outer
                        //   : tableStyles.cell__inner
                      }`}>
                      {amount}
                    </div>
                  </td>
                </>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
