import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PageTitle } from '@/shared/ui/PageTitle';
import { TableContainer } from '@/shared/ui/TableContainer';
import { LevelBlock } from '@/entities/word';
import type { ClinicStudentRow } from '@/entities/member';
import { TestConfigBadges } from '@/entities/test';
import { MemoPopup } from '@/entities/memo';
import { DAYS, DAY_API_MAP, todayDay, TIME_GROUPS } from '@/entities/clinic';
import type { Day, TimeGroup, ClinicHour } from '@/entities/clinic';
import { useClinics } from './model/useClinics';
import { EditMembersModal } from './ui/EditMembersModal';

export default function ClinicsPage() {
  const [selectedSlot, setSelectedSlot] = useState<{ day: Day; hour: ClinicHour }>({
    day: todayDay,
    hour: 9,
  });
  const [memoStudent, setMemoStudent] = useState<ClinicStudentRow | null>(null);
  const navigate = useNavigate();
  const [isEditMembersOpen, setIsEditMembersOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<TimeGroup, boolean>>({
    morning: true,
    afternoon: true,
    evening: true,
  });

  const { students } = useClinics(DAY_API_MAP[selectedSlot.day], selectedSlot.hour);

  function toggleGroup(group: TimeGroup) {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  }

  function handlePrevDay() {
    const idx = DAYS.indexOf(selectedSlot.day);
    setSelectedSlot((prev) => ({ ...prev, day: DAYS[(idx - 1 + DAYS.length) % DAYS.length] }));
  }

  function handleNextDay() {
    const idx = DAYS.indexOf(selectedSlot.day);
    setSelectedSlot((prev) => ({ ...prev, day: DAYS[(idx + 1) % DAYS.length] }));
  }

  return (
    <main>
      <PageTitle title="Clinics" />

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* 세션 목록 */}
        <div className="col-span-3 space-y-4">
          {/* 요일 네비게이터 */}
          <div className="flex items-center justify-between bg-surface-container-low p-2 rounded-xl">
            <button
              onClick={handlePrevDay}
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
              onClick={handleNextDay}
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
                    onClick={() => toggleGroup(group.key)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-widest text-on-surface">
                        {group.label}
                      </span>
                      <span className="text-xs font-normal text-on-surface-variant/60">
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
                        const isSelected =
                          selectedSlot.day === selectedSlot.day && selectedSlot.hour === hour;
                        return (
                          <button
                            key={hour}
                            onClick={() => setSelectedSlot((prev) => ({ ...prev, hour }))}
                            className={`w-full text-left px-4 py-3 flex items-center transition-all cursor-pointer border-l-4 ${
                              isSelected
                                ? 'bg-primary-fixed border-primary'
                                : 'border-transparent hover:bg-surface-container-low/50'
                            }`}
                          >
                            <span
                              className={`text-sm font-bold transition-colors ${isSelected ? 'text-primary' : 'text-on-surface/80'}`}
                            >
                              {String(hour).padStart(2, '0')}:00 –{' '}
                              {String(hour + 1).padStart(2, '0')}:00
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

        {/* 학생 테이블 */}
        <div className="col-span-9 space-y-4">
          <div className="flex justify-start">
            <button
              onClick={() => setIsEditMembersOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-on-primary-fixed-variant bg-surface-container-lowest border/20 shadow-sm hover:bg-surface-container-low transition-colors font-medium"
            >
              <span className="material-symbols-outlined text-lg">person_add</span>
              Edit Members
            </button>
          </div>
          <TableContainer>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed">
                <colgroup>
                  <col className="w-[18%]" />
                  <col className="w-[7%]" />
                  <col className="w-[7%]" />
                  <col className="w-[7%]" />
                  <col className="w-[7%]" />
                  <col className="w-[12%]" />
                  <col className="w-[42%]" />
                </colgroup>
                <thead>
                  <tr className="bg-surface-container-highest/30">
                    <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest border-r border-outline-variant/20">
                      Name
                    </th>
                    <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">
                      Grade
                    </th>
                    <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">
                      Level
                    </th>
                    <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">
                      QTY
                    </th>
                    <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">
                      Test
                    </th>
                    <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">
                      Config
                    </th>
                    <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                      Memo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      onClick={() =>
                        navigate({
                          to: '/teacher/clinics/students/$studentId',
                          params: { studentId: String(student.id) },
                        })
                      }
                      className="transition-colors group hover:bg-surface-container-low/30 cursor-pointer"
                    >
                      <td className="px-4 py-4 border-r border-outline-variant/20">
                        <p className="font-headline font-bold text-sm text-primary">
                          {student.nameKo}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {student.nameFirstEn} {student.nameLastEn}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-center border-r border-outline-variant/20">
                        <span className="px-2 py-1 bg-surface-container-highest text-primary font-bold text-xs rounded-full">
                          {student.grade}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center border-r border-outline-variant/20">
                        <div className="flex justify-center">
                          <LevelBlock level={student.assignedLevel} />
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center border-r border-outline-variant/20">
                        <span className="font-headline font-bold text-sm text-on-surface">
                          {student.assignedWordCount}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center border-r border-outline-variant/20">
                        <span className="font-headline font-bold text-sm text-on-surface">
                          {student.testQuestionCount}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center border-r border-outline-variant/20">
                        <div className="flex justify-center">
                          <TestConfigBadges config={student.testConfig} />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs text-on-surface-variant truncate flex-1">
                            {student.latestMemoContent ?? '—'}
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMemoStudent(student);
                            }}
                            className="shrink-0 p-1 rounded-md text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-base">
                              sticky_note_2
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TableContainer>
        </div>
      </div>

      {isEditMembersOpen && (
        <EditMembersModal
          dayOfWeek={DAY_API_MAP[selectedSlot.day]}
          hour={selectedSlot.hour}
          onClose={() => setIsEditMembersOpen(false)}
        />
      )}
      {memoStudent && (
        <MemoPopup
          studentId={memoStudent.id}
          studentName={memoStudent.nameKo}
          onClose={() => setMemoStudent(null)}
        />
      )}
    </main>
  );
}
