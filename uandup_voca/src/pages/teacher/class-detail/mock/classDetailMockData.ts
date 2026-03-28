export interface StudentRow {
  id: string;
  initials: string;
  avatarColor: string;
  name: string;
  email: string;
  grade: string;
  lastTestDate: string;
  assignedLevel: string;
  recentScore: string;
  accuracy: string;
  trend: "up" | "down" | "flat";
}

export interface ClassDetailData {
  classId: string;
  className: string;
  subtitle: string;
  classAverage: string;
  averageDelta: string;
  studentCount: number;
  capacity: number;
  students: StudentRow[];
}

export const CLASS_DETAIL_MOCK: ClassDetailData = {
  classId: "g10-english-a",
  className: "G10 English A",
  subtitle: "Linguistic Rhetoric & Advanced Vocabulary Mastery",
  classAverage: "88.5%",
  averageDelta: "+2.4% vs last month",
  studentCount: 24,
  capacity: 30,
  students: [
    {
      id: "1",
      initials: "EA",
      avatarColor: "bg-primary-fixed text-on-primary-fixed-variant",
      name: "Elena Arisawa",
      email: "elena.a@scholar.edu",
      grade: "A+",
      lastTestDate: "Oct 24, 2024",
      assignedLevel: "Advanced (C1)",
      recentScore: "38/40",
      accuracy: "95.0%",
      trend: "up",
    },
    {
      id: "2",
      initials: "JM",
      avatarColor: "bg-secondary-fixed text-on-secondary-fixed-variant",
      name: "Julian Miller",
      email: "j.miller@scholar.edu",
      grade: "B+",
      lastTestDate: "Oct 23, 2024",
      assignedLevel: "Upper-Int (B2)",
      recentScore: "32/40",
      accuracy: "82.4%",
      trend: "down",
    },
    {
      id: "3",
      initials: "SK",
      avatarColor: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
      name: "Sana Khan",
      email: "sana.k@scholar.edu",
      grade: "A",
      lastTestDate: "Oct 24, 2024",
      assignedLevel: "Advanced (C1)",
      recentScore: "36/40",
      accuracy: "91.2%",
      trend: "up",
    },
    {
      id: "4",
      initials: "LB",
      avatarColor: "bg-primary-fixed text-on-primary-fixed-variant",
      name: "Liam Bennett",
      email: "l.bennett@scholar.edu",
      grade: "B",
      lastTestDate: "Oct 21, 2024",
      assignedLevel: "Intermediate (B1)",
      recentScore: "30/40",
      accuracy: "76.8%",
      trend: "flat",
    },
  ],
};
