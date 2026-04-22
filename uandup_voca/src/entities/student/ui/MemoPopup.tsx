import { useState } from 'react';
import { ModalBackdrop } from '@/shared/ui/ModalBackdrop';
import type { MemoItem } from '../types/memo';

interface MemoPopupProps {
  studentName: string;
  memos: MemoItem[];
  onClose: () => void;
  onChange: (memos: MemoItem[]) => void;
}

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function MemoPopup({ studentName, memos, onClose, onChange }: MemoPopupProps) {
  const [newDate, setNewDate] = useState(todayString());
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const sorted = [...memos].sort((a, b) => b.date.localeCompare(a.date));

  function handleAdd() {
    if (!newContent.trim()) return;
    const item: MemoItem = {
      id: Date.now(),
      date: newDate,
      content: newContent.trim(),
    };
    onChange([...memos, item]);
    setNewContent('');
    setNewDate(todayString());
  }

  function startEdit(item: MemoItem) {
    setEditingId(item.id);
    setEditContent(item.content);
  }

  function handleEditSave(id: number) {
    if (!editContent.trim()) return;
    onChange(memos.map((m) => (m.id === id ? { ...m, content: editContent.trim() } : m)));
    setEditingId(null);
  }

  function handleDelete(id: number) {
    onChange(memos.filter((m) => m.id !== id));
    if (editingId === id) setEditingId(null);
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="px-8 py-4 border-b border-outline-variant/30 flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-xl font-extrabold font-headline tracking-tight text-primary">
              Memos
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">{studentName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-container-low text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Memo list */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
          {sorted.length === 0 && (
            <p className="text-sm text-on-surface-variant text-center py-8">메모가 없습니다.</p>
          )}
          {sorted.map((memo) => (
            <div
              key={memo.id}
              className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-on-surface-variant">{memo.date}</span>
                <div className="flex items-center gap-1">
                  {editingId === memo.id ? (
                    <>
                      <button
                        onClick={() => handleEditSave(memo.id)}
                        className="px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2.5 py-1 rounded-lg border border-outline-variant text-on-surface-variant text-xs font-bold hover:bg-surface-container transition-colors"
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(memo)}
                        className="p-1 text-on-surface-variant hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(memo.id)}
                        className="p-1 text-on-surface-variant hover:text-error transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
              {editingId === memo.id ? (
                <textarea
                  className="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  rows={3}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  autoFocus
                />
              ) : (
                <p className="text-sm text-on-surface whitespace-pre-wrap">{memo.content}</p>
              )}
            </div>
          ))}
        </div>

        {/* Add form */}
        <div className="px-6 py-4 border-t border-outline-variant/30 bg-surface-container-lowest shrink-0 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              새 메모
            </span>
            <input
              type="text"
              className="border border-outline-variant/30 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-32"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              placeholder="YYYY.MM.DD"
            />
          </div>
          <div className="flex gap-2">
            <textarea
              className="flex-1 border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              rows={2}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="메모 내용을 입력하세요..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAdd();
              }}
            />
            <button
              onClick={handleAdd}
              disabled={!newContent.trim()}
              className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed self-end"
            >
              추가
            </button>
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}
