import { useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { registerProfile } from '@/entities/auth';
import type { MemberRole } from '@/entities/member';
import type { StudentFormState, TeacherFormState, ParentFormState } from './types';

interface RegistParams {
  userType: MemberRole;
  student: StudentFormState;
  teacher: TeacherFormState;
  parent: ParentFormState;
}

export function useRegist() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ userType, student, teacher, parent }: RegistParams) =>
      registerProfile(buildProfileBody(userType, student, teacher, parent)),
    onSuccess: ({ data }) => {
      localStorage.setItem('accessToken', data.accessToken ?? '');
      navigate({ to: '/pending' });
    },
  });
}

function buildProfileBody(
  userType: MemberRole,
  student: StudentFormState,
  teacher: TeacherFormState,
  parent: ParentFormState,
) {
  if (userType === 'STUDENT') {
    return {
      role: 'STUDENT' as const,
      name: student.nameKo,
      englishName: `${student.nameFirstEn} ${student.nameLastEn}`,
      grade: student.grade,
    };
  }
  if (userType === 'TEACHER') {
    return {
      role: 'TEACHER' as const,
      name: teacher.nameKo,
      englishName:
        teacher.nameLastEn || teacher.nameFirstEn
          ? `${teacher.nameFirstEn} ${teacher.nameLastEn}`.trim()
          : undefined,
    };
  }
  return {
    role: 'PARENT' as const,
    name: parent.nameKo,
    phoneNumber: parent.phone,
    requestedChildName: parent.childNameKo,
    requestedChildGrade: parent.childGrade,
  };
}
