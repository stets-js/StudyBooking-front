export const setSuperAdmins = superAdmins => ({
  type: 'SET_SUPERADMINS',
  payload: superAdmins
});
export const setAdmins = admins => ({
  type: 'SET_ADMINS',
  payload: admins
});
export const setMentors = mentors => ({
  type: 'SET_MENTORS',
  payload: mentors
});

export const updateMentors = mentor => ({
  type: 'UPDATE_MENTORS',
  payload: mentor
});
export const updateAdmin = admin => ({
  type: 'UPDATE_ADMINS',
  payload: admin
});

export const cleanMentors = () => ({type: 'CLEAN_MENTORS'});
export const deleteSuperAdmin = id => ({type: 'DELETE_SUPERADMINS', payload: id});
export const deleteAdmin = id => ({type: 'DELETE_ADMINS', payload: id});
export const deleteMentor = id => ({type: 'DELETE_MENTORS', payload: id});
export const updateSuperAdmins = superAdmin => ({
  type: 'UPDATE_SUPERADMINS',
  payload: superAdmin
});

export const addMentor = mentor => ({type: 'ADD_MENTOR', payload: mentor});
export const addAdmin = admin => ({type: 'ADD_ADMIN', payload: admin});
export const addSuperAdmin = superAdmin => ({type: 'ADD_SUPERADMIN', payload: superAdmin});
