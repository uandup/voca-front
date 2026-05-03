import { AssignedLevelBlocks } from '@/entities/word';
import type { Student } from '@/entities/member';
import { TestConfigBadges } from '@/entities/test';

export interface RowActions {
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onMemo: (student: Student) => void;
}

interface StudentTableRowProps {
  student: Student;
  actions: RowActions;
}

export function StudentTableRow({ student, actions }: StudentTableRowProps) {
  const latestMemo = [...student.memos].sort((a, b) => b.date.localeCompare(a.date))[0];

  return (
    <tr className="hover:bg-surface-container-low/30 transition-colors group">
      {/* Name */}
      <td className="px-4 py-4 border-r border-outline-variant/20">
        <p className="font-headline font-bold text-sm text-primary group-hover:text-primary/80 transition-colors">
          {student.nameKo}
        </p>
        <p className="text-xs text-on-surface-variant mt-0.5">
          {student.nameFirstEn} {student.nameLastEn}
        </p>
      </td>

      {/* Grade */}
      <td className="px-4 py-4 text-center border-r border-outline-variant/20">
        <span className="px-2 py-1 bg-surface-container-highest text-primary font-bold text-xs rounded-full">
          G{student.grade}
        </span>
      </td>

      {/* Level */}
      <td className="px-4 py-4 text-center border-r border-outline-variant/20">
        <div className="flex justify-center">
          <AssignedLevelBlocks level={student.assignedLevel} />
        </div>
      </td>

      {/* QTY */}
      <td className="px-4 py-4 text-center border-r border-outline-variant/20">
        <span className="font-headline font-bold text-sm text-on-surface">
          {student.assignedWordCount}
        </span>
      </td>

      {/* Questions */}
      <td className="px-4 py-4 text-center border-r border-outline-variant/20">
        <span className="font-headline font-bold text-sm text-on-surface">
          {student.testQuestionCount}
        </span>
      </td>

      {/* Exam Config */}
      <td className="px-4 py-4 text-center border-r border-outline-variant/20">
        <div className="flex justify-center">
          <TestConfigBadges config={student.testConfig} />
        </div>
      </td>

      {/* Recent Score */}
      <td className="px-4 py-4 text-center font-headline font-bold text-primary text-sm border-r border-outline-variant/20">
        {student.recentScore ? (
          <span className=" ">
            {student.recentScore.score}
            <span className="">/{student.recentScore.total}</span>
          </span>
        ) : (
          <span className="text-on-surface-variant text-sm">—</span>
        )}
      </td>

      {/* ACR */}
      <td className="px-4 py-4 text-center border-r border-outline-variant/20">
        <span className="font-headline font-bold text-sm text-primary">{student.accuracy}</span>
      </td>

      {/* Memo */}
      <td className="px-4 py-4 border-r border-outline-variant/20">
        <div className="flex items-center gap-1.5">
          <p className="text-xs text-on-surface-variant truncate flex-1">
            {latestMemo ? latestMemo.content : '—'}
          </p>
          <button
            onClick={() => actions.onMemo(student)}
            className="shrink-0 p-1 rounded-md text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            title="메모 보기"
          >
            <span className="material-symbols-outlined text-base">sticky_note_2</span>
          </button>
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => actions.onEdit(student)}
            className="bg-primary/10 text-primary px-3 py-1 rounded-md text-xs font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            Edit
          </button>
          <button
            onClick={() => actions.onDelete(student)}
            className="p-1.5 text-on-surface-variant hover:text-error transition-colors"
          >
            <span className="material-symbols-outlined text-xl">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
}
