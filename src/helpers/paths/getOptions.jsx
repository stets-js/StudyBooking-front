import {adminPaths, commonPaths, micUserPaths, qcManagerPaths, teacherPaths} from './pathLists';

export const getOptions = role => {
  const neededPaths = ['superAdmin', 'admin'].includes(role)
    ? adminPaths
    : role === 'teacher'
    ? teacherPaths
    : role === 'QC manager'
    ? qcManagerPaths
    : micUserPaths;

  return [
    ...Object.values(neededPaths).map(el => {
      return {
        label: el
      };
    }),
    ...Object.values(commonPaths).map(el => {
      return {
        label: el
      };
    })
  ];
};
