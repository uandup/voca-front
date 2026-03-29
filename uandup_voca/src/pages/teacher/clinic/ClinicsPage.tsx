import { useState } from "react";
import { PageTitle } from "@/shared/ui/PageTitle";
import { TableContainer } from "@/shared/ui/TableContainer";
import { AssignedLevelBlocks } from "@/entities/vocab";
import { CLINIC_MOCK, type ClinicSession } from "./mock/clinicMockData";

// 월~토 앞 3글자 (일요일 제외)
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
type Day = (typeof DAYS)[number];

// JS getDay(): 0=일, 1=월 ... 6=토. 일요일은 Mon으로 fallback
const todayDay = DAYS[Math.max(0, new Date().getDay() - 1)];

export default function ClinicsPage() {
  const data = CLINIC_MOCK;
  const [selectedDay, setSelectedDay] = useState<Day>(todayDay);
  const [selectedSession, setSelectedSession] = useState<ClinicSession>(
    data.sessions[2],
  );

  function handlePrevDay() {
    const idx = DAYS.indexOf(selectedDay);
    setSelectedDay(DAYS[(idx - 1 + DAYS.length) % DAYS.length]);
  }

  function handleNextDay() {
    const idx = DAYS.indexOf(selectedDay);
    setSelectedDay(DAYS[(idx + 1) % DAYS.length]);
  }

  return (
    <main>
      {/* Header */}
      <PageTitle title={data.clinicName} />
      <p className="text-on-surface-variant -mt-6 mb-8 text-base font-medium">
        {data.subtitle}
      </p>

      <div className="grid grid-cols-12 gap-8">
        {/* 세션 목록 */}
        <div className="col-span-3 space-y-4">
          {/* 요일 네비게이터 */}
          <div className="flex items-center justify-between bg-surface-container-low p-2 rounded-xl">
            <button
              onClick={handlePrevDay}
              className="p-1 hover:bg-surface-container-high rounded transition-colors"
            >
              <span className="material-symbols-outlined text-primary text-xl">
                chevron_left
              </span>
            </button>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary">
                {selectedDay}
              </h3>
              {selectedDay === todayDay && (
                <span className="text-[10px] font-bold bg-primary text-white px-1.5 py-1 rounded-full leading-none">
                  TODAY
                </span>
              )}
            </div>
            <button
              onClick={handleNextDay}
              className="p-1 hover:bg-surface-container-high rounded transition-colors"
            >
              <span className="material-symbols-outlined text-primary text-xl">
                chevron_right
              </span>
            </button>
          </div>

          {/* 세션 카드 목록 */}
          <div className="space-y-3">
            {data.sessions.map((session) => {
              const isSelected = session.id === selectedSession.id;
              return (
                <button
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className={`w-full text-left p-4 rounded-xl flex justify-between items-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary-fixed border-l-4 border-primary shadow-md rounded-r-xl"
                      : "bg-white border border-outline-variant/30 hover:border-primary/40 shadow-sm"
                  }`}
                >
                  <span
                    className={`text-sm font-bold transition-colors ${
                      isSelected ? "text-primary" : "text-on-surface/80"
                    }`}
                  >
                    {session.timeSlot}
                  </span>
                  <span
                    className={`text-xs font-black px-2 py-1 rounded ${
                      isSelected
                        ? "text-primary bg-white/50"
                        : "text-on-surface-variant bg-surface-container-highest"
                    }`}
                  >
                    {session.enrolled} / {session.capacity}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 학생 테이블 */}
        <div className="col-span-9">
          <TableContainer>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed">
                <colgroup>
                  <col className="w-[18%]" />
                  <col className="w-[10%]" />
                  <col className="w-[20%]" />
                  <col className="w-[12%]" />
                  <col className="w-[40%]" />
                </colgroup>
                <thead>
                  <tr className="bg-surface-container-highest/30">
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest border-r border-outline-variant/20">
                      Name
                    </th>
                    <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">
                      Grade
                    </th>
                    <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">
                      Level
                    </th>
                    <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">
                      Count
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                      Memo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {selectedSession.students.map((student) => (
                    <tr
                      key={student.id}
                      className="transition-colors group hover:bg-surface-container-low/30"
                    >
                      <td className="px-6 py-5 border-r border-outline-variant/20">
                        <p className="font-headline font-bold text-sm text-primary">
                          {student.name}
                        </p>
                      </td>
                      <td className="px-4 py-5 text-center border-r border-outline-variant/20">
                        <span className="px-3 py-1 bg-surface-container-highest text-primary font-bold text-sm rounded-full">
                          {student.grade}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-center border-r border-outline-variant/20">
                        <AssignedLevelBlocks levels={student.assignedLevels} />
                      </td>
                      <td className="px-4 py-5 text-center border-r border-outline-variant/20">
                        <span className="font-headline font-bold text-primary text-sm">
                          {student.wordCount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-on-surface-variant">
                        {student.memo ?? "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TableContainer>
        </div>
      </div>
    </main>
  );
}
