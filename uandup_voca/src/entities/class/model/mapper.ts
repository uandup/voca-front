import type { components } from '@/shared/api/schema.gen';
import type { Class } from './types';

type ClassroomSummary = components['schemas']['ClassroomSummary'];

export function toClassListItem(r: ClassroomSummary): Class {
  return {
    id: r.classId!,
    name: r.className ?? '',
  };
}
