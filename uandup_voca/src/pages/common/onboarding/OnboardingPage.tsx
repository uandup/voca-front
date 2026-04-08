import { useState } from "react";

type UserType = "학생" | "학부모" | "선생님";

const GRADES = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);

const SELECT_ARROW = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23444652' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`;

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-outline-variant bg-white text-on-surface text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline";

const selectClass =
  "w-full px-4 py-3 rounded-xl border border-outline-variant bg-white text-on-surface text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none cursor-pointer";

const selectStyle = {
  backgroundImage: SELECT_ARROW,
  backgroundRepeat: "no-repeat" as const,
  backgroundPosition: "right 16px center",
};

export default function OnboardingPage() {
  const [userType, setUserType] = useState<UserType>("학생");

  // 학생
  const [studentNameKo, setStudentNameKo] = useState("");
  const [studentNameEn, setStudentNameEn] = useState("");
  const [studentGrade, setStudentGrade] = useState("");

  // 학부모
  const [parentPhone, setParentPhone] = useState("");
  const [childName, setChildName] = useState("");
  const [childGrade, setChildGrade] = useState("");

  // 선생님
  const [teacherName, setTeacherName] = useState("");
  const [teacherNameEn, setTeacherNameEn] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 회원가입 로직
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-10">
      <div className="w-full max-w-md px-5">
        {/* 로고 */}
        <div className="flex items-center justify-center ">
          <img
            src="/logo.png"
            alt="유앤UP국제학원"
            className="h-24 w-auto object-contain"
          />
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
              className={selectClass.replace(
                "border-outline-variant",
                "border-primary",
              )}
              style={selectStyle}
            >
              <option value="학생">학생</option>
              <option value="학부모">학부모</option>
              <option value="선생님">선생님</option>
            </select>
          </div>

          {/* 학생 폼 */}
          {userType === "학생" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-on-surface">
                  한글 이름 <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  placeholder="한글 이름을 입력해주세요"
                  value={studentNameKo}
                  onChange={(e) => setStudentNameKo(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-on-surface">
                  영어 이름 <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  placeholder="영어 이름을 입력해주세요"
                  value={studentNameEn}
                  onChange={(e) => setStudentNameEn(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-on-surface">
                  학년 <span className="text-error">*</span>
                </label>
                <select
                  value={studentGrade}
                  onChange={(e) => setStudentGrade(e.target.value)}
                  className={selectClass}
                  style={selectStyle}
                >
                  <option value="" disabled>
                    학년을 선택해주세요
                  </option>
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* 학부모 폼 */}
          {userType === "학부모" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-on-surface">
                  연락처 <span className="text-error">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="연락처를 입력해주세요"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-on-surface">
                  자녀 이름 <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  placeholder="한글 또는 영어 이름"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-on-surface">
                  학생 학년 <span className="text-error">*</span>
                </label>
                <select
                  value={childGrade}
                  onChange={(e) => setChildGrade(e.target.value)}
                  className={selectClass}
                  style={selectStyle}
                >
                  <option value="" disabled>
                    학년을 선택해주세요
                  </option>
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* 선생님 폼 */}
          {userType === "선생님" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-on-surface">
                  이름 <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  placeholder="이름을 입력해주세요"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-on-surface">
                  영어 이름 <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  placeholder="영어 이름을 입력해주세요"
                  value={teacherNameEn}
                  onChange={(e) => setTeacherNameEn(e.target.value)}
                  className={inputClass}
                />
              </div>
            </>
          )}

          {/* 완료 버튼 */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity mt-1"
          >
            완료
          </button>
        </form>

        {/* 알림 */}
        <div className="mt-5 px-4 py-3.5 rounded-xl bg-[#fffde7] border border-[#f9e87f]">
          <p className="text-sm text-[#7a6c00]">
            <span className="font-bold">알림:</span> 정보 입력 후 관리자 승인을
            기다려주세요. 승인 완료 시 서비스를 이용할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
