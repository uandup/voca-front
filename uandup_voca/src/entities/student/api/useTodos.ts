import { useQuery } from '@tanstack/react-query';
import { studentKeys } from './queryKeys';
import { getTodos } from './studentApi';
import { toTodoItem } from '../model/mapper';

export function useTodos(studentId: number) {
  return useQuery({
    queryKey: studentKeys.todos(studentId),
    queryFn: () => getTodos(studentId),
    select: (res) => (res.data ?? []).map(toTodoItem),
    enabled: studentId > 0,
  });
}
