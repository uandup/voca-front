export type { ClinicSlot, Day, TimeGroup, ClinicHour } from './model/types';
export { DAYS, todayDay, TIME_GROUPS } from './model/types';
export { DAY_API_MAP } from './api/mapper';
export type { ClinicMemberStudent } from './model/mapper';
export { toClinicStudentRow, toClinicMemberStudent } from './model/mapper';
export { getClinicStudents, getClinicEditData, updateClinicStudents } from './api/clinicApi';
