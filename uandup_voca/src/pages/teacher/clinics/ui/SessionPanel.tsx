import { todayDay, TIME_GROUPS } from '@/entities/clinic';
import type { Day, TimeGroup, ClinicHour } from '@/entities/clinic';

interface Props {
  selectedSlot: { day: Day; hour: ClinicHour };
  expandedGroups: Record<TimeGroup, boolean>;
  onPrevDay: () => void;
  onNextDay: () => void;
  onSelectHour: (hour: ClinicHour) => void;
  onToggleGroup: (group: TimeGroup) => void;
}

export function SessionPanel({
  selectedSlot,
  expandedGroups,
  onPrevDay,
  onNextDay,
  onSelectHour,
  onToggleGroup,
}: Props) {
  return (
    <div className="col-span-3 space-y-4">
      {/* 요일 네비게이터 */}
      <div className="flex items-center justify-between bg-surface-container-low p-2 rounded-xl">
        <button
          onClick={onPrevDay}
          className="p-1 hover:bg-surface-container-high rounded transition-colors"
        >
          <span className="material-symbols-outlined text-primary text-xl">chevron_left</span>
        </button>
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-black uppercase tracking-widest text-primary">
            {selectedSlot.day}
          </h3>
          {selectedSlot.day === todayDay && (
            <span className="text-[10px] font-bold bg-primary text-white px-1.5 py-1 rounded-full leading-none">
              TODAY
            </span>
          )}
        </div>
        <button
          onClick={onNextDay}
          className="p-1 hover:bg-surface-container-high rounded transition-colors"
        >
          <span className="material-symbols-outlined text-primary text-xl">chevron_right</span>
        </button>
      </div>

      {/* 슬롯 카드 목록 */}
      <div className="space-y-2">
        {TIME_GROUPS.map((group) => {
          const isOpen = expandedGroups[group.key];
          return (
            <div
              key={group.key}
              className="rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => onToggleGroup(group.key)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="text-[11px] xl:text-xs font-black uppercase tracking-widest text-on-surface">
                    {group.label}
                  </span>
                  <span className="text-[11px] xl:text-xs font-normal text-on-surface-variant/60">
                    {group.range}
                  </span>
                </span>
                <span className="material-symbols-outlined text-base text-on-surface-variant">
                  {isOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              {isOpen && (
                <div className="bg-white">
                  {group.hours.map((hour) => {
                    const isSelected = selectedSlot.hour === hour;
                    return (
                      <button
                        key={hour}
                        onClick={() => onSelectHour(hour)}
                        className={`w-full text-left px-4 py-3 flex items-center transition-all cursor-pointer border-l-4 ${
                          isSelected
                            ? 'bg-primary-fixed border-primary'
                            : 'border-transparent hover:bg-surface-container-low/50'
                        }`}
                      >
                        <span
                          className={`text-sm font-bold transition-colors ${isSelected ? 'text-primary' : 'text-on-surface/80'}`}
                        >
                          {String(hour).padStart(2, '0')}:00 – {String(hour + 1).padStart(2, '0')}
                          :00
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
