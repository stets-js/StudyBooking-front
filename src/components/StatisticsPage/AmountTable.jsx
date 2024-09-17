import React from 'react';
import styles from './statistics.module.scss';
import classNames from 'classnames';
import {useTranslation} from 'react-i18next';

const typeTranslator = id => {
  switch (+id) {
    case 7:
      return 'Group';
    case 8:
      return 'Private';
    case 9:
      return 'Replaced group';
    case 10:
      return 'Replaced private';
    case 11:
      return 'Jun group';
    case 12:
      return 'Replaced Jun group';

    default:
      return id;
  }
};
const typeReverseTranslator = typeName => {
  switch (typeName) {
    case 'Group':
      return 7;
    case 'Private':
      return 8;
    case 'Replaced group':
      return 9;
    case 'Replaced private':
      return 10;
    case 'Jun group':
      return 11;
    case 'Replaced Jun group':
      return 12;
    default:
      return typeName;
  }
};

export default function AmountTable({typeAmounts}) {
  const {t} = useTranslation('global');

  const orderHeaders = headers => {
    const order = [
      'Group',
      'Replaced group',
      'Private',
      'Replaced private',
      'Jun group',
      'Replaced Jun group',
      'Total'
    ];
    return headers.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  };
  const headers = orderHeaders([...Object.keys(typeAmounts).map(type => typeTranslator(type))]);
  return (
    <div className={styles.table__wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map(header => (
              <td key={header} className={classNames(styles.table__cell, styles.table__header)}>
                {t(`teacher.statistics.headers.${header}`)}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr key={'firstAndLast'}>
            {headers.map(header => {
              return (
                <>
                  <td className={styles.table__cell}>
                    {typeAmounts[typeReverseTranslator(header)]}
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
