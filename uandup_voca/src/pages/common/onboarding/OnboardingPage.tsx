import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { OnboardingNav } from './ui/OnboardingNav';
import { StudentForm } from './ui/StudentForm';
import { ParentForm } from './ui/ParentForm';
import { TeacherForm } from './ui/TeacherForm';
import { selectClass, selectStyle } from './ui/formStyles';
import type { StudentFormState, TeacherFormState, ParentFormState } from './model/types';

type UserType = '학생' | '학부모' | '선생님';

const EXAM_BADGES = [
  'MAP',
  'Junior TOEFL',
  'TOEFL',
  'SSAT',
  'ISEE',
  'SAT',
  'AP Lang',
  'IB English',
] as const;

const INITIAL_STUDENT: StudentFormState = {
  nameKo: '',
  nameLastEn: '',
  nameFirstEn: '',
  grade: 0,
};

const INITIAL_TEACHER: TeacherFormState = {
  nameKo: '',
  nameLastEn: '',
  nameFirstEn: '',
};

const INITIAL_PARENT: ParentFormState = {
  nameKo: '',
  phone: '',
  phoneConsent: false,
  childNameKo: '',
  childGrade: '',
};

function isStudentValid(f: StudentFormState) {
  return !!(f.nameKo && f.nameLastEn && f.nameFirstEn && f.grade);
}

function isTeacherValid(f: TeacherFormState) {
  return !!f.nameKo;
}

function isParentValid(f: ParentFormState) {
  return !!(f.nameKo && f.phone && f.phoneConsent && f.childNameKo && f.childGrade);
}

const USER_TYPE_OPTIONS: { value: UserType; label: string; icon: string }[] = [
  { value: '학생', label: 'Student', icon: 'school' },
  { value: '학부모', label: 'Parent', icon: 'family_restroom' },
  { value: '선생님', label: 'Teacher', icon: 'person_book' },
];

export default function OnboardingPage() {
  const [userType, setUserType] = useState<UserType>('학생');
  const [student, setStudent] = useState<StudentFormState>(INITIAL_STUDENT);
  const [teacher, setTeacher] = useState<TeacherFormState>(INITIAL_TEACHER);
  const [parent, setParent] = useState<ParentFormState>(INITIAL_PARENT);

  const isValid =
    userType === '학생'
      ? isStudentValid(student)
      : userType === '선생님'
        ? isTeacherValid(teacher)
        : isParentValid(parent);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;
    // TODO: 회원가입 로직
  };

  return (
    <div className="min-h-screen primary-gradient flex flex-col">
      <OnboardingNav onLogoClick={() => navigate({ to: '/' })} />

      {/* Two-column layout */}
      <div className="flex-1 flex relative overflow-hidden">
        <img
          src="/landing_hero.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none select-none"
        />
        {/* Left — Hero */}
        <div className="pl-20 hidden lg:flex flex-1 w-1/2 flex-col items-center justify-center relative">
          <div className="flex flex-col items-center text-center max-w-lg">
            <div className="flex flex-col items-center justify-center mb-6 opacity-0 translate-y-4 animate-[fadeUp_0.7s_ease_0.3s_forwards]">
              <h1
                className="font-headline font-extrabold leading-tight text-on-primary"
                style={{ fontSize: '2.75rem', wordBreak: 'keep-all' }}
              >
                The Most Systematic Vocabulary Solution
              </h1>
              <h1
                className="font-headline font-extrabold leading-tight text-on-primary/60"
                style={{ fontSize: '2.5rem', wordBreak: 'keep-all' }}
              >
                Powered by
              </h1>
              <h1
                className="font-headline font-extrabold leading-tight text-on-primary/60"
                style={{ fontSize: '2.5rem', wordBreak: 'keep-all' }}
              >
                Individual Learning Data.
              </h1>
            </div>

            <p
              className="text-on-primary/70 leading-relaxed opacity-0 translate-y-4 animate-[fadeUp_0.7s_ease_0.5s_forwards]"
              style={{ fontSize: '1.125rem' }}
            >
              From progress monitoring to structured review,
            </p>
            <p
              className="text-on-primary/70 leading-relaxed mb-8 opacity-0 translate-y-4 animate-[fadeUp_0.7s_ease_0.5s_forwards]"
              style={{ fontSize: '1.125rem' }}
            >
              every step is precisely managed through our online system.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5 opacity-0 translate-y-4 animate-[fadeUp_0.7s_ease_0.7s_forwards]">
              {EXAM_BADGES.map((badge) => (
                <span
                  key={badge}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold bg-white/10 text-on-primary/80 border border-white/20"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Sign-up form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10 relative">
          <div className="w-full max-w-md">
            {/* Card */}
            <div className="bg-surface rounded-2xl p-8 shadow-[0_8px_40px_rgba(0,0,0,0.22)]">
              {/* Role selector */}
              <div className="mb-6">
                <div className="grid grid-cols-3 gap-2">
                  {USER_TYPE_OPTIONS.map(({ value, label, icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setUserType(value)}
                      className={`flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-xl border text-sm font-medium transition-all ${
                        userType === value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-outline-variant bg-surface text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-xl ${userType === value ? 'text-primary' : 'text-on-surface-variant'}`}
                      >
                        {icon}
                      </span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                  className={`sr-only ${selectClass}`}
                  style={selectStyle}
                  aria-label="User type"
                >
                  <option value="학생">학생</option>
                  <option value="학부모">학부모</option>
                  <option value="선생님">선생님</option>
                </select>

                {userType === '학생' && <StudentForm value={student} onChange={setStudent} />}
                {userType === '학부모' && <ParentForm value={parent} onChange={setParent} />}
                {userType === '선생님' && <TeacherForm value={teacher} onChange={setTeacher} />}

                <button
                  type="submit"
                  disabled={!isValid}
                  className="w-full py-3.5 rounded-xl bg-primary text-on-primary text-sm font-semibold transition-opacity mt-1 disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:opacity-90"
                >
                  Sign Up
                </button>
              </form>

              {/* Notice */}
              <div className="mt-5 flex items-start gap-2.5 px-4 py-3.5 rounded-xl bg-secondary-container/30 border border-outline-variant">
                <span className="material-symbols-outlined text-base text-on-surface-variant mt-0.5 shrink-0">
                  info
                </span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Your account will be reviewed by an administrator. You will gain access to the
                  service once approved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
