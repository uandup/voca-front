export type {
  StudentIdentity,
  StudentDashboardStats,
  StudentTodoConfig,
  StudentManageTableRow,
  StudentDetail,
} from './model/types';
export { toStudentManageTableRow, toStudentDetail } from './model/mapper';
export { STUDENT_MOCK, MOCK_PENDING_APPROVALS, MOCK_UNASSIGNED_STUDENTS } from './lib/mockData';
export { getStudents, getStudentDetail, updateStudent, deleteStudent } from './api/studentApi';
export { toStudentUpdateRequest } from './api/mapper';
