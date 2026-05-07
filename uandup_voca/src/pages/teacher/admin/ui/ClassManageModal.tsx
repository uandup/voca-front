import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ModalBackdrop } from '@/shared/ui/ModalBackdrop';
import { getClassrooms, createClassroom, updateClassroom, deleteClassroom } from '@/entities/class';
import type { components } from '@/shared/api/schema.gen';

type ClassroomSummary = components['schemas']['ClassroomSummary'];

interface Props {
  onClose: () => void;
}

export function ClassManageModal({ onClose }: Props) {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'classrooms'],
    queryFn: getClassrooms,
  });
  const classes: ClassroomSummary[] = data?.data ?? [];

  const addMutation = useMutation({
    mutationFn: (name: string) => createClassroom({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'classrooms'] });
      setNewName('');
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => updateClassroom(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'classrooms'] });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteClassroom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'classrooms'] });
      setDeletingId(null);
    },
  });

  function handleAdd() {
    const trimmed = newName.trim();
    if (!trimmed || classes.some((c) => c.className === trimmed)) return;
    addMutation.mutate(trimmed);
  }

  function handleEditStart(item: ClassroomSummary) {
    setEditingId(item.classId!);
    setEditingName(item.className ?? '');
  }

  function handleEditSave(item: ClassroomSummary) {
    const trimmed = editingName.trim();
    if (!trimmed || (trimmed !== item.className && classes.some((c) => c.className === trimmed))) {
      setEditingId(null);
      return;
    }
    editMutation.mutate({ id: item.classId!, name: trimmed });
  }

  return (
    <ModalBackdrop onClose={onClose} padding="p-6">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-7 py-5 border-b border-outline-variant/30 flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-headline text-xl font-bold text-primary">Class Management</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">{classes.length} classes</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-7 py-4 border-b border-outline-variant/20 shrink-0">
          <div className="flex gap-2">
            <input
              className="flex-1 min-w-0 bg-background border border-outline-variant/30 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="New class name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newName.trim() || addMutation.isPending}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary text-sm font-bold disabled:opacity-40 hover:opacity-90 transition-all"
            >
              Add
            </button>
          </div>
        </div>

        <ul
          className="overflow-y-auto divide-y divide-outline-variant/20 [scrollbar-width:thin]"
          style={{ height: '400px' }}
        >
          {isLoading ? (
            <li className="flex items-center justify-center h-full text-on-surface-variant/50">
              <span className="material-symbols-outlined text-3xl animate-spin">
                progress_activity
              </span>
            </li>
          ) : classes.length === 0 ? (
            <li className="flex items-center justify-center h-full text-sm text-on-surface-variant">
              No classes yet
            </li>
          ) : (
            classes.map((item) => (
              <li key={item.classId} className="flex items-center gap-3 px-7 py-3.5 min-h-14">
                {editingId === item.classId ? (
                  <>
                    <input
                      autoFocus
                      className="flex-1 min-w-0 border border-primary/40 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave(item);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      onBlur={() => handleEditSave(item)}
                    />
                  </>
                ) : deletingId === item.classId ? (
                  <>
                    <p className="flex-1 text-sm text-error font-bold">
                      Delete "{item.className}"?
                    </p>
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setDeletingId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMutation.mutate(item.classId!)}
                        disabled={deleteMutation.isPending}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-error text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-on-surface">{item.className}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          handleEditStart(item);
                          setDeletingId(null);
                        }}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                          edit
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeletingId(item.classId!);
                          setEditingId(null);
                        }}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/5 transition-colors"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                          delete
                        </span>
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </ModalBackdrop>
  );
}
