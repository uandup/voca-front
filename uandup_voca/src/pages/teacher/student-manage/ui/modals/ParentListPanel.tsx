import { useState } from "react";
import type { ParentInfo } from "../../mock/studentManageMockData";
import { PARENT_MOCK } from "../../mock/studentManageMockData";

interface ParentListPanelProps {
  selectedId: number | null;
  onSelect: (parent: ParentInfo) => void;
}

export function ParentListPanel({
  selectedId,
  onSelect,
}: ParentListPanelProps) {
  const [search, setSearch] = useState("");
  const filtered = PARENT_MOCK.filter(
    (p) => p.name.includes(search) || p.phone.includes(search),
  );

  return (
    <div className="absolute left-full top-0 ml-3 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full">
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-outline-variant/30 shrink-0">
        <h3 className="text-sm font-extrabold font-headline text-primary">
          학부모 목록
        </h3>
        <p className="text-xs text-on-surface-variant mt-0.5">
          선택하면 적용됩니다
        </p>
      </div>

      {/* 검색바 */}
      <div className="px-4 py-3 border-b border-outline-variant/20 shrink-0">
        <div className="relative">
          <input
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-1.5 pl-2 pr-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="이름 또는 연락처"
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
            검색 결과 없음
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
                  isSelected
                    ? "bg-primary/10"
                    : "hover:bg-surface-container-low"
                }`}
              >
                <p
                  className={`text-sm font-bold flex items-center gap-1 ${isSelected ? "text-primary" : "text-on-surface"}`}
                >
                  {parent.name}
                  {isSelected && (
                    <span className="material-symbols-outlined text-sm">
                      check
                    </span>
                  )}
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {parent.phone}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
