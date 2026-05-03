import type { Student } from '@/entities/member/@x/clinic';
import type { TestStep } from '@/entities/test/@x/clinic';

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

export interface ClinicCycle {
  title: string;
  badge?: string;
  scheduledDate: string;
  steps: TestStep[];
}
