import type { components } from '@/shared/api/schema.gen';
import type { Memo } from './types';

type MemoResponse = components['schemas']['MemoResponse'];

export function toMemo(r: MemoResponse): Memo {
  return {
    id: r.memoId!,
    date: r.date ?? '',
    content: r.content ?? '',
  };
}
