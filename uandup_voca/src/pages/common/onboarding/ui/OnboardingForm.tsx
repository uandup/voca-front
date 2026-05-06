import { useState } from 'react';
import { StudentForm } from './StudentForm';
import { ParentForm } from './ParentForm';
import { TeacherForm } from './TeacherForm';
import { selectClass, selectStyle } from './formStyles';
import {
  USER_TYPE_OPTIONS,
  INITIAL_STUDENT,
  INITIAL_TEACHER,
  INITIAL_PARENT,
} from '../model/constants';
import { isStudentValid, isTeacherValid, isParentValid } from '../lib/validate';
import { buildProfileBody } from '../api/utils';
import { useRegist } from '../model/useRegist';
import type {
  MemberRole,
  StudentFormState,
  TeacherFormState,
  ParentFormState,
} from '@/entities/member';

export function OnboardingForm() {
  const [userType, setUserType] = useState<MemberRole>('STUDENT');
  const [student, setStudent] = useState<StudentFormState>(INITIAL_STUDENT);
  const [teacher, setTeacher] = useState<TeacherFormState>(INITIAL_TEACHER);
  const [parent, setParent] = useState<ParentFormState>(INITIAL_PARENT);

  const { isSubmitting, submit } = useRegist();

  const isValid =
    userType === 'STUDENT'
      ? isStudentValid(student)
      : userType === 'TEACHER'
        ? isTeacherValid(teacher)
        : isParentValid(parent);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;
    submit(buildProfileBody(userType, student, teacher, parent));
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10 relative">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-2xl p-8 shadow-[0_8px_40px_rgba(0,0,0,0.22)]">
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
              onChange={(e) => setUserType(e.target.value as MemberRole)}
              className={`sr-only ${selectClass}`}
              style={selectStyle}
              aria-label="User type"
            >
              <option value="STUDENT">Student</option>
              <option value="PARENT">Parent</option>
              <option value="TEACHER">Teacher</option>
            </select>

            {userType === 'STUDENT' && <StudentForm value={student} onChange={setStudent} />}
            {userType === 'PARENT' && <ParentForm value={parent} onChange={setParent} />}
            {userType === 'TEACHER' && <TeacherForm value={teacher} onChange={setTeacher} />}

            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full py-3.5 rounded-xl bg-primary text-on-primary text-sm font-semibold transition-opacity mt-1 disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:opacity-90"
            >
              {isSubmitting ? 'Submitting...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-5 flex items-start gap-2.5 px-4 py-3.5 rounded-xl bg-secondary-container/30 border border-outline-variant">
            <span className="material-symbols-outlined text-base text-on-surface-variant mt-0.5 shrink-0">
              info
            </span>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Your account will be reviewed by an administrator.
              <br /> You will gain access to the service once approved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
