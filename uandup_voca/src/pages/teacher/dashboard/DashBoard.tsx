import { PageTitle } from "@/shared/ui/PageTitle";

const actionCards = [
  {
    icon: "person_add",
    count: 4,
    label: "Student Approvals",
    badge: "Review Pending",
  },
  {
    icon: "grading",
    count: 12,
    label: "Tests Needing Grading",
    badge: "Needs Action",
  },
  {
    icon: "assignment_ind",
    count: 3,
    label: "Unassigned Students",
    badge: "Assign Now",
  },
];

const quickNavItems = [
  {
    icon: "medical_services",
    title: "Go to Today's Clinic",
    subtitle: "Session starts in 45 mins",
  },
  {
    icon: "school",
    title: "Go to Class Dashboard",
    subtitle: "View detailed class analytics",
  },
];

const interventionStudents = [
  {
    name: "Marcus Holloway",
    assignedTo: "Literature IV",
    level: "B2 High",
    avgScore: "42%",
    scoreColor: "text-error",
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBcUkvGZD9vo_wLNX-scqvDfqQtnpXX2JUT8hIxL8yD5MSXuqG69MJD7_7z1mKz_VamvXkC979SyPGHApgV7CU2shs3o-9-lIiIs-YUbYlCMBDUrxOgaQ2gOmzw6CJZE7D74O77HeRyFtxWDaJ6wUWLzqwqlN-jEA6LF08sHB4QN3gPs0_uKFKE6pT11ysJBOYnMf4ovEZdJVyolwf3G-ikwCJm57aTZxQlT0i0xFLHO9v0iuRwhCHTS6oUnStU1lT--0kPUAl2iUqf",
  },
  {
    name: "Elena Rodriguez",
    assignedTo: "ESL Advanced",
    level: "C1 Intro",
    avgScore: "38%",
    scoreColor: "text-error",
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBZ6rad_9XYK0HUcI76T2Xuf9f6sG5w1E-dBXVvDF8WeVoq2eXqxQ2ZAdwxtBfew_im9-KrPbzuL4YJzwIt7iGHYn-b0-bczhlrCb0skembAMQ0yl3KE_YtWwxa5NyURvPGcSHgPA1VRjp26s9jRza3miS1GmFY-L2kTs3Ien00VxnSeR2vSaNOwOcL4nsEoG4-mY3BUwCU0RWAUt0ghKq6gSlZHv1v_VqsFYpMqzolK4I5H6T5Cu1taPCNJPor7Sg7CAg8Ka3-tEtV",
  },
  {
    name: "Siddharth Chen",
    assignedTo: "Business Lexicon",
    level: "A2 Base",
    avgScore: "45%",
    scoreColor: "text-on-secondary-container",
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDhASEuOxlf_FDmJhtHt0ZwC6zlqHCtViWVAoe0G9TYCVnzPvJj7LHEROFwYKjZZT4yIFzaBaMc58iVq26de0tDSVWBP-dDP02V8YSbcL20huHM8CR3YejegaP9HiY85s7TVZZK4ozIzfmiLUceZXyE0BNDwq58WJL-0iPFuvjoonN5Avf3it4irZqjDtP29zQzDlnu0KWAOwz04CcYAGy7jL42C9jKx7JuRke6ZtrOnNK6i90PM9igXKZk0sCYi3us2oe3BmWYL29b",
  },
];

export default function DashBoard() {
  return (
    <main>
      {/* Welcome Section */}
      <section className="mb-8">
        <PageTitle title="Teacher's Dashboard" />
        <p className="-mt-4 text-on-surface-variant font-medium">
          Welcome back, Julian. Here is your curation summary for today.
        </p>
      </section>

      {/* 1. Action Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {actionCards.map((card) => (
          <button
            key={card.label}
            className="group flex flex-col items-start p-8 rounded-xl bg-linear-to-br from-primary to-primary-container text-white shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 text-left"
          >
            <span className="material-symbols-outlined mb-4 p-2 bg-white/10 rounded-lg">
              {card.icon}
            </span>
            <span className="text-5xl font-headline font-black mb-2">
              {card.count}
            </span>
            <span className="text-lg font-headline font-bold opacity-90">
              {card.label}
            </span>
            <span className="mt-4 text-xs font-medium uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full group-hover:bg-white group-hover:text-primary transition-colors">
              {card.badge}
            </span>
          </button>
        ))}
      </section>

      {/* 2. Quick Navigation */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {quickNavItems.map((item) => (
          <button
            key={item.title}
            className="flex items-center justify-between p-6 bg-surface-container-lowest rounded-xl shadow-[0_8px_24px_rgba(0,21,80,0.08)] hover:bg-surface-container-low transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <div className="text-left">
                <span className="block text-primary font-headline font-bold">
                  {item.title}
                </span>
                <span className="text-xs text-on-surface-variant font-medium">
                  {item.subtitle}
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
              chevron_right
            </span>
          </button>
        ))}
      </section>

      {/* 3. Student Intervention List */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline font-extrabold text-xl text-primary">
              Students Requiring Intervention
            </h3>
            <p className="text-sm text-on-surface-variant">
              Prioritized by performance decline and current score average.
            </p>
          </div>
          <button className="text-primary-container font-headline font-bold text-sm hover:underline">
            View All Intervention Tasks
          </button>
        </div>

        <div className="bg-surface-container-low rounded-2xl overflow-hidden p-1">
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-highest/30">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Student Name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">
                    Current Level
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">
                    Avg. Score
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">
                    Trend
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {interventionStudents.map((student) => (
                  <tr
                    key={student.name}
                    className="group hover:bg-surface-bright transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                          <img
                            alt="Student"
                            className="w-full h-full object-cover"
                            src={student.imgSrc}
                          />
                        </div>
                        <div>
                          <p className="font-headline font-bold text-primary">
                            {student.name}
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            Assigned to: {student.assignedTo}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="px-3 py-1 bg-surface-container-highest text-primary text-xs font-bold rounded-full">
                        {student.level}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`font-headline font-extrabold ${student.scoreColor}`}
                      >
                        {student.avgScore}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="material-symbols-outlined text-error">
                        trending_down
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:shadow-lg transition-all active:scale-95">
                        Schedule Clinic
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
