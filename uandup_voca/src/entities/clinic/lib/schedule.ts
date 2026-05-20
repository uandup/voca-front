export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export type Day = (typeof DAYS)[number];

// Asia/Seoul 기준 현재 요일(약어)·시(0–23).
// 접속 기기의 시간대와 무관하게 학원 일정(한국 시간) 기준으로 동작하도록 고정한다.
function getSeoulNow(): { weekday: string; hour: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    weekday: 'short',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  return {
    weekday: parts.find((p) => p.type === 'weekday')!.value,
    hour: Number(parts.find((p) => p.type === 'hour')!.value),
  };
}

// Asia/Seoul 기준 오늘 요일. 클리닉은 일요일 운영이 없어 일요일이면 월요일로 둔다.
export const todayDay: Day = (() => {
  const { weekday } = getSeoulNow();
  return (DAYS as readonly string[]).includes(weekday) ? (weekday as Day) : 'Mon';
})();

export type TimeGroup = 'morning' | 'afternoon' | 'evening';

export const TIME_GROUPS = [
  { key: 'morning' as TimeGroup, label: 'Morning', range: '09 – 12', hours: [9, 10, 11] as const },
  {
    key: 'afternoon' as TimeGroup,
    label: 'Afternoon',
    range: '13 – 17',
    hours: [13, 14, 15, 16] as const,
  },
  {
    key: 'evening' as TimeGroup,
    label: 'Evening',
    range: '18 – 23',
    hours: [18, 19, 20, 21, 22] as const,
  },
] as const;

export type ClinicHour = (typeof TIME_GROUPS)[number]['hours'][number];

// 모든 클리닉 시간을 그룹 순서대로 평탄화한 목록.
export const ALL_CLINIC_HOURS = TIME_GROUPS.flatMap((g) => g.hours) as ClinicHour[];

// Asia/Seoul 기준 현재 시각으로 진행 중이거나 다음에 올 클리닉 시간.
// 시간대에 빈 구간(12·17시)이 있어 단순 매칭이 불가능하므로 "현재 시 이상인 첫 시간"을 고른다.
// 영업 시간이 끝난 뒤(23시 등)면 마지막 시간으로 폴백한다.
export function getCurrentClinicHour(): ClinicHour {
  const currentHour = getSeoulNow().hour;
  return (
    ALL_CLINIC_HOURS.find((h) => h >= currentHour) ?? ALL_CLINIC_HOURS[ALL_CLINIC_HOURS.length - 1]
  );
}

// 특정 시간이 속한 시간대 그룹.
export function getTimeGroupOfHour(hour: ClinicHour): TimeGroup {
  const group = TIME_GROUPS.find((g) => (g.hours as readonly number[]).includes(hour));
  // 모든 ClinicHour는 어느 한 그룹에 속하므로 group은 항상 존재한다.
  return group!.key;
}
