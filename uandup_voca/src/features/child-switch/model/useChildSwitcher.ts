import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { getMyInfo, toMember, memberKeys } from '@/entities/member';
import { useActiveChildId, setActiveChildId } from '@/entities/auth';

// 학부모가 자녀 페이지를 공유 열람할 때, 열람 대상 자녀를 선택·전환하는 훅.
//
// children은 /api/v1/members/me 응답에서 오며, 활성 자녀 id는 localStorage에 보관된다.
// useActiveChildId로 구독하므로 전환 시 이 훅을 쓰는 컴포넌트(사이드바 드롭다운 등)가 즉시 리렌더된다.
export function useChildSwitcher() {
  const navigate = useNavigate();

  const { data: children = [] } = useQuery({
    queryKey: memberKeys.me(),
    queryFn: getMyInfo,
    select: (res) => toMember(res.data).children ?? [],
  });

  const activeChildId = useActiveChildId();
  const activeChild = children.find((c) => c.studentId === activeChildId) ?? null;

  function switchChild(studentId: number) {
    if (studentId === activeChildId) return;
    setActiveChildId(studentId);
    navigate({ to: '/student/dashboard' });
  }

  return { children, activeChild, activeChildId, switchChild };
}
