import { useState } from 'react';
import { ModalBackdrop } from '@/shared/ui/ModalBackdrop';
import {
  PENDING_STUDENTS,
  PENDING_PARENTS,
  PENDING_TEACHERS,
  REGISTERED_STUDENTS,
  type PendingStudent,
  type PendingParent,
  type PendingTeacher,
  type RegisteredStudent,
} from '../../mock/adminMockData';

interface Props {
  onClose: () => void;
}

type Tab = 'student' | 'parent' | 'teacher';

const TAB_LABELS: Record<Tab, string> = {
  student: 'Student',
  parent: 'Parent',
  teacher: 'Teacher',
};

// ─── 학생 탭 ────────────────────────────────────────────────
function StudentTab() {
  const [list, setList] = useState<PendingStudent[]>(PENDING_STUDENTS);

  function handleApprove(id: number) {
    setList((p) => p.filter((s) => s.id !== id));
  }
  function handleReject(id: number) {
    setList((p) => p.filter((s) => s.id !== id));
  }

  return (
    <PendingList
      empty={list.length === 0}
      items={list}
      renderItem={(s) => (
        <div key={s.id} className="flex items-center justify-between px-7 py-4 min-h-[68px]">
          <div>
            <p className="text-sm font-bold text-on-surface">{s.nameKo}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {s.name} · G{s.grade}
            </p>
          </div>
          <ApproveRejectButtons
            onApprove={() => handleApprove(s.id)}
            onReject={() => handleReject(s.id)}
          />
        </div>
      )}
    />
  );
}

// ─── 학부모 탭 ──────────────────────────────────────────────
function ParentTab() {
  const [list, setList] = useState<PendingParent[]>(PENDING_PARENTS);
  const [matchingId, setMatchingId] = useState<number | null>(null);

  function handleApprove(id: number) {
    setList((p) => p.filter((s) => s.id !== id));
  }
  function handleReject(id: number) {
    setList((p) => p.filter((s) => s.id !== id));
  }
  function handleMatch(parentId: number, student: RegisteredStudent) {
    setList((p) =>
      p.map((x) =>
        x.id === parentId ? { ...x, matchedStudentId: student.id, childNameKo: student.nameKo } : x,
      ),
    );
    setMatchingId(null);
  }

  const matchingParent = list.find((p) => p.id === matchingId) ?? null;

  return (
    <div className="relative flex h-full">
      {/* 메인 리스트 */}
      <div
        className={`flex-1 overflow-y-auto divide-y divide-outline-variant/20 [scrollbar-width:thin] transition-all ${matchingId !== null ? 'opacity-40 pointer-events-none' : ''}`}
      >
        {list.length === 0 ? (
          <EmptyState />
        ) : (
          list.map((p) => {
            const matched = REGISTERED_STUDENTS.find((s) => s.id === p.matchedStudentId);
            return (
              <div
                key={p.id}
                className="flex items-center justify-between px-7 py-4 min-h-19 gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-on-surface">
                    {p.nameKo}
                    <span className="text-xs font-medium text-on-surface-variant ml-1.5">
                      ( {p.phone} )
                    </span>
                  </p>
                  {/* 자녀 정보 / 매칭 상태 */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-on-surface-variant">
                      자녀: {p.childNameKo} ({p.childGrade})
                    </span>
                    {matched ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                          link
                        </span>
                        {matched.nameKo} · G{matched.grade}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setMatchingId(p.id)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-on-surface-variant border border-outline-variant/40 px-2 py-0.5 rounded-full hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                          person_search
                        </span>
                        Match Student
                      </button>
                    )}
                  </div>
                </div>
                <ApproveRejectButtons
                  onApprove={() => handleApprove(p.id)}
                  onReject={() => handleReject(p.id)}
                />
              </div>
            );
          })
        )}
      </div>

      {/* 학생 매칭 패널 */}
      {matchingId !== null && matchingParent && (
        <StudentMatchPanel
          parent={matchingParent}
          onSelect={(s) => handleMatch(matchingId, s)}
          onClose={() => setMatchingId(null)}
        />
      )}
    </div>
  );
}

// ─── 학생 매칭 패널 ──────────────────────────────────────────
function StudentMatchPanel({
  parent,
  onSelect,
  onClose,
}: {
  parent: PendingParent;
  onSelect: (s: RegisteredStudent) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const filtered = REGISTERED_STUDENTS.filter(
    (s) => s.nameKo.includes(search) || s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="absolute inset-0 bg-surface flex flex-col">
      {/* 패널 헤더 */}
      <div className="px-7 py-4 border-b border-outline-variant/20 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-extrabold text-primary">Match Student</p>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
        <p className="text-xs text-on-surface-variant">
          학부모: <span className="font-bold text-on-surface">{parent.nameKo}</span> → 자녀:{' '}
          <span className="font-bold text-on-surface">{parent.childNameKo}</span>
        </p>
      </div>

      {/* 검색 */}
      <div className="px-7 py-3 border-b border-outline-variant/20 shrink-0">
        <input
          autoFocus
          className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          placeholder="학생 이름 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 학생 목록 */}
      <ul className="flex-1 overflow-y-auto divide-y divide-outline-variant/20 [scrollbar-width:thin]">
        {filtered.length === 0 ? (
          <li className="flex items-center justify-center py-10 text-xs text-on-surface-variant">
            검색 결과가 없습니다
          </li>
        ) : (
          filtered.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelect(s)}
                className="w-full flex items-center justify-between px-7 py-3.5 hover:bg-primary/5 transition-colors text-left"
              >
                <div>
                  <p className="text-sm font-bold text-on-surface">{s.nameKo}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {s.name} · G{s.grade}
                  </p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant/40 text-base">
                  chevron_right
                </span>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

// ─── 선생님 탭 ──────────────────────────────────────────────
function TeacherTab() {
  const [list, setList] = useState<PendingTeacher[]>(PENDING_TEACHERS);

  function handleApprove(id: number) {
    setList((p) => p.filter((s) => s.id !== id));
  }
  function handleReject(id: number) {
    setList((p) => p.filter((s) => s.id !== id));
  }

  return (
    <PendingList
      empty={list.length === 0}
      items={list}
      renderItem={(t) => (
        <div key={t.id} className="flex items-center justify-between px-7 py-4 min-h-[68px]">
          <div>
            <p className="text-sm font-bold text-on-surface">{t.nameKo}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{t.name}</p>
          </div>
          <ApproveRejectButtons
            onApprove={() => handleApprove(t.id)}
            onReject={() => handleReject(t.id)}
          />
        </div>
      )}
    />
  );
}

// ─── 공통 컴포넌트 ──────────────────────────────────────────
function PendingList<T>({
  empty,
  items,
  renderItem,
}: {
  empty: boolean;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}) {
  return (
    <div className="overflow-y-auto divide-y divide-outline-variant/20 [scrollbar-width:thin] h-full">
      {empty ? <EmptyState /> : items.map(renderItem)}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-on-surface-variant/50 py-16">
      <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
      <p className="text-sm font-bold">All caught up!</p>
    </div>
  );
}

function ApproveRejectButtons({
  onApprove,
  onReject,
}: {
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={onReject}
        className="px-4 py-1.5 rounded-lg text-xs font-bold border border-outline-variant/30 text-on-surface-variant hover:bg-error/10 hover:text-error hover:border-error/30 transition-colors"
      >
        Reject
      </button>
      <button
        onClick={onApprove}
        className="px-4 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:opacity-90 transition-opacity"
      >
        Approve
      </button>
    </div>
  );
}

// ─── 메인 모달 ──────────────────────────────────────────────
export function PendingApprovalsModal({ onClose }: Props) {
  const [tab, setTab] = useState<Tab>('student');

  const counts: Record<Tab, number> = {
    student: PENDING_STUDENTS.length,
    parent: PENDING_PARENTS.length,
    teacher: PENDING_TEACHERS.length,
  };

  return (
    <ModalBackdrop onClose={onClose} padding="p-6">
      <div
        className="w-full max-w-lg bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ height: '540px' }}
      >
        {/* 헤더 */}
        <div className="px-7 py-5 border-b border-outline-variant/30 flex justify-between items-center shrink-0">
          <h2 className="font-headline text-xl font-bold text-primary">Pending Approvals</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* 탭 */}
        <div className="flex border-b border-outline-variant/20 shrink-0">
          {(['student', 'parent', 'teacher'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors relative ${
                tab === t ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {TAB_LABELS[t]}
              {counts[t] > 0 && (
                <span
                  className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    tab === t
                      ? 'bg-primary text-white'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {counts[t]}
                </span>
              )}
              {tab === t && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="flex-1 overflow-hidden relative">
          {tab === 'student' && <StudentTab />}
          {tab === 'parent' && <ParentTab />}
          {tab === 'teacher' && <TeacherTab />}
        </div>
      </div>
    </ModalBackdrop>
  );
}
