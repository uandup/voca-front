import { useState } from "react";
import { PageTitle } from "@/shared/ui/PageTitle";
import { TableContainer } from "@/shared/ui/TableContainer";
import { AssignedLevelBlocks } from "@/entities/vocab";
import {
  CLINIC_MOCK,
  type ClinicStudent,
} from "./mock/clinicMockData";
import { StudentDetailModal } from "./ui/StudentDetailModal";
import { EditMembersModal } from "@/features/roster-manage";
import { TestConfigBadges } from "@/pages/teacher/student-manage/ui/table/cells/TestConfigBadges";
import { MemoPopup } from "@/pages/teacher/student-manage/ui/modals/MemoPopup";
import type { MemoItem } from "@/pages/teacher/student-manage/mock/studentManageMockData";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
type Day = (typeof DAYS)[number];

const todayDay = DAYS[Math.max(0, new Date().getDay() - 1)];

export default function ClinicsPage() {
  const [sessions, setSessions] = useState(CLINIC_MOCK.sessions);
  const [selectedDay, setSelectedDay] = useState<Day>(todayDay);
  const [selectedSessionId, setSelectedSessionId] = useState<string>(CLINIC_MOCK.sessions[0].id);
  const [selectedStudent, setSelectedStudent] = useState<ClinicStudent | null>(null);
  const [memoStudent, setMemoStudent] = useState<ClinicStudent | null>(null);
  const [isEditMembersOpen, setIsEditMembersOpen] = useState(false);

  const selectedSession = sessions.find((s) => s.id === selectedSessionId) ?? sessions[0];

  function handlePrevDay() {
    const idx = DAYS.indexOf(selectedDay);
    setSelectedDay(DAYS[(idx - 1 + DAYS.length) % DAYS.length]);
  }

  function handleNextDay() {
    const idx = DAYS.indexOf(selectedDay);
    setSelectedDay(DAYS[(idx + 1) % DAYS.length]);
  }

  function handleMemoChange(studentId: string, newMemos: MemoItem[]) {
    setSessions((prev) =>
      prev.map((session) => ({
        ...session,
        students: session.students.map((s) =>
          s.id === studentId ? { ...s, memos: newMemos } : s,
        ),
      })),
    );
    setMemoStudent((prev) =>
      prev?.id === studentId ? { ...prev, memos: newMemos } : prev,
    );
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
              <span className="material-symbols-outlined text-primary text-xl">chevron_right</span>
            </button>
          </div>

          {/* 세션 카드 목록 */}
          <div className="space-y-2">
            {sessions.map((session) => {
              const isSelected = session.id === selectedSessionId;
              return (
                <button
                  key={session.id}
                  onClick={() => setSelectedSessionId(session.id)}
                  className={`w-full text-left px-5 py-3.5 rounded-xl flex justify-between items-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary-fixed border-l-4 border-primary shadow-md rounded-r-xl"
                      : "bg-white border border-outline-variant/30 hover:border-primary/40 shadow-sm"
                  }`}
                >
                  <span className={`text-sm font-bold transition-colors ${isSelected ? "text-primary" : "text-on-surface/80"}`}>
                    {session.timeSlot}
                  </span>
                  <span className={`text-xs font-black px-2 py-1 rounded ${isSelected ? "text-primary bg-white/50" : "text-on-surface-variant bg-surface-container-highest"}`}>
                    {session.enrolled}
                  </span>
                </button>
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
                    <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest border-r border-outline-variant/20">Name</th>
                    <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">Grade</th>
                    <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">Level</th>
                    <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">QTY</th>
                    <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">Test</th>
                    <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center border-r border-outline-variant/20">Config</th>
                    <th className="px-4 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Memo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {selectedSession.students.map((student) => {
                    const latestMemo = [...student.memos].sort((a, b) =>
                      b.date.localeCompare(a.date),
                    )[0];
                    return (
                      <tr
                        key={student.id}
                        onClick={() => setSelectedStudent(student)}
                        className="transition-colors group hover:bg-surface-container-low/30 cursor-pointer"
                      >
                        <td className="px-4 py-4 border-r border-outline-variant/20">
                          <p className="font-headline font-bold text-sm text-primary">
                            {student.nameLastKo}{student.nameFirstKo}
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
                            <AssignedLevelBlocks level={student.assignedLevel} />
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
                              {latestMemo ? latestMemo.content : "—"}
                            </p>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMemoStudent(student);
                              }}
                              className="shrink-0 p-1 rounded-md text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-base">sticky_note_2</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TableContainer>
        </div>
      </div>

      {isEditMembersOpen && (
        <EditMembersModal onClose={() => setIsEditMembersOpen(false)} />
      )}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
      {memoStudent && (
        <MemoPopup
          studentName={`${memoStudent.nameLastKo}${memoStudent.nameFirstKo}`}
          memos={memoStudent.memos}
          onClose={() => setMemoStudent(null)}
          onChange={(newMemos) => handleMemoChange(memoStudent.id, newMemos)}
        />
      )}
    </main>
  );
}
