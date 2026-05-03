import { createFileRoute } from '@tanstack/react-router';
import { ClinicDetailPage } from '@/pages/teacher/clinic-detail/ClinicDetailPage';

export const Route = createFileRoute('/teacher/clinics_/students/$studentId')({
  component: ClinicDetailPage,
});
