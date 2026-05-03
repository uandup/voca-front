import CycleRow from './CycleRow';
import { MOCK_CLINIC_CYCLES } from '@/entities/test';

export default function WordTestTab() {
  return (
    <div className="flex flex-col gap-4">
      {MOCK_CLINIC_CYCLES.map((cycle) => (
        <CycleRow key={cycle.title} {...cycle} />
      ))}
    </div>
  );
}
