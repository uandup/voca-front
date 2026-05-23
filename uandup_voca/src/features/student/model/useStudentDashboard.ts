import { useQuery } from '@tanstack/react-query';
import {
  getDashboard,
  getDashboardCharts,
  toStudentDashboard,
  toStudentDashboardCharts,
  studentKeys,
} from '@/entities/student';

// 학생 대시보드 요약 지표 — /api/v1/students/{id}/dashboard
export function useStudentDashboard(studentId: number) {
  return useQuery({
    queryKey: studentKeys.dashboard(studentId),
    queryFn: () => getDashboard(studentId),
    select: (res) => toStudentDashboard(res.data!),
    enabled: studentId > 0,
  });
}

// 학생 대시보드 차트 데이터 — /api/v1/students/{id}/dashboard/charts
export function useStudentDashboardCharts(studentId: number) {
  return useQuery({
    queryKey: studentKeys.dashboardCharts(studentId),
    queryFn: () => getDashboardCharts(studentId),
    select: (res) => toStudentDashboardCharts(res.data!),
    enabled: studentId > 0,
  });
}
