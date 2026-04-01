import { useState } from "react";
import { ModalBackdrop } from "@/shared/ui/ModalBackdrop";

interface UnassignedStudent {
  id: number;
  nameKo: string;
  name: string;
  grade: number;
  clinics: string[];
}

const MOCK_UNASSIGNED: UnassignedStudent[] = [
  {
    id: 1,
    nameKo: "강지수",
    name: "Kang Jisu",
    grade: 10,
    clinics: ["MON 13:00~15:00", "WED 18:00~20:00"],
  },
  {
    id: 2,
    nameKo: "오민준",
    name: "Oh Minjun",
    grade: 9,
    clinics: ["TUE 13:00~15:00"],
  },
  { id: 3, nameKo: "신예린", name: "Shin Yerin", grade: 11, clinics: [] },
  {
    id: 4,
    nameKo: "한도윤",
    name: "Han Doyun",
    grade: 10,
    clinics: ["MON 13:00~15:00", "THU 15:00~17:00", "SAT 10:00~12:00"],
  },
  {
    id: 5,
    nameKo: "이준혁",
    name: "Lee Junhyuk",
    grade: 12,
    clinics: ["FRI 15:00~17:00"],
  },
];

interface AssignFormState {
  levels: number[];
  quantity: number;
}

interface UnassignedStudentsModalProps {
  onClose: () => void;
}

export function UnassignedStudentsModal({
  onClose,
}: UnassignedStudentsModalProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [assigned, setAssigned] = useState<Set<number>>(new Set());
  const [forms, setForms] = useState<Record<number, AssignFormState>>({});

  function getForm(id: number): AssignFormState {
    return forms[id] ?? { levels: [1], quantity: 25 };
  }

  function toggleLevel(id: number, level: number) {
    const form = getForm(id);
    const levels = form.levels.includes(level)
      ? form.levels.length > 1
        ? form.levels.filter((l) => l !== level)
        : form.levels
      : [...form.levels, level];
    setForms((prev) => ({ ...prev, [id]: { ...form, levels } }));
  }

  function setQuantity(id: number, quantity: number) {
    setForms((prev) => ({ ...prev, [id]: { ...getForm(id), quantity } }));
  }

  function handleAssign(id: number) {
    setAssigned((prev) => new Set(prev).add(id));
    setExpandedId(null);
  }

  function handleRowClick(id: number) {
    if (assigned.has(id)) return;
    setExpandedId((prev) => (prev === id ? null : id));
  }

  const unassigned = MOCK_UNASSIGNED.filter((s) => !assigned.has(s.id));

  return (
    <ModalBackdrop onClose={onClose} padding="p-6">
      <div className="w-full max-w-2xl bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-7 py-5 border-b border-outline-variant/30 flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-headline text-xl font-bold text-primary">
              Unassigned Students
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {unassigned.length} student{unassigned.length !== 1 ? "s" : ""}{" "}
              without test assignment
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* List */}
        <div
          className="overflow-y-auto divide-y divide-outline-variant/20 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-outline-variant/40"
          style={{ height: "390px" }}
        >
          {unassigned.length === 0 ? (
            <div className="flex flex-col pb-24 items-center justify-center h-full text-on-surface-variant/50">
              <span className="material-symbols-outlined text-4xl mb-2">
                check_circle
              </span>
              <p className="text-sm font-bold">All students assigned!</p>
            </div>
          ) : (
            unassigned.map((student) => {
              const isExpanded = expandedId === student.id;
              const form = getForm(student.id);

              return (
                <div key={student.id}>
                  {/* 행 */}
                  <button
                    onClick={() => handleRowClick(student.id)}
                    className="w-full flex items-center justify-between px-7 py-4 text-left hover:bg-surface-container-low/50 transition-colors"
                  >
                    <div>
                      <p className="font-headline font-bold text-sm text-on-surface">
                        {student.nameKo}
                        <span className="text-xs font-medium text-on-surface-variant ml-1.5">
                          ( {student.name} · G{student.grade} )
                        </span>
                      </p>
                      {student.clinics.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {student.clinics.map((c) => (
                            <span
                              key={c}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-on-surface-variant/40 mt-1">
                          No clinic
                        </p>
                      )}
                    </div>
                    <span
                      className={`material-symbols-outlined text-on-surface-variant/40 transition-transform duration-200 shrink-0 ml-4 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      expand_more
                    </span>
                  </button>

                  {/* 인라인 배정 폼 */}
                  {isExpanded && (
                    <div className="px-7 pb-5 bg-surface-container-low/30">
                      <div className="bg-white rounded-xl border border-primary/10 p-4 flex items-center gap-4">
                        {/* Difficulty */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-primary-container whitespace-nowrap">
                            Difficulty:
                          </span>
                          <div className="flex gap-1 bg-surface-container-low p-1 rounded-lg">
                            {[1, 2, 3, 4].map((lvl) => (
                              <button
                                key={lvl}
                                onClick={() => toggleLevel(student.id, lvl)}
                                className={
                                  form.levels.includes(lvl)
                                    ? "px-3 py-1 text-xs font-bold rounded-md bg-primary-container text-white shadow-sm transition-all"
                                    : "px-3 py-1 text-xs font-semibold text-on-surface-variant hover:text-primary-container transition-all"
                                }
                              >
                                {lvl}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="h-6 w-px bg-slate-200 shrink-0" />

                        {/* Quantity */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-primary-container whitespace-nowrap">
                            QTY:
                          </span>
                          <input
                            className="w-16 bg-surface-container-low border-none rounded-lg py-1 px-2 text-xs font-bold text-primary-container focus:ring-1 focus:ring-primary/20"
                            type="number"
                            value={form.quantity}
                            onChange={(e) =>
                              setQuantity(student.id, Number(e.target.value))
                            }
                          />
                        </div>

                        <button
                          onClick={() => handleAssign(student.id)}
                          className="ml-auto flex items-center gap-1.5 bg-primary-container text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shrink-0"
                        >
                          <span className="material-symbols-outlined text-sm">
                            send
                          </span>
                          Assign
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </ModalBackdrop>
  );
}
