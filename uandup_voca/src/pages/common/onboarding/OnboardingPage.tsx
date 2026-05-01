import { useState } from 'react';
import { StudentForm } from './ui/StudentForm';
import { ParentForm } from './ui/ParentForm';
import { TeacherForm } from './ui/TeacherForm';
import { selectClass, selectStyle } from './ui/formStyles';
import type { StudentFormState, TeacherFormState, ParentFormState } from './model/types';

type UserType = '학생' | '학부모' | '선생님';

const INITIAL_STUDENT: StudentFormState = {
  nameLastKo: '',
  nameFirstKo: '',
  nameLastEn: '',
  nameFirstEn: '',
  grade: 0,
};

const INITIAL_TEACHER: TeacherFormState = {
  nameLastKo: '',
  nameFirstKo: '',
  nameLastEn: '',
  nameFirstEn: '',
};

const INITIAL_PARENT: ParentFormState = {
  nameLastKo: '',
  nameFirstKo: '',
  phone: '',
  phoneConsent: false,
  childNameLastKo: '',
  childNameFirstKo: '',
  childGrade: '',
};

function isStudentValid(f: StudentFormState) {
  return !!(f.nameLastKo && f.nameFirstKo && f.nameLastEn && f.nameFirstEn && f.grade);
}

function isTeacherValid(f: TeacherFormState) {
  return !!(f.nameLastKo && f.nameFirstKo);
}

function isParentValid(f: ParentFormState) {
  return !!(
    f.nameLastKo &&
    f.nameFirstKo &&
    f.phone &&
    f.phoneConsent &&
    f.childNameLastKo &&
    f.childNameFirstKo &&
    f.childGrade
  );
}

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;
    // TODO: 회원가입 로직
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-10">
      <div className="w-full max-w-md px-5">
        {/* 로고 */}
        <div className="flex items-center justify-center">
          <img src="/logo.png" alt="유앤UP국제학원" className="h-24 w-auto object-contain" />
        </div>

        {/* 타이틀 */}
        <div className="text-center mb-6">
          <p className="text-sm text-on-surface-variant">
            서비스 이용을 위해 몇 가지 정보를 입력해주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* 회원 유형 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-on-surface">
              회원 유형 <span className="text-error">*</span>
            </label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value as UserType)}
              className={selectClass.replace('border-outline-variant', 'border-primary')}
              style={selectStyle}
            >
              <option value="학생">학생</option>
              <option value="학부모">학부모</option>
              <option value="선생님">선생님</option>
            </select>
          </div>

          {userType === '학생' && (
            <StudentForm value={student} onChange={setStudent} />
          )}

          {userType === '학부모' && (
            <ParentForm value={parent} onChange={setParent} />
          )}

          {userType === '선생님' && (
            <TeacherForm value={teacher} onChange={setTeacher} />
          )}

          <button
            type="submit"
            disabled={!isValid}
            className="w-full py-3.5 rounded-xl bg-primary text-white text-sm font-semibold transition-opacity mt-1 disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:opacity-90"
          >
            완료
          </button>
        </form>

        {/* 알림 */}
        <div className="mt-5 px-4 py-3.5 rounded-xl bg-[#fffde7] border border-[#f9e87f]">
          <p className="text-sm text-[#7a6c00]">
            <span className="font-bold">알림:</span> 정보 입력 후 관리자 승인을 기다려주세요. 승인
            완료 시 서비스를 이용할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
