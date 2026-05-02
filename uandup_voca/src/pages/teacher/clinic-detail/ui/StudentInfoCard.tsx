import type { Memo as MemoItem } from '@/entities/memo';
import type { ClinicStudent } from '@/entities/clinic';

interface Props {
  student: ClinicStudent;
  latestMemo: MemoItem | undefined;
  onMemoClick: () => void;
}

export function StudentInfoCard({ student, latestMemo, onMemoClick }: Props) {
  return (
    <div className="col-span-8 bg-white border border-outline/20 rounded-2xl p-7 flex flex-col gap-5">
      {/* Name row */}
      <div className="flex items-center gap-3">
        <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">
          {student.nameKo}
        </h2>
        <span className="text-3xl font-headline font-extrabold text-primary">
          ({student.nameFirstEn} {student.nameLastEn}
          <span className="mx-2">·</span>
          {student.grade})
        </span>
        <button
          onClick={onMemoClick}
          className="ml-auto p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
          title="메모 보기"
        >
          <span className="material-symbols-outlined text-lg">sticky_note_2</span>
        </button>
      </div>

      {/* Teacher's Note */}
      <div className="px-4 pb-4 pt-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Memo
            </span>
          </div>
          <span className="text-[10px] font-medium text-on-surface-variant/60">
            {latestMemo ? latestMemo.date : '—'}
          </span>
        </div>
        <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2 min-h-10">
          {latestMemo ? latestMemo.content : 'No notes yet.'}
        </p>
      </div>
    </div>
  );
}
