import { useQuery } from '@tanstack/react-query';
import { getClinicStudents, toClinicStudentRow } from '@/entities/clinic';

export function useClinics(dayOfWeek: string, hour: number) {
  const { data: students, isLoading } = useQuery({
    queryKey: ['clinics', dayOfWeek, hour],
    queryFn: () => getClinicStudents(dayOfWeek, hour),
    select: (res) => res.data?.map(toClinicStudentRow) ?? [],
    staleTime: Infinity,
  });
  return { students: students ?? [], isLoading };
}
