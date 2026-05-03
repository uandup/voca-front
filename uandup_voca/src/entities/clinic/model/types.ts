import type { Student } from '@/entities/member/@x/clinic';

export type { Student as ClinicStudent };

export interface ClinicSession {
  id: string;
  timeSlot: string;
  enrolled: number;
  students: Student[];
}

export interface ClinicData {
  sessions: ClinicSession[];
}
