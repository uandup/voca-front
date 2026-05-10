import { useNavigate } from '@tanstack/react-router';
import { TableContainer } from '@/shared/ui/TableContainer';
import { LevelBlock } from '@/entities/word';
import { TestConfigBadges } from '@/entities/test';
import type { ClinicStudentRow } from '@/entities/clinic';

interface Props {
  students: ClinicStudentRow[];
  onMemoClick: (student: ClinicStudentRow) => void;
  onEditMembersClick: () => void;
}

export function StudentTable({ students, onMemoClick, onEditMembersClick }: Props) {
  const navigate = useNavigate();

  return (
    <div className="col-span-9 space-y-4">
      <div className="flex justify-start">
        <button
          onClick={onEditMembersClick}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-on-primary-fixed-variant bg-surface-container-lowest border/20 shadow-sm hover:bg-surface-container-low transition-colors font-medium"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          Edit Members
        </button>
      </div>
      <TableContainer>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col className="w-[18%]" />
              <col className="w-[7%]" />
              <col className="w-[7%]" />
              <col className="w-[7%]" />
              <col className="w-[7%]" />
              <col className="w-[12%]" />
              <col className="w-[42%]" />
            </colgroup>
            <thead>
              <tr className="bg-surface-container-highest/30">
                <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest border-r border-outline-variant/20">
                  Name
                </th>
                <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">
                  Grade
                </th>
                <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">
                  Level
                </th>
                <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">
                  QTY
                </th>
                <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">
                  Test
                </th>
                <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">
                  Config
                </th>
                <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Memo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {students.map((student) => (
                <tr
                  key={student.id}
                  onClick={() =>
                    navigate({
                      to: '/teacher/clinics/students/$studentId',
                      params: { studentId: String(student.id) },
                    })
                  }
                  className="transition-colors group hover:bg-surface-container-low/30 cursor-pointer"
                >
                  <td className="px-4 py-4 border-r border-outline-variant/20">
                    <p className="font-headline font-bold text-sm text-primary">{student.nameKo}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {student.nameFirstEn} {student.nameLastEn}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-center border-r border-outline-variant/20">
                    <span className="px-2 py-1 bg-surface-container-highest text-primary font-bold text-xs rounded-full">
                      {student.grade}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center border-r border-outline-variant/20">
                    <div className="flex justify-center">
                      <LevelBlock level={student.assignedLevel} />
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center border-r border-outline-variant/20">
                    <span className="font-headline font-bold text-sm text-on-surface">
                      {student.assignedWordCount}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center border-r border-outline-variant/20">
                    <span className="font-headline font-bold text-sm text-on-surface">
                      {student.testQuestionCount}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center border-r border-outline-variant/20">
                    <div className="flex justify-center">
                      <TestConfigBadges config={student.testConfig} />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs text-on-surface-variant truncate flex-1">
                        {student.latestMemoContent ?? '—'}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMemoClick(student);
                        }}
                        className="shrink-0 p-1 rounded-md text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">sticky_note_2</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableContainer>
    </div>
  );
}
