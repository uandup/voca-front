import { GRADES, inputClass, selectClass, selectStyle } from "./formStyles";

interface Props {
  phone: string;
  childName: string;
  childGrade: string;
  onChangePhone: (v: string) => void;
  onChangeChildName: (v: string) => void;
  onChangeChildGrade: (v: string) => void;
}

export function ParentForm({ phone, childName, childGrade, onChangePhone, onChangeChildName, onChangeChildGrade }: Props) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-on-surface">
          연락처 <span className="text-error">*</span>
        </label>
        <input
          type="tel"
          placeholder="연락처를 입력해주세요"
          value={phone}
          onChange={(e) => onChangePhone(e.target.value)}
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
          onChange={(e) => onChangeChildName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-on-surface">
          학생 학년 <span className="text-error">*</span>
        </label>
        <select
          value={childGrade}
          onChange={(e) => onChangeChildGrade(e.target.value)}
          className={selectClass}
          style={selectStyle}
        >
          <option value="" disabled>학년을 선택해주세요</option>
          {GRADES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
    </>
  );
}
