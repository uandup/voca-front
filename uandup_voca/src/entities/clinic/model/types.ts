export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export type Day = (typeof DAYS)[number];
export const todayDay = DAYS[Math.max(0, new Date().getDay() - 1)];
/** ClinicsPage 좌측 슬롯 카드 */
export interface ClinicSlot {
  hour: number; // 9~23
}
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
