import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { getMyInfo, toMember, memberKeys } from '@/entities/member';
import { getActiveChildId, setActiveChildId } from '@/shared/jwt';

// 학부모가 자녀 페이지를 공유 열람할 때, 열람 대상 자녀를 선택·전환하는 훅.
//
// children은 /api/v1/members/me 응답에서 오며, 활성 자녀 id는 localStorage에 보관된다.
// 전환 시 새 자녀 id를 저장하고 학생 대시보드로 이동해 페이지 트리를 새 컨텍스트로 다시 그린다
// (useCurrentStudentId가 localStorage를 동기 조회하므로 네비게이션으로 갱신을 확정한다).
export function useChildSwitcher() {
  const navigate = useNavigate();

  const { data: children = [] } = useQuery({
    queryKey: memberKeys.me(),
    queryFn: getMyInfo,
    select: (res) => toMember(res.data).children ?? [],
  });

  const activeChildId = getActiveChildId();
  const activeChild = children.find((c) => c.studentId === activeChildId) ?? null;

  function switchChild(studentId: number) {
    if (studentId === activeChildId) return;
    setActiveChildId(studentId);
    navigate({ to: '/student/dashboard' });
  }

  return { children, activeChild, activeChildId, switchChild };
}
