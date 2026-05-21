import type { components } from '@/shared/api/schema.gen';
import type { Member, ChildSummary, StudentGrade } from './types';

type MemberResponse = components['schemas']['MemberResponse'];

export function toMember(res: MemberResponse): Member {
  return {
    role: res.role,
    status: res.status,
    // children은 PARENT만 배열로 내려온다 — STUDENT·TEACHER는 null이므로 undefined로 둔다.
    children: res.children?.map(
      (c): ChildSummary => ({
        studentId: c.studentId ?? 0,
        name: c.name ?? '',
        grade: (c.grade ?? 1) as StudentGrade,
      }),
    ),
  };
}
