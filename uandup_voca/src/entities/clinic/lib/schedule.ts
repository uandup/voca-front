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

// hour는 화면 라벨 계산용이 아니라 백엔드 요청 경로(/clinics/{day}/{hour}/students)에
// 그대로 들어가는 키다. 슬롯 길이가 50분/60분으로 제각각이라 "hour:00–hour+1:00" 공식으로
// 라벨을 계산할 수 없어, 키(hour)와 화면 라벨(label)을 분리해 각 슬롯에 실제 시각을 명시한다.
export const TIME_GROUPS = [
  {
    key: 'morning' as TimeGroup,
    label: 'Morning',
    range: '10 – 12',
    hours: [
      { hour: 10, label: '10:00 – 10:50' },
      { hour: 11, label: '11:00 – 11:50' },
    ] as const,
  },
  {
    key: 'afternoon' as TimeGroup,
    label: 'Afternoon',
    range: '13 – 20',
    hours: [
      { hour: 13, label: '13:00 – 13:50' },
      { hour: 14, label: '14:00 – 14:50' },
      { hour: 15, label: '15:00 – 15:50' },
      { hour: 16, label: '16:30 – 17:20' },
      { hour: 17, label: '17:30 – 18:20' },
      { hour: 18, label: '18:30 – 19:20' },
      { hour: 19, label: '19:30 – 20:20' },
    ] as const,
  },
  {
    key: 'evening' as TimeGroup,
    label: 'Evening',
    range: '21 – 23',
    hours: [
      { hour: 21, label: '21:00 – 22:00' },
      { hour: 22, label: '22:00 – 23:00' },
    ] as const,
  },
] as const;

export type ClinicHour = (typeof TIME_GROUPS)[number]['hours'][number]['hour'];

// 모든 클리닉 시간을 그룹 순서대로 평탄화한 목록.
export const ALL_CLINIC_HOURS = TIME_GROUPS.flatMap((g) =>
  g.hours.map((h) => h.hour),
) as ClinicHour[];

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
  const group = TIME_GROUPS.find((g) => g.hours.some((h) => h.hour === hour));
  // 모든 ClinicHour는 어느 한 그룹에 속하므로 group은 항상 존재한다.
  return group!.key;
}
