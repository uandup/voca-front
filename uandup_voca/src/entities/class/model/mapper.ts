import type { components } from '@/shared/api/schema.gen';
import type { ClassListItem } from './types';

type ClassroomSummary = components['schemas']['ClassroomSummary'];

export function toClassListItem(r: ClassroomSummary): ClassListItem {
  return {
    id: r.classId!,
    name: r.className ?? '',
  };
}
