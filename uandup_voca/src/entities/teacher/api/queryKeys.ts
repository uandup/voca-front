export const teacherKeys = {
  all: ['teachers'] as const,
  list: () => [...teacherKeys.all, 'list'] as const,
  admins: () => [...teacherKeys.all, 'admins'] as const,
  nonAdmins: () => [...teacherKeys.all, 'non-admins'] as const,
};

export const adminKeys = {
  all: ['admin'] as const,
  pendingCount: () => [...adminKeys.all, 'pending-count'] as const,
  pending: () => [...adminKeys.all, 'pending'] as const,
  pendingStudents: () => [...adminKeys.pending(), 'students'] as const,
  pendingParents: () => [...adminKeys.pending(), 'parents'] as const,
  pendingTeachers: () => [...adminKeys.pending(), 'teachers'] as const,
};
