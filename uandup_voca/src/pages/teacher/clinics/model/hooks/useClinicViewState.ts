import { useEffect, useState } from 'react';
import { todayDay, getCurrentClinicHour, getTimeGroupOfHour } from '@/entities/clinic';
import type { Day, ClinicHour, TimeGroup } from '@/entities/clinic';

type Slot = { day: Day; hour: ClinicHour };
type ExpandedGroups = Record<TimeGroup, boolean>;

// 시간대 그룹 펼침 초기값 — 현재 시간이 속한 그룹만 펼친다.
function initialExpandedGroups(): ExpandedGroups {
  const activeGroup = getTimeGroupOfHour(getCurrentClinicHour());
  return {
    morning: activeGroup === 'morning',
    afternoon: activeGroup === 'afternoon',
    evening: activeGroup === 'evening',
  };
}

// 모듈 스코프 — 라우트 이동 간에는 유지되고, 새로고침 시 모듈이 다시 평가되며 초기화된다.
// 초기값은 모듈 평가 시점(앱 진입/새로고침)의 현재 요일·시간 기준으로 정해진다.
let savedSlot: Slot = { day: todayDay, hour: getCurrentClinicHour() };
let savedExpandedGroups: ExpandedGroups = initialExpandedGroups();

// 클리닉 화면의 뷰 상태(선택 슬롯·시간대 그룹 펼침)를 라우트 이동 간 유지한다.
export function useClinicViewState() {
  const [selectedSlot, setSelectedSlot] = useState<Slot>(savedSlot);
  const [expandedGroups, setExpandedGroups] = useState<ExpandedGroups>(savedExpandedGroups);

  // 변경 시 모듈 스코프에 미러링해 다음 마운트(메뉴 재진입)에서 복원되게 한다.
  useEffect(() => {
    savedSlot = selectedSlot;
  }, [selectedSlot]);
  useEffect(() => {
    savedExpandedGroups = expandedGroups;
  }, [expandedGroups]);

  return { selectedSlot, setSelectedSlot, expandedGroups, setExpandedGroups };
}
