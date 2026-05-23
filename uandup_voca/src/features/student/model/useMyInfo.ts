import { useQuery } from '@tanstack/react-query';
import { getMyInfo, toMember, memberKeys } from '@/entities/member';

// 로그인한 본인 정보 — /api/v1/members/me.
// 학생 대시보드의 Test Configuration(시험 유형·동의어·문항 수·배정 수)은
// 대시보드 API에 없어 이 응답의 examSettings에서 가져온다.
// memberKeys.me() 키를 useChildSwitcher와 공유하므로 캐시가 중복되지 않는다.
export function useMyInfo() {
  return useQuery({
    queryKey: memberKeys.me(),
    queryFn: getMyInfo,
    select: (res) => toMember(res.data),
  });
}
