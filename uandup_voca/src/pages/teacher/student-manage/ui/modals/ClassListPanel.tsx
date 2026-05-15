import { useQuery } from '@tanstack/react-query';
import { getClassrooms, toClassListItem, classKeys } from '@/entities/class';
import type { Class } from '@/entities/class';

interface ClassListPanelProps {
  selectedClasses: Class[];
  onChange: (classes: Class[]) => void;
}

export function ClassListPanel({ selectedClasses, onChange }: ClassListPanelProps) {
  const { data: classList } = useQuery({
    queryKey: classKeys.list(),
    queryFn: getClassrooms,
    select: (res) => res.data?.map(toClassListItem) ?? [],
  });

  function handleToggle(item: Class) {
    if (selectedClasses.some((c) => c.id === item.id)) {
      onChange(selectedClasses.filter((c) => c.id !== item.id));
    } else {
      onChange([...selectedClasses, item]);
    }
  }

  return (
    <div className="absolute left-full top-0 ml-3 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full">
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-outline-variant/30 shrink-0">
        <h3 className="text-sm font-extrabold font-headline text-primary">Class List</h3>
        <p className="text-xs text-on-surface-variant mt-0.5">Multiple selection available</p>
      </div>

      {/* 목록 */}
      <ul className="flex-1 overflow-y-auto divide-y divide-outline-variant/20">
        {(classList ?? []).map((item) => {
          const isSelected = selectedClasses.some((c) => c.id === item.id);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleToggle(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                  isSelected ? 'bg-primary/5' : 'hover:bg-surface-container-low'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? 'bg-primary border-primary' : 'border-outline-variant/50'
                  }`}
                >
                  {isSelected && (
                    <span
                      className="material-symbols-outlined text-on-primary"
                      style={{ fontSize: '14px' }}
                    >
                      check
                    </span>
                  )}
                </span>
                <span
                  className={`flex-1 text-left text-sm truncate ${
                    isSelected ? 'font-bold text-primary' : 'text-on-surface'
                  }`}
                >
                  {item.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
