export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  detail: (id: number) => [...studentKeys.all, id, 'detail'] as const,
  overview: (id: number) => [...studentKeys.all, id, 'overview'] as const,
  studySets: (id: number) => [...studentKeys.all, id, 'study-sets'] as const,
  studyWords: (studySetId: number) => [...studentKeys.all, 'study-set-words', studySetId] as const,
};
