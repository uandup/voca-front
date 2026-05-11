import CycleRow from './CycleRow';
import { toTestBundleRow } from '@/entities/student';
import type { StudySetRow } from '@/entities/student';

interface Props {
  studySets: StudySetRow[];
  studentId: number;
}

export default function WordTestTab({ studySets, studentId }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {studySets.map((set) => (
        <CycleRow
          key={set.studySetId}
          studySetId={set.studySetId}
          studentId={studentId}
          {...toTestBundleRow(set)}
        />
      ))}
    </div>
  );
}
