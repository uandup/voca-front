import { useState } from "react";
import { ModalBackdrop } from "@/shared/ui/ModalBackdrop";
import { TableContainer } from "@/shared/ui/TableContainer";
import { AssignedLevelBlocks } from "@/entities/vocab";
import type { ClinicStudent } from "../../mock/clinicMockData";

interface StudentDetailModalProps {
  student: ClinicStudent;
  onClose: () => void;
}

type TestType = "Word" | "Sentence" | "Review";
type TestStatus = "Pending" | "Graded";
type TestTab = "today" | "upcoming";

interface AssignedTest {
  id: string;
  assignedAt: string;
  type: TestType;
  levels: (1 | 2 | 3 | 4)[];
  quantity: number;
  status: TestStatus;
  scheduledFor: TestTab;
  score?: string; // Graded일 때만
}

const mockAssignedTests: AssignedTest[] = [
  {
    id: "#TX-8655",
    assignedAt: "26.03.25",
    type: "Word",
    levels: [4],
    quantity: 25,
    status: "Graded",
    scheduledFor: "today",
    score: "100/100",
  },
  {
    id: "#TX-8710",
    assignedAt: "26.03.28",
    type: "Review",
    levels: [3],
    quantity: 30,
    status: "Pending",
    scheduledFor: "today",
  },
  {
    id: "#TX-8821",
    assignedAt: "26.03.30",
    type: "Word",
    levels: [1],
    quantity: 25,
    status: "Graded",
    scheduledFor: "today",
    score: "98/100",
  },
  {
    id: "#TX-8794",
    assignedAt: "26.03.30",
    type: "Sentence",
    levels: [1, 2, 3, 4],
    quantity: 20,
    status: "Pending",
    scheduledFor: "today",
  },
  {
    id: "#TX-8655",
    assignedAt: "26.04.11",
    type: "Word",
    levels: [4],
    quantity: 25,
    status: "Graded",
    scheduledFor: "upcoming",
    score: "100/100",
  },
  {
    id: "#TX-8710",
    assignedAt: "26.04.13",
    type: "Review",
    levels: [3],
    quantity: 30,
    status: "Pending",
    scheduledFor: "upcoming",
  },
];

const TEST_TYPE_STYLES: Record<TestType, string> = {
  Word: "bg-primary/10 text-primary",
  Sentence: "bg-secondary-container text-on-secondary-container",
  Review: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
};

const levelProgress = [
  { label: "Level 1 Progress", value: "120/1040" },
  { label: "Level 2 Progress", value: "150/1040" },
  { label: "Level 3 Progress", value: "180/1040" },
  { label: "Level 4 Progress", value: "0/1040" },
];

export function StudentDetailModal({
  student,
  onClose,
}: StudentDetailModalProps) {
  const [selectedLevels, setSelectedLevels] = useState<number[]>([1]);
  const [selectedTab, setSelectedTab] = useState<TestTab>("today");
  const filteredTests = mockAssignedTests.filter(
    (t) => t.scheduledFor === selectedTab,
  );

  const alreadyAssigned = mockAssignedTests.some(
    (t) => t.scheduledFor === "today" && t.status === "Pending",
  );

  function toggleLevel(level: number) {
    setSelectedLevels((prev) =>
      prev.includes(level)
        ? prev.length > 1
          ? prev.filter((l) => l !== level)
          : prev // 최소 1개 유지
        : [...prev, level],
    );
  }

  return (
    <ModalBackdrop onClose={onClose} padding="p-6">
      <div className="w-full max-w-7xl bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-4 shadow-sm border-b border-outline-variant/30 flex justify-between items-center shrink-0 bg-surface">
          <div className="flex items-center gap-3">
            <h2 className="font-headline text-2xl font-bold text-primary">
              {student.name}
            </h2>
            <span className="bg-secondary-container text-on-secondary-container text-xs font-bold px-3 py-1 rounded-full">
              {student.grade}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-8 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-outline-variant/40 [&::-webkit-scrollbar-track]:bg-transparent">
          {/* Student Profile Card */}
          <section className="mb-8">
            <div className="grid grid-cols-4 gap-4">
              {levelProgress.map((item) => (
                <div
                  key={item.label}
                  className="bg-surface-container-lowest px-4 py-4 rounded-lg border border-primary/5 shadow-sm"
                >
                  <span className="block text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-1.5">
                    {item.label}
                  </span>
                  <span className="text-primary-container font-bold text-lg">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Assignment Bar */}
          <section className="mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-6 border border-primary/10">
              <div className="flex items-center gap-4 grow">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-primary-container whitespace-nowrap">
                    Difficulty:
                  </span>
                  <div className="flex gap-1 bg-surface-container-low p-1 rounded-lg">
                    {[1, 2, 3, 4].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => toggleLevel(lvl)}
                        className={
                          selectedLevels.includes(lvl)
                            ? "px-4 py-1.5 text-xs font-bold rounded-md bg-primary-container text-white shadow-sm transition-all"
                            : "px-4 py-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary-container transition-all"
                        }
                      >
                        Level {lvl}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="flex items-center gap-3">
                  <label
                    className="text-sm font-bold text-primary-container whitespace-nowrap"
                    htmlFor="modal_words_input"
                  >
                    Quantity:
                  </label>
                  <input
                    id="modal_words_input"
                    className="w-32 bg-surface-container-low border-none rounded-lg py-1.5 pl-3 pr-3 text-xs font-bold text-primary-container focus:ring-1 focus:ring-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    type="number"
                    defaultValue={25}
                    disabled={alreadyAssigned}
                  />
                </div>
                {alreadyAssigned && (
                  <div className="flex gap-4">
                    <div className="h-8 w-px bg-slate-200" />
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                      <span className="material-symbols-outlined text-base">
                        check_circle
                      </span>
                      Already Assigned
                    </div>
                  </div>
                )}
              </div>
              <button
                disabled={alreadyAssigned}
                className="bg-primary-container hover:opacity-90 text-white px-8 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:opacity-40"
              >
                <span className="material-symbols-outlined text-lg">send</span>
                Assign
              </button>
            </div>
          </section>

          {/* Test History */}
          <div>
            {/* 탭 */}
            <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl mb-3 w-fit">
              {(["today", "upcoming"] as TestTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                    selectedTab === tab
                      ? "bg-white text-primary shadow-sm"
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {tab === "today" ? "Today" : "Upcoming"}
                </button>
              ))}
            </div>
            <TableContainer>
              <div className="flex flex-col h-95">
                {/* 헤더 — 고정 */}
                <table className="w-full border-collapse table-fixed shrink-0">
                  <colgroup>
                    <col className="w-[12%]" />
                    <col className="w-[13%]" />
                    <col className="w-[10%]" />
                    <col className="w-[16%]" />
                    <col className="w-[11%]" />
                    <col className="w-[11%]" />
                    <col className="w-[27%]" />
                  </colgroup>
                  <thead>
                    <tr className="bg-surface-container-low">
                      {[
                        "TEST ID",
                        "ASSIGNED",
                        "TYPE",
                        "LEVEL",
                        "SCORE",
                        "STATUS",
                        "ACTIONS",
                      ].map((col) => (
                        <th
                          key={col}
                          className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant ${col === "ACTIONS" ? "text-right" : "text-left"}`}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                </table>
                {/* 바디 — 스크롤 */}
                <div className="flex-1 overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-outline-variant/40 [&::-webkit-scrollbar-track]:bg-transparent">
                  {filteredTests.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm text-on-surface-variant/50 font-medium">
                      배정된 시험이 없습니다.
                    </div>
                  ) : (
                    <table className="w-full border-collapse table-fixed">
                      <colgroup>
                        <col className="w-[12%]" />
                        <col className="w-[13%]" />
                        <col className="w-[10%]" />
                        <col className="w-[16%]" />
                        <col className="w-[11%]" />
                        <col className="w-[11%]" />
                        <col className="w-[27%]" />
                      </colgroup>
                      <tbody>
                        {filteredTests.map((test) => (
                          <tr
                            key={test.id}
                            className="group hover:bg-surface-bright transition-all border-b border-surface-container"
                          >
                            <td className="px-6 py-5">
                              <span className="font-headline font-bold text-primary-container">
                                {test.id}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-sm text-on-surface-variant">
                              {test.assignedAt}
                            </td>
                            <td className="px-6 py-5">
                              <span
                                className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded-full ${TEST_TYPE_STYLES[test.type]}`}
                              >
                                {test.type}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <AssignedLevelBlocks levels={test.levels} />
                            </td>
                            <td className="px-6 py-5 font-headline font-bold text-primary-container">
                              {test.score ?? "—"}
                            </td>
                            <td className="px-6 py-5">
                              {test.status === "Graded" ? (
                                <span className="bg-secondary-container text-on-secondary-container text-[10px] font-extrabold uppercase px-2 py-1 rounded-full">
                                  Graded
                                </span>
                              ) : (
                                <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-extrabold uppercase px-2 py-1 rounded-full">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button className="p-1.5 text-on-surface-variant hover:text-primary-container transition-colors">
                                  <span className="material-symbols-outlined text-xl">
                                    print
                                  </span>
                                </button>
                                <button className="p-1.5 text-on-surface-variant hover:text-error transition-colors">
                                  <span className="material-symbols-outlined text-xl">
                                    delete
                                  </span>
                                </button>
                                {test.status === "Graded" ? (
                                  <button className="ml-2 bg-primary-container/10 text-primary-container w-20 h-8 rounded-md text-xs font-bold hover:bg-primary-container hover:text-white transition-all flex items-center justify-center gap-1">
                                    <span className="material-symbols-outlined text-sm">
                                      edit
                                    </span>
                                    Edit
                                  </button>
                                ) : (
                                  <button className="ml-2 bg-primary-container text-white w-20 h-8 rounded-md text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1">
                                    <span className="material-symbols-outlined text-sm">
                                      fact_check
                                    </span>
                                    Grade
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </TableContainer>
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}
