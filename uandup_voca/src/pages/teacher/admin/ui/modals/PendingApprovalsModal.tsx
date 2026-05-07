import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ModalBackdrop } from '@/shared/ui/ModalBackdrop';
import {
  getPendingStudents,
  getPendingParents,
  getPendingTeachers,
  approveMember,
  rejectMember,
} from '@/entities/member';
import type { components } from '@/shared/api/schema.gen';

type PendingStudent = components['schemas']['PendingStudentResponse'];
type PendingParent = components['schemas']['PendingParentResponse'];
type PendingTeacher = components['schemas']['PendingTeacherResponse'];

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
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'pending', 'students'],
    queryFn: getPendingStudents,
  });
  const list: PendingStudent[] = data?.data ?? [];

  const approve = useMutation({
    mutationFn: (id: number) => approveMember(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'pending'] }),
  });
  const reject = useMutation({
    mutationFn: (id: number) => rejectMember(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'pending'] }),
  });

  if (isLoading) return <LoadingState />;

  return (
    <PendingList
      empty={list.length === 0}
      items={list}
      renderItem={(s) => (
        <div key={s.studentId} className="flex items-center justify-between px-7 py-4 min-h-17">
          <div>
            <p className="text-sm font-bold text-on-surface">{s.name}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {s.englishName} · G{s.grade}
            </p>
          </div>
          <ApproveRejectButtons
            onApprove={() => approve.mutate(s.studentId!)}
            onReject={() => reject.mutate(s.studentId!)}
          />
        </div>
      )}
    />
  );
}

// ─── 학부모 탭 ──────────────────────────────────────────────
function ParentTab() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'pending', 'parents'],
    queryFn: getPendingParents,
  });
  const list: PendingParent[] = data?.data ?? [];

  const [matchingId, setMatchingId] = useState<number | null>(null);

  const approve = useMutation({
    mutationFn: (id: number) => approveMember(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'pending'] }),
  });
  const reject = useMutation({
    mutationFn: (id: number) => rejectMember(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'pending'] }),
  });

  const matchingParent = list.find((p) => p.parentId === matchingId) ?? null;

  if (isLoading) return <LoadingState />;

  return (
    <div className="relative flex h-full">
      <div
        className={`flex-1 overflow-y-auto divide-y divide-outline-variant/20 [scrollbar-width:thin] transition-all ${matchingId !== null ? 'opacity-40 pointer-events-none' : ''}`}
      >
        {list.length === 0 ? (
          <EmptyState />
        ) : (
          list.map((p) => (
            <div
              key={p.parentId}
              className="flex items-center justify-between px-7 py-4 min-h-19 gap-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-on-surface">
                  {p.name}
                  <span className="text-xs font-medium text-on-surface-variant ml-1.5">
                    ( {p.phoneNumber} )
                  </span>
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-on-surface-variant">
                    Child: {p.requestedChildName} (G{p.requestedChildGrade})
                  </span>
                  <button
                    type="button"
                    onClick={() => setMatchingId(p.parentId!)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-on-surface-variant border border-outline-variant/40 px-2 py-0.5 rounded-full hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                      person_search
                    </span>
                    Match Student
                  </button>
                </div>
              </div>
              <ApproveRejectButtons
                onApprove={() => approve.mutate(p.parentId!)}
                onReject={() => reject.mutate(p.parentId!)}
              />
            </div>
          ))
        )}
      </div>

      {matchingId !== null && matchingParent && (
        <StudentMatchPanel parent={matchingParent} onClose={() => setMatchingId(null)} />
      )}
    </div>
  );
}

// ─── 학생 매칭 패널 ──────────────────────────────────────────
function StudentMatchPanel({ parent, onClose }: { parent: PendingParent; onClose: () => void }) {
  const [search, setSearch] = useState('');

  return (
    <div className="absolute inset-0 bg-surface flex flex-col">
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
          Parent: <span className="font-bold text-on-surface">{parent.name}</span> → Child:{' '}
          <span className="font-bold text-on-surface">{parent.requestedChildName}</span>
        </p>
      </div>

      <div className="px-7 py-3 border-b border-outline-variant/20 shrink-0">
        <input
          autoFocus
          className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          placeholder="Search student name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 flex items-center justify-center text-xs text-on-surface-variant">
        Student matching will be available via API
      </div>
    </div>
  );
}

// ─── 선생님 탭 ──────────────────────────────────────────────
function TeacherTab() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'pending', 'teachers'],
    queryFn: getPendingTeachers,
  });
  const list: PendingTeacher[] = data?.data ?? [];

  const approve = useMutation({
    mutationFn: (id: number) => approveMember(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'pending'] }),
  });
  const reject = useMutation({
    mutationFn: (id: number) => rejectMember(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'pending'] }),
  });

  if (isLoading) return <LoadingState />;

  return (
    <PendingList
      empty={list.length === 0}
      items={list}
      renderItem={(t) => (
        <div key={t.teacherId} className="flex items-center justify-between px-7 py-4 min-h-17">
          <div>
            <p className="text-sm font-bold text-on-surface">{t.name}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{t.englishName}</p>
          </div>
          <ApproveRejectButtons
            onApprove={() => approve.mutate(t.teacherId!)}
            onReject={() => reject.mutate(t.teacherId!)}
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

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-full text-on-surface-variant/50 py-16">
      <span className="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
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

  const { data: studentsRes } = useQuery({
    queryKey: ['admin', 'pending', 'students'],
    queryFn: getPendingStudents,
  });
  const { data: parentsRes } = useQuery({
    queryKey: ['admin', 'pending', 'parents'],
    queryFn: getPendingParents,
  });
  const { data: teachersRes } = useQuery({
    queryKey: ['admin', 'pending', 'teachers'],
    queryFn: getPendingTeachers,
  });

  const counts: Record<Tab, number> = {
    student: studentsRes?.data?.length ?? 0,
    parent: parentsRes?.data?.length ?? 0,
    teacher: teachersRes?.data?.length ?? 0,
  };

  return (
    <ModalBackdrop onClose={onClose} padding="p-6">
      <div
        className="w-full max-w-lg bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ height: '540px' }}
      >
        <div className="px-7 py-5 border-b border-outline-variant/30 flex justify-between items-center shrink-0">
          <h2 className="font-headline text-xl font-bold text-primary">Pending Approvals</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

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

        <div className="flex-1 overflow-hidden relative">
          {tab === 'student' && <StudentTab />}
          {tab === 'parent' && <ParentTab />}
          {tab === 'teacher' && <TeacherTab />}
        </div>
      </div>
    </ModalBackdrop>
  );
}
