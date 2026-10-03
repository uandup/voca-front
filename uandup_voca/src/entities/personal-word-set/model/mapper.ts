import type { PersonalWordSetResponse } from '../api/personalWordSetApi';
import type { PersonalWordSetRow } from './types';

export function toPersonalWordSetRow(r: PersonalWordSetResponse): PersonalWordSetRow {
  return {
    id: r.personalWordSetId ?? 0,
    name: r.name ?? '',
    createdByRole: r.createdByRole ?? 'TEACHER',
    wordCount: r.wordCount ?? 0,
    createdAt: r.createdAt ?? '',
  };
}
