import { useState } from "react";
import { PageTitle } from "@/shared/ui/PageTitle";
import { PendingApprovalsModal } from "./ui/modals/PendingApprovalsModal";
import { UnassignedStudentsModal } from "./ui/modals/UnassignedStudentsModal";


const shortcutCards = [
  {
    icon: "school",
    current: { label: "SAT", sub: "13:00 - 17:00" },
    next: { label: "G10 English", sub: "18:00 - 19:00" },
    title: "Class",
  },
  {
    icon: "groups",
    current: { label: "15:00 - 17:00", sub: "4 / 6 enrolled" },
    next: { label: "18:00 - 20:00", sub: "3 / 6 enrolled" },
    title: "Clinic",
  },
];

export default function DashBoard() {
  const [isPendingOpen, setIsPendingOpen] = useState(false);
  const [isUnassignedOpen, setIsUnassignedOpen] = useState(false);

  return (
    <main>
      <section className="mb-10">
        <PageTitle title="Dashboard" />
        <p className="-mt-4 text-on-surface-variant font-medium">
          Welcome back. Here's a quick overview for today.
        </p>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Pending Approvals */}
        <button
          onClick={() => setIsPendingOpen(true)}
          className="group flex flex-col items-start p-7 rounded-2xl text-left bg-linear-to-br from-primary to-primary-container border-transparent shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95"
        >
          <span className="material-symbols-outlined mb-5 p-2 rounded-xl text-xl bg-white/15 text-white">
            person_add
          </span>
          <span className="text-3xl font-headline font-black mb-1 text-white">4</span>
          <span className="text-sm font-bold mb-4 text-white/80">Pending Approvals</span>
          <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 text-white transition-colors group-hover:bg-white group-hover:text-primary">
            4 waiting
          </span>
        </button>

        {/* Unassigned Students */}
        <button
          onClick={() => setIsUnassignedOpen(true)}
          className="group flex flex-col items-start p-7 rounded-2xl text-left bg-linear-to-br from-primary to-primary-container border-transparent shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95"
        >
          <span className="material-symbols-outlined mb-5 p-2 rounded-xl text-xl bg-white/15 text-white">
            assignment_ind
          </span>
          <span className="text-3xl font-headline font-black mb-1 text-white">3</span>
          <span className="text-sm font-bold mb-4 text-white/80">Unassigned Students</span>
          <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 text-white transition-colors group-hover:bg-white group-hover:text-primary">
            3 students
          </span>
        </button>

        {/* Shortcut Cards */}
        {shortcutCards.map((card) => (
          <div
            key={card.title}
            className="flex flex-col rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm overflow-hidden"
          >
            {/* 헤더 */}
            <div className="flex items-center gap-2 px-6 pt-5 pb-4">
              <span className="material-symbols-outlined p-2 rounded-xl text-xl bg-primary/10 text-primary">
                {card.icon}
              </span>
              <span className="text-sm font-black uppercase tracking-widest text-on-surface-variant">
                {card.title}
              </span>
            </div>

            {/* Current / Next */}
            <div className="flex divide-x divide-outline-variant/20 border-t border-outline-variant/20 flex-1">
              {[
                { slot: "Current", data: card.current },
                { slot: "Next", data: card.next },
              ].map(({ slot, data }) => (
                <button
                  key={slot}
                  className="group/slot flex-1 flex flex-col justify-between px-6 py-4 text-left hover:bg-surface-container-low transition-colors"
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 mb-1">
                      {slot}
                    </p>
                    <p className="text-base font-headline font-black text-primary leading-tight">
                      {data.label}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {data.sub}
                    </p>
                  </div>
                  <div className="flex justify-end mt-3">
                    <span className="material-symbols-outlined text-sm text-on-surface-variant/30 group-hover/slot:text-primary group-hover/slot:translate-x-0.5 transition-all duration-200">
                      arrow_forward
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      {isPendingOpen && (
        <PendingApprovalsModal onClose={() => setIsPendingOpen(false)} />
      )}
      {isUnassignedOpen && (
        <UnassignedStudentsModal onClose={() => setIsUnassignedOpen(false)} />
      )}

      {/* Mini Timetable */}
      {/* <section className="mt-8">
        <h2 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-3">
          Today's Schedule
        </h2>
        <div className="max-w-2xl">
          <MiniTimetable />
        </div>
      </section> */}
    </main>
  );
}
