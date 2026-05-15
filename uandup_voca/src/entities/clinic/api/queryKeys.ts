import type { Day, ClinicHour } from '../lib/schedule';

export const clinicKeys = {
  all: ['clinics'] as const,
  list: (day: Day, hour: ClinicHour) => [...clinicKeys.all, 'list', day, hour] as const,
  edit: (day: Day, hour: ClinicHour) => [...clinicKeys.all, 'edit', day, hour] as const,
};
