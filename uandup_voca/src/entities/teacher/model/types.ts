// ── Admin: Teacher Permission ───────────────────────────────────────────────

export interface TeacherRow {
  id: number;
  name: string;
  englishName: string;
  isAdmin: boolean;
}

// ── Admin: Teacher Manage ───────────────────────────────────────────────────

export interface TeacherManageRow {
  id: number;
  name: string;
  nameFirstEn: string;
  nameLastEn: string;
  isAdmin: boolean;
}
