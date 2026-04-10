import { useState } from 'react';
import { StudentForm } from './ui/StudentForm';
import { ParentForm } from './ui/ParentForm';
import { TeacherForm } from './ui/TeacherForm';
import { selectClass, selectStyle } from './ui/formStyles';

type UserType = '학생' | '학부모' | '선생님';

export default function OnboardingPage() {
  const [userType, setUserType] = useState<UserType>('학생');

  const [studentLastKo, setStudentLastKo] = useState('');
  const [studentFirstKo, setStudentFirstKo] = useState('');
  const [studentLastEn, setStudentLastEn] = useState('');
  const [studentFirstEn, setStudentFirstEn] = useState('');
  const [studentGrade, setStudentGrade] = useState('');

  const [parentLastKo, setParentLastKo] = useState('');
  const [parentFirstKo, setParentFirstKo] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentPhoneConsent, setParentPhoneConsent] = useState(false);
  const [childLastKo, setChildLastKo] = useState('');
  const [childFirstKo, setChildFirstKo] = useState('');
  const [childGrade, setChildGrade] = useState('');

  const [teacherLastKo, setTeacherLastKo] = useState('');
  const [teacherFirstKo, setTeacherFirstKo] = useState('');
  const [teacherLastEn, setTeacherLastEn] = useState('');
  const [teacherFirstEn, setTeacherFirstEn] = useState('');

  const isValid = () => {
    if (userType === '학생')
      return !!(studentLastKo && studentFirstKo && studentLastEn && studentFirstEn && studentGrade);
    if (userType === '학부모')
      return !!(
        parentLastKo &&
        parentFirstKo &&
        parentPhone &&
        parentPhoneConsent &&
        childLastKo &&
        childFirstKo &&
        childGrade
      );
    if (userType === '선생님') return !!(teacherLastKo && teacherFirstKo);
    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) return;
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
            <StudentForm
              nameLastKo={studentLastKo}
              nameFirstKo={studentFirstKo}
              nameLastEn={studentLastEn}
              nameFirstEn={studentFirstEn}
              grade={studentGrade}
              onChangeNameLastKo={setStudentLastKo}
              onChangeNameFirstKo={setStudentFirstKo}
              onChangeNameLastEn={setStudentLastEn}
              onChangeNameFirstEn={setStudentFirstEn}
              onChangeGrade={setStudentGrade}
            />
          )}

          {userType === '학부모' && (
            <ParentForm
              nameLastKo={parentLastKo}
              nameFirstKo={parentFirstKo}
              phone={parentPhone}
              phoneConsent={parentPhoneConsent}
              childLastKo={childLastKo}
              childFirstKo={childFirstKo}
              childGrade={childGrade}
              onChangeNameLastKo={setParentLastKo}
              onChangeNameFirstKo={setParentFirstKo}
              onChangePhone={setParentPhone}
              onChangePhoneConsent={setParentPhoneConsent}
              onChangeChildLastKo={setChildLastKo}
              onChangeChildFirstKo={setChildFirstKo}
              onChangeChildGrade={setChildGrade}
            />
          )}

          {userType === '선생님' && (
            <TeacherForm
              nameLastKo={teacherLastKo}
              nameFirstKo={teacherFirstKo}
              nameLastEn={teacherLastEn}
              nameFirstEn={teacherFirstEn}
              onChangeNameLastKo={setTeacherLastKo}
              onChangeNameFirstKo={setTeacherFirstKo}
              onChangeNameLastEn={setTeacherLastEn}
              onChangeNameFirstEn={setTeacherFirstEn}
            />
          )}

          <button
            type="submit"
            disabled={!isValid()}
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
