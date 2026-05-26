import { useQuery } from '@tanstack/react-query';
import { getClinicStudents, toClinicStudentRow, DAY_API_MAP, clinicKeys } from '@/entities/clinic';
import type { Day, ClinicHour } from '@/entities/clinic';

export function useClinics(day: Day, hour: ClinicHour) {
  const dayOfWeek = DAY_API_MAP[day];
  const { data: students, isLoading } = useQuery({
    queryKey: clinicKeys.list(day, hour),
    queryFn: () => getClinicStudents(dayOfWeek, hour),
    select: (res) => res.data?.map(toClinicStudentRow) ?? [],
  });
  return { students: students ?? [], isLoading };
}
