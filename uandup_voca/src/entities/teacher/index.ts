export type { TeacherRow, TeacherManageRow } from './model/types';
export { toTeacherRow, toTeacherManageRow } from './model/mapper';
export {
  getTeachers,
  getNonAdminTeachers,
  getAdminTeachers,
  updateTeacher,
  deleteTeacher,
  promoteTeacherToAdmin,
  demoteAdminToTeacher,
} from './api/teacherApi';
export {
  getPendingCount,
  getPendingStudents,
  getPendingParents,
  getPendingTeachers,
  approveMember,
  rejectMember,
  promoteAllStudentsGrade,
  demoteAllStudentsGrade,
} from './api/adminApi';
export { isAdmin } from './lib/utils';
