import { useState } from 'react';
import type { Parent } from '@/entities/member';
import { PARENT_MOCK } from '@/entities/member';

interface ParentListPanelProps {
  selectedId: number | null;
  onSelect: (parent: Parent) => void;
}

export function ParentListPanel({ selectedId, onSelect }: ParentListPanelProps) {
  const [search, setSearch] = useState('');
  const filtered = PARENT_MOCK.filter((p) => p.nameKo.includes(search) || p.phone.includes(search));

  return (
    <div className="absolute left-full top-0 ml-3 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full">
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-outline-variant/30 shrink-0">
        <h3 className="text-sm font-extrabold font-headline text-primary">Parent List</h3>
        <p className="text-xs text-on-surface-variant mt-0.5">Select to apply</p>
      </div>

      {/* 검색바 */}
      <div className="px-4 py-3 border-b border-outline-variant/20 shrink-0">
        <div className="relative">
          <input
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-1.5 pl-2 pr-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="Name or phone number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {/* 목록 */}
      <ul className="flex-1 overflow-y-auto divide-y divide-outline-variant/20">
        {filtered.length === 0 && (
          <li className="px-5 py-6 text-xs text-on-surface-variant text-center">
            No results found
          </li>
        )}
        {filtered.map((parent) => {
          const isSelected = selectedId === parent.id;
          return (
            <li key={parent.id}>
              <button
                type="button"
                onClick={() => onSelect(parent)}
                className={`w-full text-left px-5 py-3.5 transition-colors ${
                  isSelected ? 'bg-primary/10' : 'hover:bg-surface-container-low'
                }`}
              >
                <p
                  className={`text-sm font-bold flex items-center gap-1 ${isSelected ? 'text-primary' : 'text-on-surface'}`}
                >
                  {parent.nameKo}
                  {isSelected && <span className="material-symbols-outlined text-sm">check</span>}
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">{parent.phone}</p>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
