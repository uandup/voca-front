import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getClassrooms,
  createClassroom,
  updateClassroom,
  deleteClassroom,
  toClassListItem,
} from '@/entities/class';

export function useClassManage() {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: classes, isLoading } = useQuery({
    queryKey: ['admin', 'classrooms'],
    queryFn: getClassrooms,
    select: (res) => res.data?.map(toClassListItem) ?? [],
  });

  const classList = classes ?? [];

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
    if (!trimmed || classList.some((c) => c.name === trimmed)) return;
    addMutation.mutate(trimmed);
  }

  function handleEditStart(id: number, name: string) {
    setEditingId(id);
    setEditingName(name);
  }

  function handleEditSave(id: number, originalName: string) {
    const trimmed = editingName.trim();
    if (!trimmed || (trimmed !== originalName && classList.some((c) => c.name === trimmed))) {
      setEditingId(null);
      return;
    }
    editMutation.mutate({ id, name: trimmed });
  }

  return {
    classList,
    isLoading,
    newName,
    setNewName,
    editingId,
    editingName,
    setEditingName,
    deletingId,
    setDeletingId,
    setEditingId,
    isAddPending: addMutation.isPending,
    isDeletePending: deleteMutation.isPending,
    handleAdd,
    handleEditStart,
    handleEditSave,
    handleDelete: deleteMutation.mutate,
  };
}
